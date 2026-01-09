from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import settings
import logging
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Database:
    client: MongoClient = None
    
    @classmethod
    def connect(cls):
        try:
            cls.client = MongoClient(settings.mongodb_url)
            # Test connection
            cls.client.admin.command('ping')
            logger.info("✅ Successfully connected to MongoDB!")
        except ConnectionFailure as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()
            logger.info("🔌 MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        if not cls.client:
            cls.connect()
        return cls.client['fynd_assessment']
    
    @classmethod
    def get_collection(cls, collection_name: str):
        db = cls.get_database()
        return db[collection_name]

# Convenience function
def get_reviews_collection():
    return Database.get_collection("reviews")