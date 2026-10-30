FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends qpdf python3 python3-venv && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PYTHON_BIN=/opt/pyenv/bin/python
RUN apt-get update && apt-get install -y --no-install-recommends qpdf python3 python3-venv && python3 -m venv /opt/pyenv && /opt/pyenv/bin/pip install --no-cache-dir pymupdf && rm -rf /var/lib/apt/lists/* && useradd --system --uid 1001 nextjs
COPY --from=build /app ./
EXPOSE 3000
USER nextjs
CMD ["npm", "start"]
