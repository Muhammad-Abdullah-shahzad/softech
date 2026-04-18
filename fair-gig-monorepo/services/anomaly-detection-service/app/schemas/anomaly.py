from pydantic import BaseModel
from typing import List

class EarningRecord(BaseModel):
    date: str
    hoursWorked: float
    grossAmount: float
    deductions: float
    netAmount: float

class AnomalyRequest(BaseModel):
    workerId: str
    earnings: List[EarningRecord]

class AnomalyDetail(BaseModel):
    type: str
    severity: str
    message: str
    affectedDates: List[str]
    suggestion: str

class AnomalyResponse(BaseModel):
    anomalies: List[AnomalyDetail]
