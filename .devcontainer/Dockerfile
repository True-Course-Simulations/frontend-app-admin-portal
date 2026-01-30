# Node 18 LTS, Debian-based (good compatibility with native deps)
FROM mcr.microsoft.com/devcontainers/javascript-node:1-18-bullseye

# System deps that frequently help with node-gyp / native modules
RUN apt-get update && apt-get install -y \
  git \
  ca-certificates \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Optional: keep npm from being too chatty and speed installs a bit
ENV npm_config_fund=false \
    npm_config_audit=false
