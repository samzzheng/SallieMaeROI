# College ROI Predictor

A React frontend and FastAPI backend application that predicts median income 10 years after college enrollment based on degree type, major, school type, and state.

## Prerequisites

- Docker and Docker Compose installed
- The required model files: `encoder.joblib` and `xgb_model.joblib`

## Setup

1. **Place the model files** in the `model/` directory:
   ```
   mkdir model
   # Copy your encoder.joblib and xgb_model.joblib files to the model/ directory
   ```

2. **Build and run the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

```
.
├── main.py                 # FastAPI backend
├── requirements.txt        # Python dependencies
├── Dockerfile             # Backend Docker configuration
├── docker-compose.yml     # Orchestration configuration
├── model/                 # Directory for model files
│   ├── encoder.joblib     # OneHot encoder (place here)
│   └── xgb_model.joblib   # XGBoost model (place here)
└── frontend/              # React frontend
    ├── package.json       # Node.js dependencies
    ├── Dockerfile         # Frontend Docker configuration
    ├── public/
    │   └── index.html     # HTML template
    └── src/
        ├── index.js       # React entry point
        ├── App.js         # Main React component
        └── App.css        # Styling with Sallie Mae branding
```

## Features

- Professional UI with Sallie Mae branding (#003764 blue)
- Four required dropdown selections:
  - Degree Type (Associate, Bachelor, Certificates)
  - Major Field (40+ options from Agriculture to Visual Arts)
  - School Type (Public, Private Nonprofit, Private For-Profit)
  - State (All US states and territories)
- Real-time form validation
- Currency-formatted prediction display
- Responsive design for mobile and desktop
- Docker containerization for easy deployment
- Health checks and error handling

## API Endpoint

**POST /predict**
```json
{
  "degree_type": "Bachelor_Degree",
  "major_field": "Computer_Information_Sciences", 
  "control_type": "Public",
  "state": "DE"
}
```

**Response**
```json
{
  "predicted_income": 75000.0
}
```

## Development

To run without Docker:

**Backend:**
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```