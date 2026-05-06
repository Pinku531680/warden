from pydantic import BaseModel
from fastapi import FastAPI
from schemas import Transaction
from typing import Optional, Dict, Any

app = FastAPI(title="Warden ML Service");

@app.get("/")
async def root():
    return {"message": "Python service working."};

@app.post("/predict")
async def predict(obj: Transaction):

    print(obj);

    return {
        "status": "Received",
        "data_echo": obj
    };


