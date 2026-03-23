from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import transactions, ocr

app = FastAPI(title="Finance API")

# CORS for Lovable
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(transactions.router)
app.include_router(ocr.router)

@app.get("/")
def health_check():
    return {"status": "online", "version": "2026.1.0"}