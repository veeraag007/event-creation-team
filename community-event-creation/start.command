#!/bin/bash
# Double-click to install (first run), start the API + both apps, and open them in your browser.
cd "$(dirname "$0")" || exit 1
pause() { read -n 1 -s -r -p "$1 Press any key to close"; echo; exit 1; }

command -v node >/dev/null 2>&1 || { echo "Node.js is not installed. Install it from https://nodejs.org (v20+), then double-click this file again."; pause ""; }

# Free the ports if a previous run is still going
for p in 4000 3001; do lsof -ti tcp:$p 2>/dev/null | xargs kill 2>/dev/null; done

# Native build tools (Tailwind, Rollup, esbuild) must load; npm sometimes skips the
# platform-specific binaries (npm bug #4828). If they fail to load, reinstall from scratch.
native_ok() { node -e "require('@tailwindcss/oxide');require('rollup');require('esbuild');require('lightningcss')" >/dev/null 2>&1; }

if [ ! -d node_modules ] || ! native_ok; then
  echo "Installing dependencies (clean)…"
  rm -rf node_modules package-lock.json apps/*/node_modules packages/*/node_modules services/*/node_modules
  npm install --no-audit --no-fund || pause "npm install failed."
fi

if ! native_ok; then
  echo "Installing platform binaries explicitly…"
  A=$([ "$(uname -m)" = "arm64" ] && echo arm64 || echo x64)
  v() { node -p "require('$1/package.json').version" 2>/dev/null; }
  npm install --no-save --no-audit --no-fund \
    "@tailwindcss/oxide-darwin-$A@$(v @tailwindcss/oxide)" \
    "@rollup/rollup-darwin-$A@$(v rollup)" \
    "lightningcss-darwin-$A@$(v lightningcss)" \
    "@esbuild/darwin-$A@$(v esbuild)" || pause "Could not install platform binaries."
fi
native_ok || pause "Build tools still fail to load."

( sleep 8; open http://localhost:3001 ) &
npm run dev
