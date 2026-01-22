# 🚀 FMP Automation System

Единая система автоматизации для экосистемы Fractal Metascience Paradigm.

## 📋 Содержимое

| Файл | Назначение |
|------|------------|
| `unified-publisher.js` | Главный скрипт публикации |
| `package.json` | NPM конфигурация |
| `README.md` | Эта документация |

## 🔗 Интеграции

| Платформа | DOI / URL | Статус |
|-----------|-----------|--------|
| **Zenodo** | 10.5281/zenodo.17425678 | ✅ Active |
| **OSF** | 10.17605/OSF.IO/GWFZM | ✅ Active |
| **Figshare** | 10.6084/m9.figshare.30588389 | ✅ Active |
| **GitHub Pages** | fractal-metascience.org | ✅ Active |
| **Cloudflare** | fractal-metascience.org | ✅ Active |

## ⚙️ Использование

### Автоматически (GitHub Actions)

Каждый push в `main` запускает `.github/workflows/unified-deploy.yml`:

```
git push origin main → Автодеплой на все платформы
```

### Вручную

```bash
cd .automation
npm install
npm run publish
```

### Отдельные платформы

```bash
npm run publish:zenodo    # Только Zenodo
npm run publish:osf       # Только OSF
npm run publish:figshare  # Только Figshare
npm run sync              # Только синхронизация репо
```

## 🔐 Секреты (GitHub Secrets)

Убедитесь что настроены в Settings → Secrets → Actions:

| Secret | Описание |
|--------|----------|
| `GITHUB_TOKEN` | Автоматический (не нужно создавать) |
| `ZENODO_TOKEN` | Zenodo API token |
| `OSF_TOKEN` | OSF Personal Access Token |
| `FIGSHARE_TOKEN` | Figshare API token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token |

## 📊 Workflow Pipeline

```
Push to main
    │
    ▼
┌─────────────────────────────────────┐
│  unified-deploy.yml                 │
├─────────────────────────────────────┤
│  1. Validate & Version              │
│  2. Sync Repositories               │
│  3. Deploy Website (Pages + CF)     │
│  4. Publish DOI (Zenodo/OSF/Fig)    │
│  5. Create Release (optional)       │
└─────────────────────────────────────┘
    │
    ▼
✅ Ecosystem Synchronized
```

## 👤 Автор

**Abdurashid Abdukarimov**
- ORCID: [0009-0000-6394-4912](https://orcid.org/0009-0000-6394-4912)
- Email: a.abdukarimov@fractal-metascience.org
- Web: [fractal-metascience.org](https://fractal-metascience.org)

---

**From Colony 36 • From Zero to Life**

© 2025-2026 Licensed under Terra Public License v1.0
