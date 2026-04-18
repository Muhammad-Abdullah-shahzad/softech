from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EarningData(BaseModel):
    earning_id: str
    worker_id: str
    gross_amount: float
    platform: str
    duration_hours: float

class AnomalyRequest(BaseModel):
    earning_id: str
    worker_id: str
    gross_amount: float
    platform: str
    duration_hours: float
    history: Optional[List[dict]] = []

class AnomalyResponse(BaseModel):
    earning_id: str
    is_anomaly: bool
    score: float
    explanation: str
    detected_at: datetime = datetime.now()
