// shirak-agent.js - Простой автономный агент
class ShirakAgent {
    constructor() {
        this.version = '1.0.0';
        this.memory = JSON.parse(localStorage.getItem('shirak_memory')) || {
            operations: [],
            lastUpdate: new Date().toISOString()
        };
    }
    
    async deploy() {
        const token = prompt('Введите GitHub PAT (он сохранится только в этой сессии):');
        
        if (!token) return;
        
        try {
            // 1. Создаем релиз
            const response = await fetch('https://api.github.com/repos/Secret-Uzbek/navoiy-terra-corpus/releases', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tag_name: 'v1.0.0',
                    name: 'Navoiy-Terra Corpus v1.0.0',
                    body: '## Создано агентом SHIRAK\n\nАвтономный релиз.',
                    draft: false,
                    prerelease: false
                })
            });
            
            const data = await response.json();
            
            // 2. Сохраняем в память
            this.memory.operations.push({
                action: 'deploy',
                url: data.html_url,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('shirak_memory', JSON.stringify(this.memory));
            
            alert(`✅ Готово! Релиз: ${data.html_url}\n\nZenodo создаст DOI автоматически.`);
            
        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    }
    
    showPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #2E8B57;
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">
                <div style="font-weight: bold; margin-bottom: 10px;">🤖 SHIRAK v${this.version}</div>
                <button onclick="window.SHIRAK.deploy()" style="
                    background: white;
                    color: #2E8B57;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                ">🚀 Создать релиз корпуса</button>
            </div>
        `;
        document.body.appendChild(panel);
    }
}

// Автоматическая инициализация
window.addEventListener('load', () => {
    window.SHIRAK = new ShirakAgent();
    window.SHIRAK.showPanel();
    console.log('🤖 SHIRAK Agent активирован на fractal-metascience.org');
});
