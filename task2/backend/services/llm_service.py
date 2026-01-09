from google import genai
import logging
import json
from typing import List, Optional
from config import settings
import os

CLIENT = genai.Client(api_key=settings.gemini_api_key)

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        
        self.model = CLIENT
        logger.info("✅ Gemini API initialized")
    
    def generate_user_response(self, rating: int, review_text: str) -> str:

        prompt = f"""You are a customer service AI. A customer just left a {rating}-star review.

Review: "{review_text}"
Rating: {rating} stars

Generate a brief, professional, and empathetic response to the customer. 
The response should:
- Thank them for their feedback
- Acknowledge their specific points (positive or negative)
- Be appropriate for the rating given
- For negative reviews (1-3 stars): Show empathy and willingness to improve
- For positive reviews (4-5 stars): Express gratitude and encouragement

Keep the response to 2-3 sentences maximum.

Respond with ONLY the customer response text, no JSON, no additional formatting."""

        try:
            response = self.model.models.generate_content(
                model='gemini-3-flash-preview',
                contents=[
                    prompt
                ],
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating user response: {e}")
            return self._get_fallback_user_response(rating)
    
    def generate_admin_summary(self, rating: int, review_text: str) -> str:

        prompt = f"""Analyze this customer review for internal reporting:

Review: "{review_text}"
Rating: {rating} stars

Provide a brief summary (1-2 sentences) highlighting:
- Main sentiment
- Key points mentioned
- Any critical issues or praise

Respond with ONLY the summary text."""

        try:
            response = self.model.models.generate_content(
                model='gemini-3-flash-preview',
                contents=[
                    prompt
                ],
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating admin summary: {e}")
            return f"Rating: {rating} stars - Unable to generate summary"
    
    def generate_suggested_actions(self, rating: int, review_text: str) -> List[str]:
        """
        Generate suggested actions for the team
        """
        prompt = f"""Based on this review, suggest 2-3 specific actionable next steps for the team:

Review: "{review_text}"
Rating: {rating} stars

Consider:
- For 1-2 stars: Immediate response, investigation, service recovery
- For 3 stars: Follow-up, improvement opportunities
- For 4-5 stars: Thank you, encourage repeat business, request testimonial

Respond with a JSON array of action items:
["action 1", "action 2", "action 3"]

Respond ONLY with the JSON array, no additional text."""

        try:
            response = self.model.models.generate_content(
                model='gemini-3-flash-preview',
                contents=[
                    prompt
                ],
            )
            
            # Parse JSON response
            actions_text = response.text.strip()
            
            # Try to extract JSON if wrapped in markdown
            if "```json" in actions_text:
                actions_text = actions_text.split("```json")[1].split("```")[0].strip()
            elif "```" in actions_text:
                actions_text = actions_text.split("```")[1].split("```")[0].strip()
            
            actions = json.loads(actions_text)
            
            if isinstance(actions, list) and len(actions) > 0:
                return actions[:3]  # Limit to 3 actions
            else:
                return self._get_fallback_actions(rating)
                
        except Exception as e:
            logger.error(f"Error generating suggested actions: {e}")
            return self._get_fallback_actions(rating)
    
    def _get_fallback_user_response(self, rating: int) -> str:
        if rating <= 2:
            return "Thank you for your feedback. We're sorry to hear about your experience and will work to improve. Please contact us directly so we can make this right."
        elif rating == 3:
            return "Thank you for your feedback. We appreciate your input and will use it to improve our service."
        else:
            return "Thank you for your wonderful feedback! We're thrilled you had a great experience and look forward to serving you again."
    
    def _get_fallback_actions(self, rating: int) -> List[str]:
        if rating <= 2:
            return [
                "Contact customer immediately for service recovery",
                "Investigate specific issues mentioned",
                "Review internal processes"
            ]
        elif rating == 3:
            return [
                "Follow up with customer for more details",
                "Identify improvement opportunities",
                "Monitor similar feedback patterns"
            ]
        else:
            return [
                "Send thank you note to customer",
                "Share positive feedback with team",
                "Encourage customer to leave online review"
            ]

# Create singleton instance
llm_service = LLMService()