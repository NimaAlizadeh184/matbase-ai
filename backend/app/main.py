from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import ai, materials

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MatBase AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow Railway and Vercel domains as trusted hosts
from fastapi.middleware.trustedhost import TrustedHostMiddleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

app.include_router(materials.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok"}
