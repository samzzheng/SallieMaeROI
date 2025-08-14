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

encoder = None
model = None

@app.on_event("startup")
async def load_models():
    global encoder, model
    try:
        encoder = joblib.load("model/encoder.joblib")
        model = joblib.load("model/xgb_model.joblib")
        print("Models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {e}")
        raise e

class PredictionRequest(BaseModel):
    degree_type: str
    major_field: str
    control_type: str
    state: str

class PredictionResponse(BaseModel):
    predicted_income: float

@app.post("/predict_roi", response_model=PredictionResponse)
async def predict_roi(request: PredictionRequest):
    try:
        if encoder is None or model is None:
            print("ERROR: Models not loaded")
            raise HTTPException(status_code=500, detail="Models not loaded")
        
        print(f"Received request: {request}")
        
        # Create input as list of lists (matching the notebook approach)
        input_data = [[
            request.degree_type,
            request.major_field,
            request.control_type,
            request.state
        ]]
        
        print(f"Input data: {input_data}")
        
        encoded_data = encoder.transform(input_data)
        print(f"Encoded data shape: {encoded_data.shape}")
        
        prediction = model.predict(encoded_data)[0]
        print(f"Prediction: {prediction}")
        
        return PredictionResponse(predicted_income=float(prediction))
    
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