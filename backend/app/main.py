from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import ai, materials

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MatBase AI", version="0.1.0")

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
