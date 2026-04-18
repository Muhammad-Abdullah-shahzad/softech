from fastapi import APIRouter, HTTPException
from app.schemas.anomaly import AnomalyRequest, AnomalyResponse
from app.services.detector_service import detector_service

router = APIRouter(tags=["Anomalies"])

@router.post("/detect-anomalies", response_model=AnomalyResponse)
async def detect(request: AnomalyRequest):
    try:
        anomalies = detector_service.analyze_earnings(request)
        return AnomalyResponse(anomalies=anomalies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
