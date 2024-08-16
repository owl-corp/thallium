from pydantic_settings import BaseSettings


class _CONFIG(BaseSettings, env_file=".env", env_file_encoding="utf-8"):
    debug: bool = False
    git_sha: str = "development"


CONFIG = _CONFIG()
