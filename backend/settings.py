from pydantic import EmailStr, SecretStr, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    redis_host: str = Field(..., env="REDIS_HOST")
    redis_port: int = Field(6379, env="REDIS_PORT")
    redis_db: int = Field(0, env="REDIS_DB")
    redis_user: str = Field(..., env="REDIS_USER")
    redis_password: SecretStr = Field(..., env="REDIS_PASSWORD")

    @property
    def redis_storage(self):
        return f"""redis://{self.redis_user}:{self.redis_password.get_secret_value()}@{self.redis_host}:{self.redis_port}/{self.redis_db}?decode_responses=True"""
    
    @property
    def redis_no_pass(self):
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}?decode_responses=True"

    aws_access_key_id: str = Field(..., env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: SecretStr = Field(..., env="AWS_SECRET_ACCESS_KEY")
    region_name: str = Field(..., env="AWS_REGION_NAME")
    bucket_name: str = Field(..., env="BUCKET_NAME")
    host: str = Field(..., env="HOST")

    download_path: str = Field(..., env="DOWNLOAD_PATH")

    db_host: str = Field(env="DB_HOST")
    db_port: int = Field(env="DB_PORT")
    db_user: str = Field(..., env="DB_USER")
    db_password: SecretStr = Field(..., env="DB_PASSWORD")
    db_name: str = Field(..., env="DB_NAME")
    db_type: str = Field(env="DB_TYPE")
    db_driver: str = Field(env="DB_DRIVER")
    
    @property
    def db_url(self):
        return f"""{self.db_type}+{self.db_driver}://{self.db_user}:{self.db_password.get_secret_value()}@{self.db_host}:{self.db_port}/{self.db_name}"""

    smtp_server: str = Field(env="SMTP_SERVER")
    smtp_port: int = Field(env="SMTP_PORT")
    smtp_user: EmailStr = Field(..., env="SMTP_USER")
    smtp_password: SecretStr = Field(..., env="SMTP_PASSWORD")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
