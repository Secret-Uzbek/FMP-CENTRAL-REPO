const fs = require('fs');
const https = require('https');
const path = require('path');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'Secret-Uzbek';
const OUTPUT_FILE = path.join(__dirname, '../data/github.json');
if (!GITHUB_TOKEN) console.warn('GITHUB_TOKEN not set, using public API');
function fetchGitHub(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'FMP-Data-Fetcher/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (GITHUB_TOKEN) options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    const req = https.request(options, (res) => {
      let data = '';
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}
async function fetchAllRepos() {
  const repos = [];
  let page = 1;
  const per_page = 100;
  while (true) {
    try {
      const endpoint = `/users/${USERNAME}/repos?per_page=${per_page}&page=${page}&sort=updated`;
      const pageRepos = await fetchGitHub(endpoint);
      if (pageRepos.length === 0) break;
      repos.push(...pageRepos);
      if (pageRepos.length < per_page) break;
      page++;
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      break;
    }
  }
  const fmpRepos = repos
    .filter(repo => 
      repo.name.includes('FMP') || 
      repo.name.includes('AIUZ') || 
      repo.name.includes('Terra') ||
      repo.name.includes('Nullo') ||
      repo.name === 'Uzbek-mining' ||
      repo.name === '.github'
    )
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      size: repo.size,
      default_branch: repo.default_branch,
      updated_at: repo.updated_at,
      has_pages: repo.has_pages,
      topics: repo.topics || []
    }))
    .sort((a, b) => b.stars - a.stars);
  return fmpRepos;
}
async function main() {
  try {
    const repos = await fetchAllRepos();
    if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      fetched_at: new Date().toISOString(),
      username: USERNAME,
      count: repos.length,
      repositories: repos
    }, null, 2), 'utf8');
    console.log(`Saved ${repos.length} repositories to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
if (require.main === module) main();
module.exports = { fetchAllRepos };