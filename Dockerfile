# ── Base: Node + Python ──────────────────────────────────────────────────────
FROM node:20-slim

RUN apt-get update && apt-get install -y python3 python3-pip --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /app

# ── Python deps ─────────────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# ── Node deps ───────────────────────────────────────────────────────────────
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps

# ── Copy project ────────────────────────────────────────────────────────────
COPY . .

# ── Build Next.js ───────────────────────────────────────────────────────────
RUN cd frontend && npm run build

# ── Data directories ────────────────────────────────────────────────────────
RUN mkdir -p uploads processed

# ── Start ────────────────────────────────────────────────────────────────────
# Railway sets PORT env var; Next.js needs HOSTNAME=0.0.0.0 to accept traffic
WORKDIR /app/frontend
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["sh", "-c", "exec npx next start -H 0.0.0.0 -p ${PORT:-3000}"]
