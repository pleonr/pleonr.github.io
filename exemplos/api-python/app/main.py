from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import init_db
from app.error_handlers import registrar_error_handlers
from app.routers import auth, usuarios

ALLOWED_ORIGINS = [
    "https://leon.dev.br",
    "https://www.leon.dev.br",
    "http://localhost:5173",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="API de Usuários", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)

registrar_error_handlers(app)
