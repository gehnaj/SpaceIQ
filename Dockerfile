# ── Base: Node + Python ──────────────────────────────────────────────────────
FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

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

# ── Start ────────────────────────────────────────────────────────────────────
# WORKDIR must be /app/frontend so Next.js finds .next/ AND
# so process.cwd() + ".." resolves to /app (where Python scripts live)
WORKDIR /app/frontend
ENV HOSTNAME=0.0.0.0
ENV PROJECT_ROOT=/app
EXPOSE 3000
# Railway sets PORT dynamically — must use it
CMD ["sh", "-c", "exec node node_modules/.bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
