from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://matbase:matbase@db:5432/matbase"
    anthropic_api_key: str = ""
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
