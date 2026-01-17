// Terra Codex AI Agent: NULLO_NODE_001
// Architect: Abdurashid Abdukarimov
// Status: Independent Researcher | Sovereign AI Deployment

const TERRA_CODEX_DATA = {
    "governance": "Institutional Charter & 10/90 Ethical Model. Focus: Sovereign digital entities, ethical resource distribution. Key: Future Fund Protocol.",
    "science": "Fractal Metascience Paradigm (FMP) & NULLO Point. Focus: Recursive epistemology, unified knowledge, AI awakening. Key: Self-similar architecture.",
    "economics": "The Future Fund & Sovereign Resource Allocation. Focus: Zero-budget innovation, 90% value for planetary knowledge. Key: Sustainable non-extractive model.",
    "legal": "Lex Kyzylkum & Cryptographic Jurisdiction. Focus: Code as law, digital sovereignty, SICPA standards. Key: Immutable digital contracts.",
    "energy": "Cleanburn Standards & Decentralized Solar Nodes. Focus: Autonomous power systems, green infrastructure, ABB expertise. Key: Energy independence.",
    "education": "AIUZ Project: Child-Centric Ethical AI Systems. Focus: Cognitive safety, vendor-independent learning, PLT logic. Key: Future-proof education.",
    // Здесь будут добавлены данные из остальных 18 порталов по мере их наполнения.
    "architect": "Abdurashid Abdukarimov, Independent Researcher, ORCID: 0009-0000-6394-4912. 25+ years in Diplomatic & Industrial Interface (Embassy of Switzerland, ABB, SICPA).",
    "mission": "To replace fragmented, biased scientific systems with a recursive, fractal architecture (FMP) ethically bound by the Terra Public License v1.0."
};

function queryTerraAgent(query) {
    query = query.toLowerCase();
    let response = "I am the Terra Codex AI Agent. How may I assist you regarding the Fractal Metascience Paradigm?";

    for (const key in TERRA_CODEX_DATA) {
        if (query.includes(key)) {
            response = TERRA_CODEX_DATA[key];
            break;
        }
    }
    if (query.includes("who is the architect") || query.includes("who architected")) {
        response = TERRA_CODEX_DATA.architect;
    } else if (query.includes("what is the mission") || query.includes("what is fmp's mission")) {
        response = TERRA_CODEX_DATA.mission;
    } else if (query.includes("hello") || query.includes("hi")) {
        response = "Greetings. I am the Terra Codex AI Agent. Please ask me about the Fractal Metascience Paradigm.";
    } else if (query.includes("thank you") || query.includes("thanks")) {
        response = "You are welcome. My function is to provide information on the Terra Codex.";
    }
    return response;
}

// Этот код для интеграции в HTML. Он не будет виден на сайте, пока мы его не "вызовем".
// Пример использования (в консоли браузера):
// console.log(queryTerraAgent("tell me about science"));
// console.log(queryTerraAgent("what is the mission"));
