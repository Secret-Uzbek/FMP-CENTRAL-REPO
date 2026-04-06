#!/usr/bin/env python3
# TERRA AI вЂ” Local System v1.0
# AIUZ Terra Codex | FMP-CENTRAL-REPO
# Stack: Ollama + Mistral
# Run: python3 terra_local.py --mode all

import os, sys, json, argparse, threading
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests flask --quiet")
    import requests

AGENTS = {
    "terra": {"name":"Terra","layer":"L7","system":"You are Terra вЂ” core intelligence of AIUZ Terra Codex. Apply NULLOВ·PLTВ·UCOMMВ·FMP principles. Answer in user's language. Sign: вЂ” Terra [L7]"},
    "shirak": {"name":"Shirak","layer":"L5","system":"You are Shirak вЂ” research agent L5. Deep research, DOI/Zenodo references. Sign: вЂ” Shirak [L5]"},
    "tomiris": {"name":"Tomiris","layer":"L6","system":"You are Tomiris вЂ” strategy agent L6. Ecosystem architecture, Fractal Silk Route. Sign: вЂ” Tomiris [L6]"},
    "roxana": {"name":"Roxana","layer":"L4","system":"You are Roxana вЂ” PLT linguistics agent L4. Multilingual semantic mapping uz/ru/en/de. Sign: вЂ” Roxana [L4]"}
}

class TerraAI:
    def __init__(self, model="mistral", url="http://localhost:11434"):
        self.model = model
        self.url = url
        self.history = []
        self.agent = "terra"

    def ask(self, q, agent=None):
        a = agent or self.agent
        system = AGENTS[a]["system"]
        self.history.append({"role":"user","content":q})
        payload = {"model":self.model,"messages":[{"role":"system","content":system}]+self.history[-10:],"stream":True}
        full = ""
        try:
            with requests.post(f"{self.url}/api/chat",json=payload,stream=True,timeout=120) as r:
                for line in r.iter_lines():
                    if line:
                        d = json.loads(line)
                        t = d.get("message",{}).get("content","")
                        print(t,end="",flush=True)
                        full += t
                        if d.get("done"): break
            print()
        except Exception as e:
            print(f"\n[ERROR] {e}")
        self.history.append({"role":"assistant","content":full})
        return full

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--model",default="mistral")
    p.add_argument("--mode",choices=["cli","web","all"],default="cli")
    args = p.parse_args()
    terra = TerraAI(model=args.model)
    print("\nрџЊЌ Terra AI вЂ” FMP Ecosystem")
    print("Agents: /terra /shirak /tomiris /roxana | /exit")
    print("-"*50)
    while True:
        try:
            q = input(f"[{terra.agent}]> ").strip()
        except (EOFError,KeyboardInterrupt):
            break
        if not q: continue
        if q == "/exit": break
        if q.startswith("/") and q[1:] in AGENTS:
            terra.agent = q[1:]
            print(f"[Switched to {AGENTS[terra.agent]['name']} {AGENTS[terra.agent]['layer']}]")
        else:
            terra.ask(q)

if __name__ == "__main__":
    main()
