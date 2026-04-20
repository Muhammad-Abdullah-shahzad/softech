# FairGig Microservices API Documentation

This document lists all available API endpoints across the microservices.

## 🔐 Auth Service (Port 5000)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| POST   | `/api/auth/signup` | Register a new user | test |
| POST   | `/api/auth/login` | Authenticate user | test |
| POST   | `/api/auth/logout` | Clear session/cookies | test |
| GET    | `/api/auth/me` | Get current logged-in user | test |
| GET    | `/api/protected` | Sample authorization check | test |

## 👤 Profile Service (Port 5006)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| GET    | `/profile/{user_id}` | Retrieve user profile details | test |
| POST   | `/profile/change-password` | Update user password | test |
| GET    | `/health` | Service health status | test |

## 💰 Earnings Service (Port 5002)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| POST   | `/api/earnings/` | Submit a new earning record | test |
| GET    | `/api/earnings/` | Get historical earning data | test |
| GET    | `/api/earnings/:id` | Get specific earning details | test |
| GET    | `/api/earnings/stats` | Verifier-level statistics | test |
| GET    | `/api/analytics/worker/:workerId` | Worker analytics (from Earnings) | test |
| GET    | `/api/analytics/aggregates` | Data aggregation | test |
| GET    | `/api/analytics/median` | Median calculation | test |
| GET    | `/api/analytics/community-insights` | Community data view | test |
| GET    | `/api/analytics/verifier/overview` | Verifier dashboard data | test |
| GET    | `/api/analytics/advocate/overview` | Advocate dashboard data | test |
| GET    | `/health` | Service health status | test |

## 📢 Grievance & Community Service (Port 5003)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| POST   | `/api/grievances/` | File a new grievance | test |
| GET    | `/api/grievances/` | List all grievances | test |
| GET    | `/api/grievances/trending` | Trending platform issues | test |
| POST   | `/api/community/` | Post to community forum | test |
| GET    | `/api/community/` | Get community feed | test |
| GET    | `/api/community/trending` | Top community discussions | test |
| GET    | `/api/community/my-posts` | User's own forum posts | test |
| GET    | `/api/community/advocate-stats` | Community health stats | test |
| POST   | `/api/community/broadcast` | Official advocate announcement | test |
| GET    | `/api/community/broadcasts` | List latest broadcasts | test |
| GET    | `/health` | Service health status | test |

## 📊 Analytics Service (Port 5004)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| GET    | `/api/analytics/kpis` | High-level platform KPIs | test |
| GET    | `/api/analytics/worker/:workerId` | Detailed worker stats | test |
| GET    | `/api/analytics/trends/:workerId` | Longitudinal trends | test |
| GET    | `/api/analytics/comparison/:workerId` | Platform benchmarking | test |
| GET    | `/api/analytics/city-median` | Regional earnings data | test |
| GET    | `/api/analytics/community-insights` | Aggregate community data | test |
| GET    | `/health` | Service health status | test |

## 📜 Certificate Service (Port 5005)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| GET    | `/api/certificates/:workerId` | View worker verification certificate | test |
| POST   | `/api/certificates/generate` | Issue new certificate | test |
| GET    | `/health` | Service health status | test |

## 🤖 Anomaly Detection Service (Port 8000)
| Method | Endpoint | Description | Status |
|        |          |             |        |
| POST   | `/detect-anomalies` | Statistical fraud detection engine | test |
| GET    | `/health` | Service health status | test |
