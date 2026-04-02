# Build Stage
FROM node:20-slim AS builder

# Install Python and essential build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt ./
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm install

# Copy source and Sync Content from Google Drive
# NOTE: GDRIVE_FOLDER_ID and GDRIVE_SERVICE_ACCOUNT_KEY must be provided at build time 
# or via environment variables if running sync at runtime.
COPY . .
ARG PIPELINE_MODE=gdrive
ARG GDRIVE_FOLDER_ID
ARG GDRIVE_SERVICE_ACCOUNT_KEY
ENV PIPELINE_MODE=$PIPELINE_MODE
ENV GDRIVE_FOLDER_ID=$GDRIVE_FOLDER_ID
ENV GDRIVE_SERVICE_ACCOUNT_KEY=$GDRIVE_SERVICE_ACCOUNT_KEY

# Perform the sync and build
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
