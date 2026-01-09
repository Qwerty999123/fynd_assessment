from datetime import datetime, timedelta
from typing import List, Optional, Dict
from bson import ObjectId
import logging
from database import get_reviews_collection
from services.llm_service import llm_service

logger = logging.getLogger(__name__)

class ReviewService:
    def __init__(self):
        self.collection = get_reviews_collection()
    
    async def create_review(self, rating: int, review_text: str) -> Dict:
        
        try:
            
            logger.info(f"Generating AI responses for {rating}-star review")
            
            ai_response = llm_service.generate_user_response(rating, review_text)
            
            ai_summary = llm_service.generate_admin_summary(rating, review_text)
            
            suggested_actions = llm_service.generate_suggested_actions(rating, review_text)
            
            # Create document
            review_doc = {
                "timestamp": datetime.utcnow(),
                "rating": rating,
                "review_text": review_text,
                "ai_response": ai_response,
                "ai_summary": ai_summary,
                "suggested_actions": suggested_actions,
            }
            
            # Insert into database
            result = self.collection.insert_one(review_doc)
            
            logger.info(f"✅ Review created with ID: {result.inserted_id}")
            
            return {
                "submission_id": str(result.inserted_id),
                "ai_response": ai_response
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating review: {e}")
            raise Exception(f"Failed to create review: {str(e)}")
    
    def get_all_reviews(
        self, 
        limit: int = 50, 
        skip: int = 0, 
        rating_filter: Optional[int] = None
    ) -> Dict:
        
        try:
            # Build query
            query = {}
            if rating_filter is not None:
                query["rating"] = rating_filter
            
            # Get total count
            total = self.collection.count_documents(query)
            
            # Get reviews (sorted by newest first)
            cursor = self.collection.find(query).sort("timestamp", -1).skip(skip).limit(limit)
            
            reviews = []
            for doc in cursor:
                reviews.append({
                    "_id": str(doc["_id"]),
                    "timestamp": doc["timestamp"],
                    "rating": doc["rating"],
                    "review_text": doc["review_text"],
                    "ai_response": doc["ai_response"],
                    "ai_summary": doc["ai_summary"],
                    "suggested_actions": doc["suggested_actions"]
                })
            
            logger.info(f"📊 Retrieved {len(reviews)} reviews (total: {total})")
            
            return {
                "total": total,
                "reviews": reviews
            }
            
        except Exception as e:
            logger.error(f"❌ Error fetching reviews: {e}")
            raise Exception(f"Failed to fetch reviews: {str(e)}")
    
    def get_stats(self) -> Dict:
        
        try:
            # Total reviews
            total_reviews = self.collection.count_documents({})
            
            # Rating distribution
            pipeline = [
                {
                    "$group": {
                        "_id": "$rating",
                        "count": {"$sum": 1}
                    }
                }
            ]
            rating_results = list(self.collection.aggregate(pipeline))
            
            rating_distribution = {str(i): 0 for i in range(1, 6)}
            for item in rating_results:
                rating_distribution[str(item["_id"])] = item["count"]
            
            # Calculate average rating
            if total_reviews > 0:
                avg_pipeline = [
                    {
                        "$group": {
                            "_id": None,
                            "average": {"$avg": "$rating"}
                        }
                    }
                ]
                avg_result = list(self.collection.aggregate(avg_pipeline))
                average_rating = round(avg_result[0]["average"], 2) if avg_result else 0
            else:
                average_rating = 0
            
            # Recent reviews (last 24 hours)
            twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
            recent_count = self.collection.count_documents({
                "timestamp": {"$gte": twenty_four_hours_ago}
            })
            
            logger.info(f"📈 Stats retrieved: {total_reviews} total reviews")
            
            return {
                "total_reviews": total_reviews,
                "rating_distribution": rating_distribution,
                "average_rating": average_rating,
                "recent_count_24h": recent_count
            }
            
        except Exception as e:
            logger.error(f"❌ Error fetching stats: {e}")
            raise Exception(f"Failed to fetch stats: {str(e)}")
    
    def get_review_by_id(self, review_id: str) -> Optional[Dict]:

        try:
            doc = self.collection.find_one({"_id": ObjectId(review_id)})
            
            if doc:
                return {
                    "_id": str(doc["_id"]),
                    "timestamp": doc["timestamp"],
                    "rating": doc["rating"],
                    "review_text": doc["review_text"],
                    "ai_response": doc["ai_response"],
                    "ai_summary": doc["ai_summary"],
                    "suggested_actions": doc["suggested_actions"]
                }
            return None
            
        except Exception as e:
            logger.error(f"❌ Error fetching review by ID: {e}")
            return None

# Create singleton instance
review_service = ReviewService()