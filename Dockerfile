FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY model/ ./model/
COPY data/ ./data/

# Expose the port Cloud Run expects
EXPOSE 8080

# Set the PORT environment variable for the CMD instruction
ENV PORT=8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Use shell form to allow environment variable substitution
CMD uvicorn main:app --host 0.0.0.0 --port $PORT