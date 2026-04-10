# ── Base: Node + Python ──────────────────────────────────────────────────────
FROM node:20-slim

# Install Python + pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Symlink python3 → python so the API route's `python` call works
RUN ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# ── Python dependencies ─────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# ── Node dependencies ───────────────────────────────────────────────────────
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps

# ── Copy project files ──────────────────────────────────────────────────────
COPY . .

# ── Build Next.js ───────────────────────────────────────────────────────────
RUN cd frontend && npm run build

# ── Ensure data directories exist ───────────────────────────────────────────
RUN mkdir -p uploads processed

EXPOSE 3000

# ── Start ────────────────────────────────────────────────────────────────────
CMD ["sh", "-c", "cd /app/frontend && npm start -- --hostname 0.0.0.0 --port 3000"]