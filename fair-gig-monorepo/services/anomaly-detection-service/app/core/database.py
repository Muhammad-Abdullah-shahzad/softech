from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/softech")

client = AsyncIOMotorClient(MONGODB_URL)
database = client.softech

async def connect_to_mongo():
    try:
        await client.admin.command('ping')
        print("[Anomaly Service] Successfully connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    client.close()
