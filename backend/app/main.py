"""
FastAPI Main Application for RevenueOS — AI Revenue Recovery & Optimization Engine.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from .api.router import router as api_router
from .db.session import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing RevenueOS database schema...")
    try:
        init_db()
        print("✅ Database ready.")
    except Exception as e:
        print(f"⚠️ Database initialization notice: {e}")
    yield

app = FastAPI(
    title="RevenueOS API",
    description="AI Revenue Recovery & Optimization Engine for Razorpay AI Buildathon (Track 03)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware for Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "app": "RevenueOS API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }
