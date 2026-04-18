import numpy as np
import datetime
from typing import List
from app.schemas.anomaly import AnomalyRequest, AnomalyDetail

class DetectorService:
    @staticmethod
    def analyze_earnings(request: AnomalyRequest) -> List[AnomalyDetail]:
        anomalies = []
        if not request.earnings:
            return anomalies
            
        try:
            sorted_earnings = sorted(
                request.earnings, 
                key=lambda x: datetime.datetime.strptime(x.date, '%Y-%m-%d')
            )
        except Exception:
            sorted_earnings = request.earnings

        if not sorted_earnings:
            return anomalies

        current_e = sorted_earnings[-1]
        historic_e = sorted_earnings[:-1]
        
        # ---------------------------------------------------------
        # Logical Validation (Base Checks)
        # ---------------------------------------------------------
        if current_e.netAmount < 0 or current_e.grossAmount < 0:
            anomalies.append(AnomalyDetail(
                type="negative_value",
                severity="high",
                message="Your earnings log contains negative values.",
                affectedDates=[current_e.date],
                suggestion="Double check your submission. Pay amounts cannot be negative."
            ))
            
        if current_e.netAmount > current_e.grossAmount:
            anomalies.append(AnomalyDetail(
                type="logic_error",
                severity="high",
                message="Your net income was reported as higher than your gross income.",
                affectedDates=[current_e.date],
                suggestion="Deductions subtract from gross. Net cannot exceed gross. Please fix your log."
            ))
            
        if current_e.hoursWorked == 0 and current_e.grossAmount > 0:
            anomalies.append(AnomalyDetail(
                type="zero_hours",
                severity="high",
                message="You reported income but entered 0 hours worked.",
                affectedDates=[current_e.date],
                suggestion="If you got a bonus without working, log it separately. Otherwise update your hours."
            ))

        if not historic_e:
            return anomalies

        historic_net = [e.netAmount for e in historic_e]
        current_net = current_e.netAmount

        # ---------------------------------------------------------
        # 1. EXTREME INCOME SPIKE DETECTION (MANDATORY)
        # ---------------------------------------------------------
        mean_net = np.mean(historic_net)
        median_net = np.median(historic_net)

        if (mean_net > 0 and current_net > (mean_net * 5)) or (median_net > 0 and current_net > (median_net * 5)):
            max_past = max(mean_net, median_net)
            ratio = int(current_net / max_past) if max_past > 0 else 0
            anomalies.append(AnomalyDetail(
                type="income_spike",
                severity="high",
                message=f"Your income on {current_e.date} is unusually high compared to your typical earnings.",
                affectedDates=[current_e.date],
                suggestion=f"It is {ratio}x higher than your average income. This typically indicates a data entry error (e.g., extra zero) or a system glitch."
            ))

        # ---------------------------------------------------------
        # 2. SUDDEN INCOME DROP
        # ---------------------------------------------------------
        # Rule A: Single day drop vs typical historic volume
        if (mean_net > 0 and current_net < (mean_net * 0.2)) or (median_net > 0 and current_net < (median_net * 0.2)):
             if current_net > 0: # Only flag if they actually worked but got paid pennies
                anomalies.append(AnomalyDetail(
                    type="sudden_drop",
                    severity="high",
                    message=f"Your income on {current_e.date} is significantly lower than your typical daily average.",
                    affectedDates=[current_e.date],
                    suggestion="Ensure you entered the correct amount. If accurate, this indicates a massive underpayment for the shift."
                ))

        # Rule B: Window-based drop (Last 7 days vs Prev 7 days)
        try:
            latest_date = datetime.datetime.strptime(current_e.date, '%Y-%m-%d')
            last_7_days_income = 0
            prev_7_days_income = 0
            
            for e in sorted_earnings:
                e_date = datetime.datetime.strptime(e.date, '%Y-%m-%d')
                days_diff = (latest_date - e_date).days
                if 0 <= days_diff < 7:
                    last_7_days_income += e.netAmount
                elif 7 <= days_diff < 14:
                    prev_7_days_income += e.netAmount
            
            if prev_7_days_income > 0:
                drop_ratio = (prev_7_days_income - last_7_days_income) / prev_7_days_income
                if drop_ratio > 0.20:
                    anomalies.append(AnomalyDetail(
                        type="income_drop",
                        severity="high" if drop_ratio > 0.40 else "medium",
                        message=f"Your combined income for the last 7 days dropped {int(drop_ratio * 100)}% compared to the week before.",
                        affectedDates=[current_e.date],
                        suggestion="Check if your platform access was throttled or if commissions were increased."
                    ))
        except:
            pass

        # ---------------------------------------------------------
        # 3. Z-SCORE OUTLIER DETECTION
        # ---------------------------------------------------------
        if len(historic_net) >= 3:
            std_net = np.std(historic_net)
            if std_net > 0:
                z = (current_net - np.mean(historic_net)) / std_net
                if abs(z) > 3:
                    if not any(a.type == "income_spike" for a in anomalies):
                        anomalies.append(AnomalyDetail(
                            type="zscore_outlier",
                            severity="high",
                            message="This shift income is a statistical outlier (Z-score > 3).",
                            affectedDates=[current_e.date],
                            suggestion="Our system flagged this record because it is mathematically inconsistent with your normal patterns."
                        ))

        # ---------------------------------------------------------
        # 4. IQR METHOD
        # ---------------------------------------------------------
        if len(historic_net) >= 4:
            q1, q3 = np.percentile(historic_net, [25, 75])
            iqr = q3 - q1
            if current_net < (q1 - 1.5*iqr) or current_net > (q3 + 1.5*iqr):
                if not any(a.type in ["income_spike", "sudden_drop", "zscore_outlier"] for a in anomalies):
                    anomalies.append(AnomalyDetail(
                        type="iqr_outlier",
                        severity="medium",
                        message="Your income falls outside the typical interquartile range bounds for your account.",
                        affectedDates=[current_e.date],
                        suggestion="Review this entry for accuracy."
                    ))

        # ---------------------------------------------------------
        # 5. DEDUCTION ANOMALY
        # ---------------------------------------------------------
        historic_ratios = [(e.deductions / e.grossAmount) for e in historic_e if e.grossAmount > 0]
        if historic_ratios:
            avg_ratio = np.mean(historic_ratios)
            current_ratio = (current_e.deductions / current_e.grossAmount) if current_e.grossAmount > 0 else 0
            if current_ratio > (avg_ratio + 0.15):
                anomalies.append(AnomalyDetail(
                    type="deduction_spike",
                    severity="high",
                    message=f"Deductions for this shift ({int(current_ratio*100)}%) were significantly higher than your typical average ({int(avg_ratio*100)}%).",
                    affectedDates=[current_e.date],
                    suggestion="Check for unexplained platform penalties or insurance fee spikes."
                ))

        # ---------------------------------------------------------
        # 6. HOURLY RATE ANOMALY
        # ---------------------------------------------------------
        historic_rates = [e.netAmount / e.hoursWorked for e in historic_e if e.hoursWorked > 0]
        if historic_rates and current_e.hoursWorked > 0:
            current_rate = current_e.netAmount / current_e.hoursWorked
            mean_rate = np.mean(historic_rates)
            std_rate = np.std(historic_rates)
            if std_rate > 0:
                z_rate = (current_rate - mean_rate) / std_rate
                if abs(z_rate) > 3:
                    anomalies.append(AnomalyDetail(
                        type="hourly_rate_anomaly",
                        severity="medium",
                        message=f"Your hourly rate (₹{int(current_rate)}/hr) is a statistical outlier compared to your normal ₹{int(mean_rate)}/hr.",
                        affectedDates=[current_e.date],
                        suggestion="Ensure you logged your start/end times correctly."
                    ))

        return anomalies

detector_service = DetectorService()
