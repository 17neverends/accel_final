from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import router
from contextlib import asynccontextmanager
from tasks_shared.database import init_db
from tasks_shared.database_utils import cook_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await cook_models()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(router=router)

allowed_origins = ["localhost:5173", "127.0.0.1:5173", "0.0.0.0:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
