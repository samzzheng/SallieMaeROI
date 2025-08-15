from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import xgboost as xgb
import os

app = FastAPI(title="College ROI Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = None

@app.on_event("startup")
async def load_models():
    global pipeline
    try:
        pipeline = joblib.load("model/earnings_model_pipeline.joblib")
        print("Pipeline loaded successfully")
    except Exception as e:
        print(f"Error loading pipeline: {e}")
        raise e

class PredictionRequest(BaseModel):
    degree_type: str
    major_field: str
    control_type: str
    state: str

class PredictionResponse(BaseModel):
    predicted_income: float
    range_low: float
    range_high: float
    rmse: float
    r_squared: float

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
        
        return PredictionResponse(
            predicted_income=float(prediction),
            range_low=float(range_low),
            range_high=float(range_high),
            rmse=float(rmse),
            r_squared=float(r_squared)
        )
    
    except Exception as e:
        print(f"ERROR in predict_roi: {str(e)}")
        print(f"Exception type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)