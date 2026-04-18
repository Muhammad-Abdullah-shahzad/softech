import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from dotenv import load_dotenv
import bcrypt

load_dotenv()

app = FastAPI(title="FairGig Profile Service")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
client = AsyncIOMotorClient(os.getenv("DATABASE_URL"))
db = client[os.getenv("DB_NAME", "softech")]
users_collection = db["users"]

# Pydantic Models
class PasswordChange(BaseModel):
    userId: str
    currentPassword: str
    newPassword: str

class ProfileResponse(BaseModel):
    id: str
    fullName: str
    email: str
    cnic: str
    city: str
    role: str

# Password Hashing Helper
class PasswordHasher:
    @staticmethod
    def verify(plain_password, hashed_password):
        try:
            if isinstance(hashed_password, str):
                hashed_password = hashed_password.encode('utf-8')
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
        except Exception as e:
            print(f"Bcrypt verification error: {e}")
            return False

    @staticmethod
    def hash(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@app.get("/profile/{user_id}", response_model=ProfileResponse)
async def get_profile(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid User ID")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "fullName": user["fullName"],
        "email": user["email"],
        "cnic": user["cnic"],
        "city": user["city"],
        "role": user["role"]
    }

@app.post("/profile/change-password")
async def change_password(data: PasswordChange):
    if not ObjectId.is_valid(data.userId):
        raise HTTPException(status_code=400, detail="Invalid User ID")
    
    user = await users_collection.find_one({"_id": ObjectId(data.userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not PasswordHasher.verify(data.currentPassword, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect current password")
    
    hashed_password = PasswordHasher.hash(data.newPassword)
    
    await users_collection.update_one(
        {"_id": ObjectId(data.userId)},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "Profile"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5006)))
