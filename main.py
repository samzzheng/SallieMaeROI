from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import xgboost as xgb
import os
import google.generativeai as genai

app = FastAPI(title="College ROI Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = None
gemini_model = None
college_costs_df = None

@app.on_event("startup")
async def load_models():
    global pipeline, gemini_model, college_costs_df
    try:
        pipeline = joblib.load("model/earnings_model_pipeline.joblib")
        print("Pipeline loaded successfully")
        
        # Load college costs data
        college_costs_df = pd.read_csv("data/college_net_price_final.csv")
        print(f"College costs data loaded successfully: {len(college_costs_df)} institutions")
        
        # Initialize Gemini
        API_KEY = os.getenv("GEMINI_API_KEY")
        if not API_KEY:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        genai.configure(api_key=API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        print("Gemini model initialized successfully")
    except Exception as e:
        print(f"Error loading models: {e}")
        raise e

class PredictionRequest(BaseModel):
    degree_type: str
    major_field: str
    control_type: str
    state: str
    institution_name: str

class PredictionResponse(BaseModel):
    predicted_income: float
    range_low: float
    range_high: float
    rmse: float
    r_squared: float
    annual_cost: float
    total_loan_amount: float
    monthly_payment: float
    total_interest_paid: float
    roi_percentage: float
    years_to_break_even: float

class ROIAnalysisRequest(BaseModel):
    degree_type: str
    major_field: str
    control_type: str
    state: str
    institution_name: str
    predicted_income: float
    range_low: float
    range_high: float
    annual_cost: float
    total_loan_amount: float
    monthly_payment: float
    total_interest_paid: float
    roi_percentage: float
    years_to_break_even: float

class ROIAnalysisResponse(BaseModel):
    analysis: str

def calculate_loan_payments(total_amount: float, annual_rate: float = 0.105, years: int = 10):
    """Calculate monthly loan payments using standard amortization formula"""
    monthly_rate = annual_rate / 12
    num_payments = years * 12
    
    if monthly_rate == 0:
        return total_amount / num_payments, 0
    
    monthly_payment = total_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
    total_paid = monthly_payment * num_payments
    total_interest = total_paid - total_amount
    
    return monthly_payment, total_interest

def get_college_cost(institution_name: str) -> float:
    """Get annual cost for a specific institution"""
    if college_costs_df is None:
        return 0.0
    
    college_row = college_costs_df[college_costs_df['INSTNM'] == institution_name]
    if len(college_row) > 0:
        return float(college_row.iloc[0]['NPT4_COMBINED'])
    return 0.0

def calculate_roi(predicted_income: float, total_education_investment: float, years: int = 10) -> tuple:
    """Calculate ROI percentage using the provided formula and years to break even"""
    if total_education_investment == 0:
        return 0.0, 0.0
    
    # ROI = ((Predicted Income × Years) - Total Investment) / Total Investment × 100
    total_earnings = predicted_income * years
    roi_percentage = ((total_earnings - total_education_investment) / total_education_investment) * 100
    
    # Calculate years to break even (when total earnings = total investment)
    if predicted_income > 0:
        years_to_break_even = total_education_investment / predicted_income
    else:
        years_to_break_even = float('inf')
    
    return roi_percentage, years_to_break_even

@app.get("/get_universities")
async def get_universities():
    """Return list of all universities for frontend dropdown"""
    if college_costs_df is None:
        raise HTTPException(status_code=500, detail="College data not loaded")
    
    universities = college_costs_df['INSTNM'].sort_values().tolist()
    return {"universities": universities}

@app.post("/predict_roi", response_model=PredictionResponse)
async def predict_roi(request: PredictionRequest):
    try:
        if pipeline is None:
            print("ERROR: Pipeline not loaded")
            raise HTTPException(status_code=500, detail="Pipeline not loaded")
        
        print(f"Received request: {request}")
        
        # Map degree types to CREDLEV codes
        degree_to_credlev = {
            "Associate's Degree": "2",
            "Bachelor's Degree": "3", 
            "Doctoral Degree": "5",
            "First Professional Degree": "6",
            "Master's Degree": "7"
        }
        
        # Create input DataFrame with exact column names expected by updated model
        input_df = pd.DataFrame({
            'CREDLEV': [degree_to_credlev.get(request.degree_type, "3")],  # Default to Bachelor's
            'CREDLEV_LABEL': [request.degree_type],
            'CIPDESC': [request.major_field],
            'CONTROL': [request.control_type],
            'STABBR': [request.state]
        })
        
        print(f"Input DataFrame: {input_df}")
        
        # Pipeline handles encoding and prediction
        prediction = pipeline.predict(input_df)[0]
        print(f"Prediction: {prediction}")
        
        # Model performance metrics from training
        rmse = 9247.17
        r_squared = 0.5706
        
        # Calculate prediction range using RMSE (±1 standard deviation equivalent)
        range_low = max(0, prediction - rmse)  # Ensure non-negative
        range_high = prediction + rmse
        
        # Get college cost and calculate loan information
        annual_cost = get_college_cost(request.institution_name)
        
        # Calculate total loan for degree (assume 4 years for Bachelor's, 2 for Associate's, etc.)
        degree_years = {"Associate's Degree": 2, "Bachelor's Degree": 4, "Master's Degree": 2, 
                       "Doctoral Degree": 4, "First Professional Degree": 3}.get(request.degree_type, 4)
        total_loan_amount = annual_cost * degree_years
        
        # Calculate loan payments with 10.5% interest rate over 10 years
        monthly_payment, total_interest_paid = calculate_loan_payments(total_loan_amount)
        
        # Calculate ROI using the provided formula
        roi_percentage, years_to_break_even = calculate_roi(prediction, total_loan_amount)
        
        return PredictionResponse(
            predicted_income=float(prediction),
            range_low=float(range_low),
            range_high=float(range_high),
            rmse=float(rmse),
            r_squared=float(r_squared),
            annual_cost=float(annual_cost),
            total_loan_amount=float(total_loan_amount),
            monthly_payment=float(monthly_payment),
            total_interest_paid=float(total_interest_paid),
            roi_percentage=float(roi_percentage),
            years_to_break_even=float(years_to_break_even)
        )
    
    except Exception as e:
        print(f"ERROR in predict_roi: {str(e)}")
        print(f"Exception type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/get_roi_analysis", response_model=ROIAnalysisResponse)
async def get_roi_analysis(request: ROIAnalysisRequest):
    try:
        if gemini_model is None:
            raise HTTPException(status_code=500, detail="Gemini model not loaded")
        
        print(f"Generating ROI analysis for: {request.major_field}, {request.degree_type}")
        
        # Create prompt for Gemini
        prompt = f"""As a financial advisor specializing in education ROI, analyze this college investment:

Institution: {request.institution_name}
Major: {request.major_field}
Degree Level: {request.degree_type}
Location: {request.state}
School Type: {request.control_type}

FINANCIAL BREAKDOWN:
- Annual College Cost: ${request.annual_cost:,.0f}
- Total Education Investment: ${request.total_loan_amount:,.0f}
- Student Loan Details: 10.5% average market interest rate over 10 years
- Monthly Loan Payment: ${request.monthly_payment:,.0f}
- Total Interest Paid: ${request.total_interest_paid:,.0f}
- 10-Year ROI: {request.roi_percentage:.1f}%
- Break-even Point: {request.years_to_break_even:.1f} years
- Predicted 10-Year Income: ${request.predicted_income:,.0f}
- Income Range: ${request.range_low:,.0f} - ${request.range_high:,.0f}

Provide a brief analysis (4-5 sentences) covering:
1. Cost-benefit analysis: Is the investment worth it given the loan terms?
2. How long to break even after graduation considering loan payments?
3. Market outlook for this field and institution value
4. One key insight about this financial scenario
5. One actionable recommendation for the student

Focus on the financial reality of student loans at 10.5% interest. Keep it concise and actionable. Plain text only."""

        # Generate content using Gemini
        response = gemini_model.generate_content(prompt)
        
        if response.text:
            return ROIAnalysisResponse(analysis=response.text)
        else:
            raise HTTPException(status_code=500, detail="Failed to generate analysis")
            
    except Exception as e:
        print(f"ERROR in get_roi_analysis: {str(e)}")
        print(f"Exception type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)