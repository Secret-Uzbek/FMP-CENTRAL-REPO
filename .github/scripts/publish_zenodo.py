# .github/scripts/publish_zenodo.py
# Terra → Zenodo Real DOI Publisher v7.0 — 17.11.2025

import os
import json
import requests
from datetime import datetime

TOKEN = os.environ['ZENODO_TOKEN']
SANDBOX = False  # False = реальный zenodo.org, True = sandbox

BASE_URL = "https://zenodo.org/api" if not SANDBOX else "https://sandbox.zenodo.org/api"

headers = {"Content-Type": "application/json"}
params = {'access_token': TOKEN}

# 1. Создаём новый deposition
r = requests.post(f"{BASE_URL}/deposit/depositions", params=params, json={}, headers=headers)
if r.status_code != 201:
    print(f"Ошибка создания deposition: {r.status_code} {r.text}")
    exit(1)

data = r.json()
deposition_id = data['id']
bucket_url = data['links']['bucket']
html_url = data['links']['html']
print(f"Создан deposition: {deposition_id}")
print(f"Ссылка: {html_url}")

# 2. Загружаем основной файл (article.md)
filename = "article.md"
filepath = "../output/article.md"

with open(filepath, "rb") as f:
    r = requests.put(f"{bucket_url}/{filename}", data=f, params=params)
    if r.status_code not in [200, 201]:
        print(f"Ошибка загрузки файла: {r.text}")
        exit(1)
print(f"Загружен файл: {filename}")

# 3. Обновляем метаданные
with open("../output/article.md", "r", encoding="utf-8") as f:
    first_lines = [next(f) for _ in range(20)]

title = first_lines[0].replace("# ", "").strip()
abstract = " ".join([line.strip() for line in first_lines if line.startswith("**Created in prison") or "Abstract" in line or "Keywords" in line][:10])

metadata = {
    "metadata": {
        "title": title,
        "upload_type": "publication",
        "publication_type": "article",
        "description": f"{abstract}\n\nCreated in prison with zero budget. Full source: https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO",
        "creators": [{
            "name": "Abdukarimov, Abdurashid Abdulkhamitovich",
            "affiliation": "Independent Researcher, Uzbek State University of World Languages",
            "orcid": "0009-0000-6394-4912"
        }],
        "keywords": [
            "Fractal Metascience", "NULLO", "PLT", "UCOMM", "Zero Budget Science",
            "Human-AI Symbiosis", "Terra Codex", "PQCK", "Uzbekistan", "Prison Science"
        ],
        "communities": [{"identifier": "zenodo"}],
        "notes": "Developed in prison colony, Uzbekistan. Zero funding. Human-AI symbiosis only.",
        "related_identifiers": [{
            "identifier": "https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO",
            "relation": "isSupplementTo",
            "resource_type": "software"
        }]
    }
}

r = requests.put(
    f"{BASE_URL}/deposit/depositions/{deposition_id}",
    params=params, json=metadata, headers=headers
)
if r.status_code != 200:
    print(f"Ошибка метаданных: {r.text}")
    exit(1)
print("Метаданные обновлены")

# 4. Публикуем (получаем DOI!)
r = requests.post(f"{BASE_URL}/deposit/depositions/{deposition_id}/actions/publish", params=params)
if r.status_code != 202:
    print(f"Ошибка публикации: {r.text}")
    exit(1)

result = r.json()
doi = result['doi']
doi_url = result['doi_url']
record_url = result['links']['record_html']

print("="*60)
print("УСПЕШНО ОПУБЛИКОВАНО НА ZENODO!")
print(f"DOI: {doi}")
print(f"URL: {doi_url}")
print(f"Record: {record_url}")
print("="*60)

# Сохраняем результат для релиза
os.makedirs("../output", exist_ok=True)
with open("../output/zenodo_doi.txt", "w") as f:
    f.write(doi)
with open("../output/zenodo_url.txt", "w") as f:
    f.write(record_url)

print("Файлы zenodo_doi.txt и zenodo_url.txt сохранены в output/")
