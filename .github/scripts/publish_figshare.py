# .github/scripts/publish_figshare.py
# Terra → Figshare Auto-Publisher — работает с твоим FIGSHARE_TOKEN

import os
import json
import requests

TOKEN = os.environ['FIGSHARE_TOKEN']
headers = {'Authorization': f'token {TOKEN}'}

# Читаем заголовок статьи
title = open("../output/title.txt", "r", encoding="utf-8").read().strip()

# 1. Создаём новую статью
data = {
    "title": title,
    "description": "Created in prison with zero budget through human-AI symbiosis. Full source: https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO",
    "defined_type": "preprint",
    "keywords": ["Fractal Metascience", "NULLO", "PLT", "UCOMM", "Zero Budget Science", "Prison Science", "Terra Codex"]
}

r = requests.post('https://api.figshare.com/v2/account/articles', headers=headers, json=data)
if r.status_code != 201:
    print(f"Figshare error: {r.text}")
    exit(1)

article = r.json()
article_id = article['entity_id']
location = article['location']
print(f"Figshare article created: {location}")

# 2. Загружаем файл
with open("../output/article.md", "rb") as f:
    files = {'filedata': ('article.md', f)}
    r = requests.post(f"https://api.figshare.com/v2/account/articles/{article_id}/files", headers=headers, files=files)

file_id = r.json()[0]['id']

# 3. Завершаем загрузку и публикуем
requests.post(f"https://api.figshare.com/v2/account/articles/{article_id}/files/{file_id}/complete", headers=headers)
requests.post(f"https://api.figshare.com/v2/account/articles/{article_id}/actions/publish", headers=headers)

print(f"УСПЕШНО ОПУБЛИКОВАНО НА FIGSHARE!")
print(f"Ссылка: {location}")

# Сохраняем ссылку
with open("../output/figshare_url.txt", "w") as f:
    f.write(location)
