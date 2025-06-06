#!/bin/bash

# start-mcp.sh - Start the Local MCP Server and Augment Agent for AI Dev Pipeline

# --- CONFIGURATION ---
# If your local MCP server entrypoint file is not local-mcp-server.ts, update it below.
MCP_SERVER="local-mcp-server.ts"
# If Augment has a CLI entrypoint, update it below. Otherwise leave commented out.
AUGMENT_CMD="augment-agent" # e.g., "npx augment-agent" or "python augment.py"

# --- COLOR FUNCTIONS ---
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function info {
  echo -e "${CYAN}➤ $1${NC}"
}

function success {
  echo -e "${GREEN}✔ $1${NC}"
}

function error {
  echo -e "${RED}✗ $1${NC}"
}

# --- CHECK DEPENDENCIES ---
info "Checking for Node.js and npm..."
if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
  error "Node.js and npm must be installed. See: https://nodejs.org/"
  exit 1
fi

info "Checking for ts-node..."
if ! command -v ts-node &>/dev/null; then
  info "ts-node not found, installing globally..."
  npm install -g ts-node
fi

# --- INSTALL NPM DEPENDENCIES ---
info "Installing project dependencies..."
npm install

if [ $? -ne 0 ]; then
  error "npm install failed. Fix errors above and retry."
  exit 1
fi
success "Dependencies installed."

# --- START LOCAL MCP SERVER ---
info "Starting Local MCP server..."
npx ts-node $MCP_SERVER &
MCP_PID=$!

# --- (OPTIONAL) START AUGMENT AGENT ---
# Uncomment the lines below and configure the Augment agent command if needed.
# info "Starting Augment coding agent..."
# $AUGMENT_CMD &
# AUGMENT_PID=$!

success "Local MCP server is running on port 9876."
info "To stop, press Ctrl+C."

# --- GRACEFUL SHUTDOWN ---
trap ctrl_c INT

function ctrl_c() {
  echo
  info "Shutting down..."
  kill $MCP_PID 2>/dev/null
  # Uncomment if running Augment
  # kill $AUGMENT_PID 2>/dev/null
  success "Shutdown complete."
  exit 0
}

# Wait for MCP to exit; keep script running
wait $MCP_PID
