#!/bin/bash

echo "🚀 Building WASM vs TypeScript Performance Demo"

# Build WASM module
echo "📦 Building Rust WASM module..."
if [ ! -d "rust-wasm/pkg" ]; then
    docker-compose --profile build up rust-builder
fi

# Install npm dependencies and start dev server
echo "📦 Installing npm dependencies and starting dev server..."
docker-compose up app
