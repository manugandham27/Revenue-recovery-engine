"""
Database Session Management for RevenueOS.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

def _get_database_url() -> str:
    env_url = os.getenv("DATABASE_URL")
    if env_url:
        return env_url

    # Check if running in Vercel serverless environment or read-only filesystem
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        return "sqlite:////tmp/revenue_os.db"

    # Try current directory write test
    try:
        test_file = "./.write_test"
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return "sqlite:///./revenue_os.db"
    except (PermissionError, OSError):
        return "sqlite:////tmp/revenue_os.db"

DATABASE_URL = _get_database_url()

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for API routes to get DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
