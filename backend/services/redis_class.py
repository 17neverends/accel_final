import redis.asyncio as redis
from settings import settings


class AsyncRedisClient:
    def __init__(self):
        self.redis = redis.Redis.from_url(settings.redis_no_pass)
        
    async def set_value(self, key: str, value: str, expire: int = None):
        result = await self.redis.set(key, value, ex=expire)
        await self.redis.close()
        return result

    async def get_value(self, key: str):
        value = await self.redis.get(key)
        await self.redis.close()
        return value

    async def delete_value(self, key: str):
        result = await self.redis.delete(key)
        await self.redis.close()
        return result


    async def close(self):
        await self.redis.close()
