FROM python:3.12-slim

RUN apt update -y \
  && apt install -y curl \
  && rm -rf /var/lib/apt/lists/*

# Install project dependencies
WORKDIR /thallium
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

HEALTHCHECK --start-period=5s --interval=30s --timeout=1s CMD curl http://localhost/heartbeat || exit 1

# Define Git SHA build argument for sentry
ARG git_sha="development"
ENV GIT_SHA=$git_sha

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["alembic upgrade head && uvicorn src.app:fastapi_app --host 0.0.0.0 --port 8000 --no-server-header"]
