from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import anomaly
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="FairGig Anomaly Detection Service",
    description="Statistical & Rule-based fraud detection for gig earnings.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(anomaly.router)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "anomaly-detection"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
