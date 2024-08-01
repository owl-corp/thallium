FROM --platform=linux/amd64 python:3.12-slim

# Define Git SHA build argument for sentry
ARG git_sha="development"
ENV GIT_SHA=$git_sha

# Install project dependencies
WORKDIR /thallium
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy the source code in last to optimize rebuilding the image
COPY . .

ENTRYPOINT ["uvicorn"]
CMD ["thallium.app:app", "--host", "0.0.0.0", "--port", "80"]
