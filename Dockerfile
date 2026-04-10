FROM node:20-slim

# Install Python
RUN apt-get update \
    && apt-get install -y python3 python3-pip --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Python deps
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Node deps (cached layer)
COPY frontend/package.json frontend/package-lock.json ./frontend/
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Copy full project
WORKDIR /app
COPY . .

# Build Next.js
WORKDIR /app/frontend
RUN npm run build

# Create data dirs
RUN mkdir -p /app/uploads /app/processed

# Runtime config
ENV PROJECT_ROOT=/app
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
EXPOSE 3000

# Start — use PORT from Railway, fallback to 3000
CMD PORT="${PORT:-3000}" npm start -- -H 0.0.0.0 -p "${PORT:-3000}"
