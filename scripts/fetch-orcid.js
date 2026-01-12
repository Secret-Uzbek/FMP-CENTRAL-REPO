const fs = require('fs');
const https = require('https');
const path = require('path');
const ORCID_ID = process.env.ORCID_ID || '0009-0000-6394-4912';
const OUTPUT_FILE = path.join(__dirname, '../data/orcid.json');
function fetchORCID() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'pub.orcid.org',
      port: 443,
      path: `/v3.0/${ORCID_ID}/record`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FMP-Data-Fetcher/1.0'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const works = jsonData['activities-summary']?.works?.group || [];
          const simplified = works.map(group => {
            const work = group['work-summary']?.[0];
            return {
              title: work?.title?.title?.value || 'Untitled',
              doi: work?.['external-ids']?.['external-id']?.find(id => id['external-id-type'] === 'doi')?.['external-id-value'],
              publication_date: work?.['publication-date'],
              type: work?.type,
              url: work?.url?.value
            };
          }).filter(work => work.doi);
          if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
            fetched_at: new Date().toISOString(),
            orcid_id: ORCID_ID,
            count: simplified.length,
            works: simplified
          }, null, 2), 'utf8');
          console.log(`Saved ${simplified.length} works to ${OUTPUT_FILE}`);
          resolve(simplified);
        } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}
if (require.main === module) {
  fetchORCID()
    .then(() => console.log('ORCID data fetched successfully'))
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
module.exports = { fetchORCID };