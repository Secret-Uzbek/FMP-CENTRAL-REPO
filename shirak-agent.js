// shirak-agent.js - Исправленная версия с визуальной обратной связью
class ShirakAgent {
    constructor() {
        this.version = '1.1.0';
        this.state = 'ready';
        this.memory = JSON.parse(localStorage.getItem('shirak_memory')) || {
            operations: [],
            lastUpdate: new Date().toISOString()
        };
        this.panel = null; // Ссылка на DOM-элемент панели
        this.outputEl = null; // Ссылка на элемент для вывода
    }

    // Основная функция создания релиза
    async deploy() {
        // Меняем состояние и блокируем кнопку
        this.updateState('working', '🔄 Запрос токена...');

        const token = prompt('Введите GitHub Personal Access Token (PAT):\n\n(Он используется только для этой операции и не сохраняется)');

        if (!token) {
            this.updateState('error', '❌ Операция отменена. Токен не введен.');
            return;
        }

        try {
            this.updateState('working', '🔄 Создаю релиз v1.0.0 в GitHub...');

            // 1. Создаем релиз через GitHub API
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
                    body: `## Автономный релиз создан агентом SHIRAK v${this.version}\n\n**Дата:** ${new Date().toLocaleString()}\n**Система:** Fractal Metascience Paradigm (FMP)\n\n### Что включено:\n- 26 оригинальных текстов на чагатайском языке\n- 9-язычный семантический лексикон (PLT-слой)\n- Полная методология Fractal Metascience Paradigm\n\n### Следующие шаги:\n1. Zenodo автоматически создаст DOI (через 5-10 мин)\n2. Добавьте полученный DOI в ORCID профиль\n3. Начните подготовку научной статьи на основе METHODOLOGY.md`,
                    draft: false,
                    prerelease: false,
                    generate_release_notes: true
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`GitHub API: ${data.message || 'Неизвестная ошибка'}`);
            }

            // 2. Сохраняем успешный результат в память
            this.memory.operations.push({
                action: 'deploy_release',
                repo: 'navoiy-terra-corpus',
                version: 'v1.0.0',
                url: data.html_url,
                timestamp: new Date().toISOString(),
                status: 'success'
            });
            localStorage.setItem('shirak_memory', JSON.stringify(this.memory));

            // 3. Показываем успешный результат
            this.updateState('success', `✅ Релиз успешно создан!`);
            
            // Детализированный вывод
            this.logOutput(`
🎉 ОПЕРАЦИЯ УСПЕШНО ЗАВЕРШЕНА

🔗 Ссылка на релиз: ${data.html_url}
🏷️ Версия: ${data.tag_name}
🆔 ID релиза: ${data.id}

📌 Что произойдет дальше:
1. Система GitHub отправит вебхук в Zenodo (уже настроено)
2. Zenodo создаст постоянный DOI (в течение 5-10 минут)
3. Проверить DOI можно здесь: https://zenodo.org/search?q=navoiy-terra-corpus
4. После получения DOI добавьте его в ORCID: https://orcid.org/0009-0000-6394-4912

🤖 Агент SHIRAK сохранил запись об операции в localStorage.
            `);

            // 4. Автоматически создаем Issue с отчетом (в фоне)
            setTimeout(() => this.createAuditIssue(token, data), 1500);

        } catch (error) {
            // Обработка ошибок
            this.memory.operations.push({
                action: 'deploy_release',
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('shirak_memory', JSON.stringify(this.memory));

            this.updateState('error', `❌ Ошибка при создании релиза`);
            this.logOutput(`Детали ошибки: ${error.message}\n\nПроверьте:\n1. Корректность GitHub PAT\n2. Права PAT (нужен scope "repo")\n3. Существование репозитория "navoiy-terra-corpus"`);
        }
    }

    // Создание Issue с отчетом в центральном репозитории
    async createAuditIssue(token, releaseData) {
        try {
            this.logOutput('\n📝 Создаю отчет в FMP-CENTRAL-REPO...');
            
            const response = await fetch('https://api.github.com/repos/Secret-Uzbek/FMP-CENTRAL-REPO/issues', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `[SHIRAK] Релиз Navoiy-Terra Corpus ${releaseData.tag_name} создан`,
                    body: `## Отчет о действии агента SHIRAK\n\n**Релиз успешно создан:** ${releaseData.html_url}\n**Время:** ${new Date().toLocaleString()}\n**Агент:** SHIRAK v${this.version}\n\n### Следующие шаги:\n1. Ожидание создания DOI на Zenodo (автоматически)\n2. Добавление DOI в ORCID профиль\n3. Подготовка научной статьи на основе релиза\n\n---\n*Сообщение сгенерировано автономным агентом SHIRAK*`,
                    labels: ['shirak', 'automation', 'release']
                })
            });

            if (response.ok) {
                this.logOutput('✅ Issue с отчетом успешно создан в FMP-CENTRAL-REPO');
            }
        } catch (issueError) {
            this.logOutput(`⚠️ Не удалось создать Issue: ${issueError.message}`);
        }
    }

    // Функция для вывода информации в панель
    logOutput(message) {
        if (this.outputEl) {
            this.outputEl.textContent += message + '\n';
            this.outputEl.scrollTop = this.outputEl.scrollHeight; // Автопрокрутка
        }
        console.log(`[SHIRAK] ${message}`);
    }

    // Обновление состояния и интерфейса
    updateState(newState, message) {
        this.state = newState;
        
        if (this.panel) {
            const statusEl = this.panel.querySelector('.shirak-status');
            const buttonEl = this.panel.querySelector('.shirak-button');
            
            if (statusEl) statusEl.textContent = `Статус: ${message}`;
            
            if (buttonEl) {
                buttonEl.disabled = (newState === 'working');
                buttonEl.innerHTML = (newState === 'working') ? '⏳ Обработка...' : '🚀 Создать релиз корпуса';
            }
        }
    }

    // Показ панели управления
    showPanel() {
        // Удаляем старую панель, если есть
        const oldPanel = document.getElementById('shirak-agent-panel');
        if (oldPanel) oldPanel.remove();

        // Создаем новую панель
        this.panel = document.createElement('div');
        this.panel.id = 'shirak-agent-panel';
        this.panel.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #2E8B57;
                color: white;
                padding: 20px;
                border-radius: 12px;
                z-index: 10000;
                width: 400px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                font-family: 'Inter', -apple-system, sans-serif;
                border: 1px solid #3da36a;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div style="font-weight: bold; font-size: 18px;">🤖 SHIRAK Agent v${this.version}</div>
                    <button id="shirak-close" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                
                <div class="shirak-status" style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 6px; font-size: 14px;">
                    Статус: Готов к работе
                </div>
                
                <button class="shirak-button" onclick="window.SHIRAK.deploy()" style="
                    background: white;
                    color: #2E8B57;
                    border: none;
                    padding: 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 15px;
                    transition: all 0.2s;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                    🚀 Создать релиз корпуса
                </button>
                
                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">
                    Создаст релиз v1.0.0 в репозитории "navoiy-terra-corpus"
                </div>
                
                <div style="font-size: 14px; margin-bottom: 10px;">Журнал операций:</div>
                <div class="shirak-output" style="
                    background: rgba(0,0,0,0.2);
                    padding: 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    height: 200px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: 'Monaco', 'Consolas', monospace;
                    margin-bottom: 10px;
                ">🤖 Агент SHIRAK инициализирован. Готов к работе.\n</div>
                
                <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7;">
                    <div>Операций в памяти: ${this.memory.operations.length}</div>
                    <div>FMP Fractal Metascience</div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
        
        // Сохраняем ссылку на элемент вывода
        this.outputEl = this.panel.querySelector('.shirak-output');
        
        // Настраиваем кнопку закрытия
        this.panel.querySelector('#shirak-close').addEventListener('click', () => {
            this.panel.remove();
            this.panel = null;
        });
        
        // Выводим историю операций
        if (this.memory.operations.length > 0) {
            const lastOp = this.memory.operations[this.memory.operations.length - 1];
            this.logOutput(`Загружена история. Последняя операция: ${new Date(lastOp.timestamp).toLocaleDateString()}`);
        }
    }
}

// Автоматическая инициализация при загрузке страницы
window.addEventListener('load', () => {
    // Небольшая задержка для полной загрузки страницы
    setTimeout(() => {
        window.SHIRAK = new ShirakAgent();
        window.SHIRAK.showPanel();
        console.log(`🤖 SHIRAK Agent v${window.SHIRAK.version} активирован на ${window.location.hostname}`);
    }, 500);
});
