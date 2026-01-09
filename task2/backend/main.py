from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from config import settings
from database import Database
from routes import reviews

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting up Review Feedback API...")
    Database.connect()
    logger.info("✅ Startup complete!")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Review Feedback API...")
    Database.close()
    logger.info("✅ Shutdown complete!")

# Create FastAPI app
app = FastAPI(
    title="Review Feedback System API",
    description="AI-powered review feedback system with user and admin dashboards",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Updated for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # Will be set via environment variable
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(reviews.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Review Feedback System API",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.environment,
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.environment
    }

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"❌ Global error: {exc}")
    return {
        "success": False,
        "error": "Internal server error",
        "details": str(exc) if settings.environment == "development" else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if settings.environment == "development" else False
    )