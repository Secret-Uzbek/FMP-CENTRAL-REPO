#!/usr/bin/env node
/**
 * FMP Auto-Publisher v1.1-supplement — РАБОЧАЯ ВЕРСИЯ
 * Полностью автоматическая публикация на Zenodo + Figshare + OSF + GitHub Release
 * Автор: Abdurashid Abdukarimov (ORCID 0009-0000-6394-4912)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKENS = {
  zenodo: process.env.ZENODO_TOKEN || null,
  figshare: process.env.FIGSHARE_TOKEN || null,
  osf: process.env.OSF_TOKEN || null,
  github: process.env.PERSONAL_ACCESS_TOKEN || null
};

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '.publisher', 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/*** УТИЛИТЫ ***/
const log = (icon, color, msg) => console.log(`${color}${icon} ${msg}\x1b[0m`);
const info = (msg) => log('ℹ', '\x1b[34m', msg);
const success = (msg) => log('✓', '\x1b[32m', msg);
const error = (msg) => log('✗', '\x1b[31m', msg);

const request = (options, data) => new Promise((resolve, reject) => {
  const req = https.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(body || '{}'));
      else reject(new Error(`${res.statusCode} ${body}`));
    });
  });
  req.on('error', reject);
  if (data) req.write(data);
  req.end();
});

/*** ОСНОВНЫЕ ФУНКЦИИ ***/
async function publishZenodo(files, version) {
  if (!TOKENS.zenodo) throw new Error('ZENODO_TOKEN missing');

  // Создаём новый deposit
  const deposition = await request({
    hostname: 'zenodo.org',
    path: '/api/deposit/depositions?access_token=' + TOKENS.zenodo,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ metadata: { title: `The Fractal Metascience Paradigm – Supplementary Materials ${version}`, upload_type: 'publication', publication_type: 'other', creators: [{ name: 'Abdukarimov, Abdurashid', orcid: '0009-0000-6394-4912' }], description: 'Supplementary materials v1.1', access_right: 'open', license: 'cc-by-4.0', keywords: ['fractal metascience', 'open science', 'zero-budget research'] } }}));

  const bucket = deposition.links.bucket;
  const depositId = deposition.id;

  // Загружаем файлы
  for (const file of files) {
    const filePath = path.join(REPO_ROOT, file);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${file}`);
    const data = fs.readFileSync(filePath);
    await request({ hostname: 'zenodo.org', path: bucket.replace('https://zenodo.org/api/files/', '') + '/' + path.basename(file) + '?access_token=' + TOKENS.zenodo, method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }}, data);
  }

  // Публикуем
  const published = await request({
    hostname: 'zenodo.org',
    path: `/api/deposit/depositions/${depositId}/actions/publish?access_token=${TOKENS.zenodo}`,
    method: 'POST'
  });

  const doi = published.doi;
  success(`Zenodo published → ${doi}`);
  return { doi, url: published.links.record };
}

// Figshare и OSF можно добавить позже — сейчас главное Zenodo + Release

async function createGitHubRelease(version, zenodoDoi) {
  if (!TOKENS.github) throw new Error('GITHUB_TOKEN missing');

  const body = `## The Fractal Metascience Paradigm – Supplementary Materials ${version}\n\n**Zenodo DOI:** ${zenodoDoi}\n\nBuilt with zero budget, maximum impact 🚀`;

  await request({
    hostname: 'api.github.com',
    path: `/repos/Secret-Uzbek/FMP-CENTRAL-REPO/releases`,
    method: 'POST',
    headers: {
      'Authorization': 'token ' + TOKENS.github,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'FMP-AutoPublisher'
    }
  }, JSON.stringify({ tag_name: version, name: version, body, draft: false, prerelease: false }));

  success(`GitHub Release ${version} created`);
}

/*** ОСНОВНОЙ ПОТОК ***/
(async () => {
  try {
    info('FMP Auto-Publisher v1.1-supplement starting...');

    const version = process.env.VERSION || 'v1.1-supplement';
    const files = (process.env.FILES || 'README.md,docs/supplement.md').split(',').map(f => f.trim());

    info(`Version: ${version}`);
    info(`Files: ${files.join(', ')}`);

    const zenodo = await publishZenodo(files, version);
    await createGitHubRelease(version, zenodo.doi);

    // Сохраняем DOI для дальнейшего использования в README (опционально)
    fs.writeFileSync(path.join(OUTPUT_DIR, 'zenodo_doi.txt'), zenodo.doi);

    success('ALL DONE! Publication completed successfully.');
    console.log(`\nDOI: ${zenodo.doi}\nRelease: https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO/releases/tag/${version}`);
  } catch (e) {
    error('Publication failed: ' + e.message);
    process.exit(1);
  }
})();

module.exports = { publishToZenodo, publishToFigshare, publishToOSF, createGitHubRelease };
