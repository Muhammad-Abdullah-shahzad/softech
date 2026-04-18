import numpy as np
from typing import List, Tuple
from app.schemas.anomaly import AnomalyRequest

class DetectorService:
    @staticmethod
    def analyze_earning(data: AnomalyRequest) -> Tuple[bool, float, str]:
        """
        Analyzes a single earning record for anomalies.
        Returns: (is_anomaly, score, explanation)
        """
        hourly_rate = data.gross_amount / data.duration_hours if data.duration_hours > 0 else 0
        
        # 1. Rule-based: Static Thresholds
        if hourly_rate > 150:
            return True, 0.95, f"Unrealistically high hourly rate (${hourly_rate:.2f}/hr) for platform {data.platform}."
        
        if data.duration_hours > 18:
            return True, 0.85, f"Shift duration ({data.duration_hours:.1f} hrs) exceeds standard labor limits."

        # 2. Statistical: Z-Score (Simulated if history is empty)
        if not data.history or len(data.history) < 3:
            # Baseline check if no history
            if 0 < hourly_rate < 5:
                return True, 0.70, "Hourly rate is significantly below average minimum wage expectations."
            return False, 0.10, "Record appears normal based on platform benchmarks."

        # Real statistical check on history
        rates = [h.get('gross_amount', 0) / h.get('duration_hours', 1) for h in data.history if h.get('duration_hours', 0) > 0]
        rates.append(hourly_rate)
        
        mean = np.mean(rates)
        std = np.std(rates)
        z_score = abs(hourly_rate - mean) / std if std > 0 else 0

        if z_score > 2.5:
            return True, min(0.9, z_score/5), f"Earning is a statistical outlier compared to worker history (Z-score: {z_score:.2f})."

        return False, z_score/10, "Income pattern is consistent with historical data."

detector_service = DetectorService()
