"""
api/main.py
===========
FastAPI inference server for emotion detection.

Endpoints:
  POST /predict   { "text": "..." } -> { mood, confidence, subMood, modelVersion, fallbackUsed }
  GET  /health    -> { status, modelVersion }

Run:
  uvicorn api.main:app --reload --port 8000
"""

import sys
from pathlib import Path

# Ensure the project root is in path so ml.inference resolves
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml.inference import predict as ml_predict

app = FastAPI(
    title="MoodTune Emotion API",
    description="Detects emotion from text. Supports English + Hinglish/Roman Urdu.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local dev only. Restrict in production.
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    mood: str
    confidence: float
    subMood: str | None
    modelVersion: str
    fallbackUsed: bool


@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(req: PredictRequest):
    """Predict mood from a text string."""
    result = ml_predict(req.text)
    return PredictResponse(**result)


@app.get("/health")
def health():
    """Health check — also tells you which model is loaded."""
    test_result = ml_predict("test")
    return {
        "status": "ok",
        "modelVersion": test_result["modelVersion"],
        "fallbackUsed": test_result["fallbackUsed"],
    }
