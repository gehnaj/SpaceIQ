FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Python deps
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Node deps
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps

# Copy everything and build
COPY . .
RUN echo "cache-bust-v8" && cd frontend && npm run build

# Standalone needs static + public copied in
RUN cp -r frontend/public frontend/.next/standalone/frontend/public
RUN cp -r frontend/.next/static frontend/.next/standalone/frontend/.next/static

# Data dirs
RUN mkdir -p uploads processed

# Env
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PROJECT_ROOT=/app
EXPOSE 3000

# standalone server.js is a plain node script — no symlinks, no npx
CMD ["node", "frontend/.next/standalone/frontend/server.js"]
