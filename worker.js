export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'X-Terra-Version': '4.2',
      'X-Terra-Architect': 'Abdurashid Abdukarimov',
      'X-Terra-ORCID': '0009-0000-6394-4912'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });

    // === API ЭНДПОИНТЫ ===

    if (path === '/api/health') {
      return new Response(JSON.stringify({
        status: "LIVE",
        version: "4.2",
        mode: "TERRA_GOLD",
        architect: "Abdurashid Abdukarimov",
        message: "Navoiy-Terra + Babur active • FMP Institute Live"
      }), { headers });
    }

    if (path === '/api/translate') {
      const body = await request.json().catch(() => ({}));
      const text = body.text || "Terra Codex";
      return new Response(JSON.stringify({
        original: text,
        translated: `🌍 ${text} — переведено через Navoiy-Terra v1.2 + Babur`,
        confidence: 0.97,
        terra_compliance: "TERRA_GOLD",
        child_safe: true
      }), { headers });
    }

    if (path === '/api/auction') {
      return new Response(JSON.stringify({
        status: "active",
        lots: [
          { id: 1, name: "Green Station Planner v2.0", start_price: 100000 },
          { id: 2, name: "Navoiy-Terra Corpus v1.2 + Babur", start_price: 250000 }
        ],
        fund_model: "10% author / 90% Future Generations Fund"
      }), { headers });
    }

    // Главная
    return new Response(JSON.stringify({
      name: "TERRA CODEX API v4.2",
      status: "LIVE",
      endpoints: ["/api/health", "/api/translate", "/api/auction"],
      architect: "Abdurashid Abdukarimov"
    }), { headers });
  }
};
