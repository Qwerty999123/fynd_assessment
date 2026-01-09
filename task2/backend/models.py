from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# request model
class ReviewSubmission(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Star rating from 1 to 5")
    review_text: str = Field(..., min_length=1, max_length=5000, description="Review text")
    
    @validator('review_text')
    def validate_review_text(cls, v):
        if not v or v.strip() == "":
            raise ValueError("Review text cannot be empty or just whitespace")
        return v.strip()


# response model
class ReviewResponse(BaseModel):
    success: bool
    message: str
    submission_id: Optional[str] = None
    ai_response: Optional[str] = None
    error: Optional[str] = None


class ReviewRecord(BaseModel):
    id: str = Field(alias="_id")
    timestamp: datetime
    rating: int
    review_text: str
    ai_response: str
    ai_summary: str
    suggested_actions: List[str]
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }


class ReviewListResponse(BaseModel):
    success: bool
    total: int
    reviews: List[ReviewRecord]


class StatsResponse(BaseModel):
    success: bool
    total_reviews: int
    rating_distribution: dict
    average_rating: float
    recent_count_24h: int


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    details: Optional[str] = None