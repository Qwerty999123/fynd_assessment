from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging
from models import (
    ReviewSubmission, 
    ReviewResponse, 
    ReviewListResponse,
    StatsResponse,
    ErrorResponse
)
from services.review_service import review_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("/submit", response_model=ReviewResponse)
async def submit_review(submission: ReviewSubmission):
    
    try:
        logger.info(f"📝 New review submission: {submission.rating} stars")
        
        # Create review with AI-generated content
        result = await review_service.create_review(
            rating=submission.rating,
            review_text=submission.review_text
        )
        
        return ReviewResponse(
            success=True,
            message="Review submitted successfully",
            submission_id=result["submission_id"],
            ai_response=result["ai_response"]
        )
        
    except Exception as e:
        logger.error(f"❌ Error in submit_review: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit review: {str(e)}"
        )


@router.get("/all", response_model=ReviewListResponse)
async def get_all_reviews(
    limit: int = Query(50, ge=1, le=200, description="Maximum number of reviews to return"),
    skip: int = Query(0, ge=0, description="Number of reviews to skip"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by rating")
):
    
    try:
        logger.info(f"📊 Fetching reviews: limit={limit}, skip={skip}, rating={rating}")
        
        result = review_service.get_all_reviews(
            limit=limit,
            skip=skip,
            rating_filter=rating
        )
        
        return ReviewListResponse(
            success=True,
            total=result["total"],
            reviews=result["reviews"]
        )
        
    except Exception as e:
        logger.error(f"❌ Error in get_all_reviews: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch reviews: {str(e)}"
        )


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    
    try:
        logger.info("📈 Fetching statistics")
        
        stats = review_service.get_stats()
        
        return StatsResponse(
            success=True,
            total_reviews=stats["total_reviews"],
            rating_distribution=stats["rating_distribution"],
            average_rating=stats["average_rating"],
            recent_count_24h=stats["recent_count_24h"]
        )
        
    except Exception as e:
        logger.error(f"❌ Error in get_stats: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@router.get("/health")
async def health_check():

    return {
        "status": "healthy",
        "service": "review-feedback-api"
    }