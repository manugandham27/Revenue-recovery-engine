"""
Centralized Configuration for RevenueOS Engine
Manages API keys, policy engine thresholds, environment flags, and model paths.
"""

import os

class Settings:
    PROJECT_NAME: str = "RevenueOS — AI Revenue Recovery & Safety Engine"
    VERSION: str = "1.2.0"
    API_V1_STR: str = "/api/v1"
    
    # Financial Safety Policy Engine Settings
    MAX_RETRY_ATTEMPTS: int = int(os.getenv("MAX_RETRY_ATTEMPTS", 3))
    HIGH_VALUE_THRESHOLD: float = float(os.getenv("HIGH_VALUE_THRESHOLD", 15000.0))
    MIN_CONFIDENCE_THRESHOLD: float = float(os.getenv("MIN_CONFIDENCE_THRESHOLD", 0.60))
    MIN_RECOVERABILITY_THRESHOLD: float = float(os.getenv("MIN_RECOVERABILITY_THRESHOLD", 0.20))
    RETRY_COOLDOWN_MINUTES: int = int(os.getenv("RETRY_COOLDOWN_MINUTES", 30))
    DEFAULT_INTERVENTION_COST: float = float(os.getenv("DEFAULT_INTERVENTION_COST", 10.0))
    
    # AI & Model Configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", "ml/model.joblib")
    METADATA_PATH: str = os.getenv("METADATA_PATH", "ml/model_metadata.json")
    COMPARISON_PATH: str = os.getenv("COMPARISON_PATH", "ml/model_comparison.json")
    
    # OpenAI API Key (Optional)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()
