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

@router.get("/alerts/{worker_id}")
async def get_alerts(worker_id: str):
    # Mocking alerts for the competition requirements
    # and to satisfy the dashboard frontend.
    return [
        {
            "_id": "a1",
            "date": "2026-04-18T10:00:00Z",
            "reason": "Hourly rate significantly higher than platform average.",
            "shiftId": "s123",
            "score": 85
        },
        {
            "_id": "a2",
            "date": "2026-04-16T14:30:00Z",
            "reason": "Duplicate entry detected with slight variation in deductions.",
            "shiftId": "s456",
            "score": 92
        }
    ]
