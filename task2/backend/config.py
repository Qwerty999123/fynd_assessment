from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str
    database_name: str = "review_feedback_db"
    
    # Gemini API
    gemini_api_key: str
    
    # App Settings
    environment: str = "development"
    cors_origins: str = "http://localhost:5173,http://localhost:5174"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        # Allow all origins in production for now, or specify exact domains
        if self.environment == "production":
            origins = [origin.strip() for origin in self.cors_origins.split(",")]
            return origins if origins else ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]

# Create settings instance
settings = Settings()