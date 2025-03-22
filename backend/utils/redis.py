import redis
from dotenv import load_dotenv
import os
import json
from datetime import datetime
from typing import Any, Optional, TypeVar, Type
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

load_dotenv()
REDIS_URL = os.getenv("REDIS_URL")
if not REDIS_URL:
    raise ValueError("REDIS_URL not found in environment variables")

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def set_cache(key: str, value: Any, expire: int = 3600) -> None:
    # Custom JSON encoder to handle datetime objects
    def datetime_encoder(obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

    redis_client.setex(key, expire, json.dumps(value, default=datetime_encoder))

def get_cache(key: str, model: Type[T] = None) -> Optional[Any]:
    value = redis_client.get(key)
    if value:
        data = json.loads(value)
        if model:
            if isinstance(data, list):
                return [model(**item) for item in data]
            return model(**data)
        return data
    return None

def delete_cache(key: str) -> None:
    redis_client.delete(key)