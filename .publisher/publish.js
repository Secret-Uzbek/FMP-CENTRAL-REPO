#!/usr/bin/env node
console.log("🚀 FMP Auto-Publisher запущен");

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.publisher', 'output');
fs.mkdirSync(OUT, { recursive: true });

const token = process.env.ZENODO_TOKEN || process.env.zenodo_token || process.env.ZenodoToken;
if (!token) {
  console.error("❌ ZENODO_TOKEN не найден в secrets");
  process.exit(1);
}

const version = process.env.VERSION || 'v1.1-supplement';
const files = (process.env.FILES || 'README.md,docs/supplement.md').split(',').map(f => f.trim());

console.log(`Версия: ${version}`);
console.log(`Файлы: ${files.join(', ')}`);

const request = (opt, data) => new Promise((res, rej) => {
  const req = https.request(opt, r => {
    let body = '';
    r.on('data', c => body += c);
    r.on('end', () => {
      if (r.statusCode >= 200 && r.statusCode < 300) res(JSON.parse(body || '{}'));
      else rej(new Error(`${r.statusCode}: ${body}`));
    });
  });
  req.on('error', rej);
  if (data) req.write(data);
  req.end();
});

(async () => {
  try {
    // 1. Создаём депозит
    const dep = await request({
      hostname: 'zenodo.org',
      path: '/api/deposit/depositions?access_token="REDACTED_BY_FMP_GUARD"POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ metadata: { title: `FMP Supplementary ${version}`, upload_type: 'publication', publication_type: 'other', creators: [{ name: 'Abdukarimov, Abdurashid', orcid: '0009-0000-6394-4912' }], description: 'Auto-published by FMP workflow', access_right: 'open', license: 'cc-by-4.0' }}));

    const bucket = dep.links.bucket.replace('https://zenodo.org/api/files/', '');
    const id = dep.id;

    // 2. Загружаем файлы
    for (const f of files) {
      const fp = path.join(ROOT, f);
      if (!fs.existsSync(fp)) throw new Error(`Файл не найден: ${f}`);
      const data = fs.readFileSync(fp);
      await request({
        hostname: 'zenodo.org',
        path: `/api/files/${bucket}/${encodeURIComponent(path.basename(f))}?access_token=${token}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' }
      }, data);
      console.log(`✓ Загружен ${f}`);
    }

    // 3. Публикуем
    const pub = await request({
      hostname: 'zenodo.org',
      path: `/api/deposit/depositions/${id}/actions/publish?access_token=${token}`,
      method: 'POST'
    });

    const doi = pub.doi;
    fs.writeFileSync(path.join(OUT, 'zenodo_doi.txt'), doi);

    console.log(`\n✅ УСПЕХ! DOI: ${doi}`);
    console.log(`🔗 ${pub.links.record}`);
  } catch (e) {
    console.error(`\n❌ ОШИБКА: ${e.message}`);
    process.exit(1);
  }
})();
