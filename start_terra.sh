#!/bin/bash
# Terra AI — Quick Setup (NULLO Protocol)
echo "=== Terra AI Setup ==="
command -v ollama >/dev/null || curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &>/dev/null &
sleep 2
ollama list | grep -q mistral || ollama pull mistral
pip install requests --quiet
echo "=== Launch: python3 terra_local.py ==="
python3 terra_local.py
