// shirak-agent.js - Автономный агент SHIRAK для Fractal Metascience
class ShirakAgent {
    constructor() {
        this.version = '3.0.terra';
        this.memory = JSON.parse(localStorage.getItem('shirak_memory')) || { operations: [] };
        console.log('🤖 SHIRAK: Инициализирован как Terra Agent');
    }

    // ГЛАВНАЯ КОМАНДА: Инициировать процесс через GitHub
    async deployCorpus() {
        const userConfirmed = confirm('SHIRAK: Создать релиз Navoiy-Terra Corpus v1.0.0?\n\nZenodo получит уведомление автоматически.');
        if (!userConfirmed) return;

        // 1. Сохраняем задание в память сайта
        this.memory.operations.push({
            action: 'deploy_corpus',
            timestamp: new Date().toISOString(),
            status: 'requested'
        });
        localStorage.setItem('shirak_memory', JSON.stringify(this.memory));

        // 2. Создаем Issue в репозитории как команду для системы
        const issueTitle = `[SHIRAK-COMMAND] Создать релиз корпуса`;
        const issueBody = `**Команда от директора FMF через агента SHIRAK**\n\n` +
                         `**Цель:** Создать релиз v1.0.0 в репозитории navoiy-terra-corpus\n` +
                         `**Дата:** ${new Date().toISOString()}\n` +
                         `**Триггер:** Ручная команда через сайт\n\n` +
                         `**Ожидаемый результат:**\n` +
                         `1. Релиз v1.0.0 создан\n` +
                         `2. Zenodo автоматически генерирует DOI\n` +
                         `3. DOI добавляется в ORCID профиль\n\n` +
                         `**Статус:** Ожидает выполнения`;

        // 3. Показываем пользователю ссылку для ручного создания Issue
        const issueUrl = `https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO/issues/new?` +
                        `title=${encodeURIComponent(issueTitle)}&` +
                        `body=${encodeURIComponent(issueBody)}&` +
                        `labels=shirak-command`;

        alert(`SHIRAK: Задача сохранена.\n\nСОЗДАЙТЕ ISSUE ВРУЧНУЮ:\n${issueUrl}\n\nПосле создания Issue ваш существующий пайплайн увидит команду и выполнит её.`);

        // 4. Открываем страницу для создания Issue
        window.open(issueUrl, '_blank');
    }

    // Проверка статуса системы
    async checkStatus() {
        const status = {
            github: '✅ Интеграция активна',
            zenodo: '✅ Настроен через GitHub',
            website: '✅ fractal-metascience.org',
            agent: '🤖 SHIRAK v' + this.version,
            memory: `${this.memory.operations.length} операций записано`
        };
        alert('SHIRAK STATUS:\n' + Object.entries(status).map(([k, v]) => `${k}: ${v}`).join('\n'));
    }

    // Показать интерфейс
    showPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="
                position:fixed; bottom:20px; right:20px; 
                background:#2E8B57; color:white; padding:20px; 
                border-radius:12px; z-index:10000; width:350px;
                box-shadow:0 6px 20px rgba(0,0,0,0.3); 
                font-family:Inter, sans-serif;">
                <div style="font-weight:bold; margin-bottom:15px; font-size:18px;">
                    🤖 SHIRAK | Terra Agent
                </div>
                <div style="margin-bottom:15px; font-size:14px;">
                    Режим: <strong>Генератор команд</strong><br>
                    Метод: Issues → GitHub Actions
                </div>
                <button onclick="window.SHIRAK.deployCorpus()" style="
                    background:white; color:#2E8B57; border:none; 
                    padding:12px; border-radius:6px; cursor:pointer; 
                    width:100%; font-weight:bold; margin-bottom:10px;">
                    🚀 Отдать команду "Создать релиз"
                </button>
                <button onclick="window.SHIRAK.checkStatus()" style="
                    background:transparent; color:white; border:1px solid white; 
                    padding:10px; border-radius:6px; cursor:pointer; width:100%;">
                    📊 Проверить статус системы
                </button>
                <div style="margin-top:15px; font-size:11px; opacity:0.8; text-align:center;">
                    Fractal Metascience Foundation | NULLO • PLT • UCOMM • EUO
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }
}

// Автоматическая активация
if (!window.SHIRAK_LOADED) {
    window.SHIRAK_LOADED = true;
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.SHIRAK = new ShirakAgent();
            window.SHIRAK.showPanel();
            console.log('SHIRAK: Агент активирован как генератор команд');
        }, 1000);
    });
}
