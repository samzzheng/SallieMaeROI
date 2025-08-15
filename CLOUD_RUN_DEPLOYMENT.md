# Google Cloud Run Deployment Guide

## Cloud Run Deployment Fixes Applied

✅ **Port Configuration Fixed**
- Container now listens on `PORT` environment variable (8080 for Cloud Run)
- Uses shell form CMD to properly substitute environment variables
- Added fallback to port 8000 for local development

✅ **Health Check Added**
- Implemented proper health endpoint at `/health`
- Added Docker healthcheck with appropriate timeouts
- 60-second start period for model loading

✅ **Container Optimization**
- Added `.dockerignore` to reduce build context
- Optimized layer caching
- Installed curl for health checks

## Deployment Commands

### 1. Build and Push to Google Container Registry

```bash
# Set your project ID
export PROJECT_ID="sallie-mae-468719"

# Build the image
docker build -t gcr.io/$PROJECT_ID/salliemaeroi-backend .

# Push to GCR
docker push gcr.io/$PROJECT_ID/salliemaeroi-backend
```

### 2. Deploy to Cloud Run

```bash
# Deploy with proper configuration and secure API key
gcloud run deploy salliemaeroi-service \
  --image gcr.io/$PROJECT_ID/salliemaeroi-backend \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --allow-unauthenticated \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### 3. Alternative: Using Artifact Registry

```bash
# Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Create repository
gcloud artifacts repositories create salliemaeroi \
  --repository-format=docker \
  --location=us-central1

# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push
docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/salliemaeroi/backend .
docker push us-central1-docker.pkg.dev/$PROJECT_ID/salliemaeroi/backend

# Deploy
gcloud run deploy salliemaeroi-service \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/salliemaeroi/backend \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --allow-unauthenticated \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

## Configuration Details

### Resource Requirements
- **Memory**: 2Gi (required for scikit-learn and XGBoost models)
- **CPU**: 2 vCPU (recommended for ML workloads)
- **Timeout**: 300 seconds (5 minutes for cold starts with model loading)
- **Port**: 8080 (Cloud Run standard)

### Environment Variables
- `PORT=8080` (automatically set by Cloud Run - do not override)
- `GEMINI_API_KEY` (must be set via Secret Manager or environment variable)

### Health Check
- Endpoint: `/health`
- Returns: `{"status": "healthy"}`
- Used by Cloud Run for readiness and liveness probes

## Troubleshooting

### Common Issues

1. **Container failed to start and listen on port**
   - ✅ Fixed: Now uses `PORT` environment variable correctly

2. **Memory issues during startup**
   - Increase memory allocation to 2Gi or higher
   - Consider using `--cpu` flag for better performance

3. **Timeout during cold starts**
   - Increased timeout to 300 seconds
   - Health check has 60-second start period for model loading

4. **API Key Issues**
   - Ensure the Gemini API key is valid and has proper permissions
   - Consider using Google Secret Manager for production deployments

### Verification

Test the deployed service:
```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe salliemaeroi-service --region=us-central1 --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Test prediction endpoint
curl -X POST "$SERVICE_URL/predict_roi" \
  -H "Content-Type: application/json" \
  -d '{
    "degree_type": "Bachelor'\''s Degree",
    "major_field": "Computer Science.",
    "control_type": "Public", 
    "state": "CA"
  }'

# Test AI analysis endpoint
curl -X POST "$SERVICE_URL/get_roi_analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "degree_type": "Bachelor'\''s Degree",
    "major_field": "Computer Science.",
    "control_type": "Public",
    "state": "CA",
    "predicted_income": 92879.35,
    "range_low": 83632.18,
    "range_high": 102126.52
  }'
```

## Security Considerations for Production

1. **API Key Management**
   ```bash
   # Store your NEW API key in Secret Manager (replace YOUR_NEW_API_KEY)
   echo "YOUR_NEW_API_KEY" | \
     gcloud secrets create gemini-api-key --data-file=-
   
   # Deploy with secret
   gcloud run deploy salliemaeroi-service \
     --image gcr.io/$PROJECT_ID/salliemaeroi-backend \
     --update-secrets GEMINI_API_KEY=gemini-api-key:latest
   ```

2. **Authentication**
   - Remove `--allow-unauthenticated` for production
   - Implement proper IAM controls

3. **HTTPS Only**
   - Cloud Run enforces HTTPS by default
   - Configure custom domains if needed

The container is now ready for successful Cloud Run deployment! 🚀