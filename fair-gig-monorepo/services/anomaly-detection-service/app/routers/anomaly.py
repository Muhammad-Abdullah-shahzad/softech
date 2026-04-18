from fastapi import APIRouter, HTTPException
from app.schemas.anomaly import AnomalyRequest, AnomalyResponse
from app.services.detector_service import detector_service

router = APIRouter(prefix="/v1", tags=["Anomalies"])

@router.post("/detect-anomalies", response_model=AnomalyResponse)
async def detect(request: AnomalyRequest):
    try:
        is_anomaly, score, explanation = detector_service.analyze_earning(request)
        
        return AnomalyResponse(
            earning_id=request.earning_id,
            is_anomaly=is_anomaly,
            score=score,
            explanation=explanation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
