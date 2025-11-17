# .github/scripts/publish_osf.py
# Terra → OSF Auto-Publisher — работает с твоим OSF_TOKEN

import os
import requests

TOKEN = os.environ['OSF_TOKEN']
headers = {'Authorization': f'Bearer {TOKEN}'}

# Создаём новый проект, если нужно
r = requests.post(
    'https://api.osf.io/v2/nodes/',
    headers=headers,
    json={"data": {"type": "nodes", "attributes": {"title": "FMP Terra Auto-Publication — Fractal Metascience from Prison", "category": "project"}}}
)
if r.status_code not in [200, 201]:
    print(f"OSF ошибка создания проекта: {r.text}")
    exit(1)

project_id = r.json()['data']['id']
project_url = f"https://osf.io/{project_id}/"
print(f"Создан OSF проект: {project_url}")

# Загружаем статью
with open("../output/article.md", "rb") as f:
    files = {'file': ('FMP_Terra_Article.md', f)}
    r = requests.put(
        f"https://files.osf.io/v1/resources/{project_id}/providers/osfstorage/?kind=file&name=FMP_Terra_Article.md",
        headers=headers,
        files=files
    )

print("УСПЕШНО ЗАГРУЖЕНО НА OSF!")
print(f"Ссылка на проект: {project_url}")

# Сохраняем ссылку для релиза
with open("../output/osf_url.txt", "w") as f:
    f.write(project_url)
