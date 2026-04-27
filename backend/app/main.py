import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import ai, materials


def _init_db():
    try:
        Base.metadata.create_all(bind=engine)
        from app.seed import seed
        seed()
    except Exception as e:
        print(f"[startup] DB init failed: {e}", flush=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    threading.Thread(target=_init_db, daemon=True).start()
    yield


app = FastAPI(title="MatBase AI", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(materials.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok"}
