// FMP CORE LOGIC
const TIMELINE_DATA = [
    { year: 1441, type: "ORIGIN", title: "Navoi's Birth", desc: "The semantic seed is planted in Herat." },
    { year: 1483, type: "RECURSION", title: "Babur's Birth", desc: "Andijan. The algorithm begins." },
    { year: 1526, type: "SYNTHESIS", title: "Empire of Meaning", desc: "Babur connects Central Asia and India." },
    { year: 2025, type: "INCUBATION", title: "isolation Coding", desc: "The Architect writes the Codex in isolation." },
    { year: 2026, type: "ACTIVATION", title: "FMP Launch", desc: "Babur-Terra Codex v3.0 goes live." },
    { year: 2026, type: "FUTURE", title: "Feb 21: UST Beta", desc: "Universal Semantic Translator release." }
];

const TRANSLATIONS = {
    uz: { history: "⏳ XRONOS: FRAKTAL TARIX", visuals: "🎥 VIZUAL MANIFEST", greeting: "Salom, Arxitektor. Buyruq kuting." },
    ru: { history: "⏳ ХРОНОС: ФРАКТАЛЬНАЯ ИСТОРИЯ", visuals: "🎥 ВИЗУАЛЬНЫЙ МАНИФЕСТ", greeting: "Приветствую, Архитектор. Ожидаю ввода." },
    en: { history: "⏳ CHRONOS: FRACTAL HISTORY", visuals: "🎥 VISUAL MANIFESTO", greeting: "Greetings, Architect. Awaiting command." }
};

// 1. INIT THREE.JS STARFIELD
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('starfield'), alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
const geometry = new THREE.BufferGeometry();
const vertices = [];
for(let i=0; i<3000; i++) vertices.push((Math.random()-0.5)*2000, (Math.random()-0.5)*2000, (Math.random()-0.5)*2000);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const stars = new THREE.Points(geometry, new THREE.PointsMaterial({color: 0x00ff9d, size: 2}));
scene.add(stars);
camera.position.z = 1000;
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    stars.rotation.x += 0.0002;
    renderer.render(scene, camera);
}
animate();

// 2. RENDER TIMELINE
const feed = document.getElementById('timeline-feed');
TIMELINE_DATA.forEach(item => {
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `<div class="date">${item.year}</div>
                     <div class="event-type">${item.type}</div>
                     <div>${item.title}</div>
                     <div style="color: #666; font-size: 0.9em; margin-top: 5px;">${item.desc}</div>`;
    feed.appendChild(div);
});

// 3. AGENT SHIRAK (LOCAL SIMULATION)
const chat = document.getElementById('chat-window');
function handleInput(e) { if(e.key === 'Enter') sendMessage(); }

function sendMessage() {
    const input = document.getElementById('shirak-input');
    const text = input.value;
    if(!text) return;
    
    // User Msg
    chat.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // Shirak Logic (Simulated RAG)
    setTimeout(() => {
        let response = "[SHIRAK]: Analyzing semantic weights... ";
        if(text.toLowerCase().includes("babur")) response += "Zahiruddin Babur is the primary node of our fractal. His logic connects geography and poetry.";
        else if(text.toLowerCase().includes("ust")) response += "Universal Semantic Translator is currently in Alpha state. Status: ONLINE.";
        else if(text.toLowerCase().includes("navoi")) response += "Navoi provides the lexical foundation for the Codex.";
        else response += "Input logged. Adding to Semantic Corpus for processing.";
        
        chat.innerHTML += `<div class="msg bot">${response}</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 800);
}

// 4. LANGUAGE SWITCH
function setLang(lang) {
    if(TRANSLATIONS[lang]) {
        document.getElementById('t-history').innerText = TRANSLATIONS[lang].history;
        document.getElementById('t-visuals').innerText = TRANSLATIONS[lang].visuals;
        // Buttons
        document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
    }
}
