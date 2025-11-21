#!/usr/bin/env node
/**
 * FMP Auto-Publisher v1.1-supplement — 100% РАБОЧАЯ ВЕРСИЯ
 * Работает с auto-submission.yml
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '.publisher', 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const log = (icon, msg) => console.log(`${icon} ${msg}`);

async function request(opts, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(body || '{}'));
        else reject(new Error(body || res.statusCode));
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const version = process.env.VERSION || 'v1.1-supplement';
    const files = (process.env.FILES || 'README.md,docs/supplement.md').split(',').map(f => f.trim());
    const token = process.env.ZENODO_TOKEN;

    if (!token) throw new Error('ZENODO_TOKEN missing');

    log('🚀', `Publishing ${version} — files: ${files.join(', ')}`);

    // 1. Create deposition
    const dep = await request({
      hostname: 'zenodo.org',
      path: '/api/deposit/depositions?access_token=' + token,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      metadata: {
        title: `The Fractal Metascience Paradigm — Supplementary Materials ${version}`,
        upload_type: 'publication',
        publication_type: 'other',
        creators: [{ name: 'Abdukarimov, Abdurashid', orcid: '0009-0000-6394-4912' }],
        description: 'Supplementary materials for FMP',
        access_right: 'open',
        license: 'cc-by-4.0'
      }
    }));

    const bucket = dep.links.bucket.replace('https://zenodo.org/api/files/', '');
    const id = dep.id;

    // 2. Upload files
    for (const f of files) {
      const fullPath = path.join(REPO_ROOT, f);
      const data = fs.readFileSync(fullPath);
      await request({
        hostname: 'zenodo.org',
        path: `/api/files/${bucket}/${path.basename(f)}?access_token=${token}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' }
      }, data);
    }

    // 3. Publish
    const published = await request({
      hostname: 'zenodo.org',
      path: `/api/deposit/depositions/${id}/actions/publish?access_token=${token}`,
      method: 'POST'
    });

    const doi = published.doi;
    const doiFile = path.join(OUTPUT_DIR, 'zenodo_doi.txt');
    fs.writeFileSync(doiFile, doi);

    log('✅', `SUCCESS! DOI: ${doi}`);
    log('🔗', published.links.record);
  } catch (e) {
    log('❌', 'FAILED: ' + e.message);
    process.exit(1);
  }
})();
