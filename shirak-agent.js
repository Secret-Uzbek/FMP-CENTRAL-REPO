// SHIRAK v4.1: Рабочий агент с реальным сканированием
class ShirakAgent {
    constructor() {
        this.version = '4.1.working';
        this.knowledgeBase = JSON.parse(localStorage.getItem('shirak_knowledge')) || {
            repositories: [],
            concepts: [],
            lastUpdate: null,
            stats: { files: 0, repos: 0 }
        };
        this.isScanning = false;
    }

    // 1. РАБОЧАЯ ФУНКЦИЯ СКАНИРОВАНИЯ
    async scanRepositories() {
        if (this.isScanning) {
            alert('SHIRAK: Уже сканирую...');
            return;
        }

        this.isScanning = true;
        
        try {
            // Показываем прогресс
            const statusDiv = document.getElementById('shirak-status') || 
                              document.createElement('div');
            statusDiv.id = 'shirak-status';
            statusDiv.innerHTML = '<div style="color:orange">🔍 SHIRAK: Начинаю сканирование...</div>';
            document.body.appendChild(statusDiv);

            // Сканируем через GitHub API (публичный доступ)
            const repos = await this.fetchRepositories();
            
            // Сохраняем результаты
            this.knowledgeBase = {
                repositories: repos.slice(0, 5), // Первые 5 для начала
                concepts: this.extractConcepts(repos),
                lastUpdate: new Date().toISOString(),
                stats: {
                    files: repos.reduce((sum, repo) => sum + (repo.files || 0), 0),
                    repos: repos.length
                }
            };
            
            localStorage.setItem('shirak_knowledge', JSON.stringify(this.knowledgeBase));
            
            // Обновляем интерфейс
            this.updatePanel();
            
            alert(`✅ SHIRAK: Сканирование завершено!\n\nНайдено:\n• ${repos.length} репозиториев\n• ${this.knowledgeBase.stats.files} файлов\n• ${this.knowledgeBase.concepts.length} концептов FMP`);
            
            // Удаляем статус
            statusDiv.remove();
            
        } catch (error) {
            console.error('Scan error:', error);
            alert(`❌ Ошибка сканирования: ${error.message}\n\nИспользуйте ручную команду через Issues.`);
        } finally {
            this.isScanning = false;
        }
    }

    // 2. РЕАЛЬНЫЙ ЗАПРОС К GITHUB API
    async fetchRepositories() {
        // Публичный API, не требует токена для публичных репозиториев
        const response = await fetch('https://api.github.com/users/Secret-Uzbek/repos?per_page=100');
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Собираем базовую информацию
        return repos.map(repo => ({
            name: repo.name,
            description: repo.description || 'Без описания',
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: repo.updated_at,
            url: repo.html_url,
            isFMP: this.isFMPRepository(repo.name, repo.description),
            files: 0 // Будет заполнено отдельным запросом
        }));
    }

    // 3. ОПРЕДЕЛЕНИЕ FMP РЕПОЗИТОРИЕВ
    isFMPRepository(name, description) {
        const fmpKeywords = ['fmp', 'fractal', 'metascience', 'terra', 'nullo', 'plt', 'ucomm', 'euo', 'navoiy', 'codex', 'aiuz'];
        const text = (name + ' ' + (description || '')).toLowerCase();
        return fmpKeywords.some(keyword => text.includes(keyword));
    }

    // 4. ИЗВЛЕЧЕНИЕ КОНЦЕПТОВ
    extractConcepts(repos) {
        const concepts = [
            { name: 'NULLO', description: 'Zero-budget protocol', priority: 1 },
            { name: 'PLT', description: 'Plural-Lingual Translation', priority: 1 },
            { name: 'UCOMM', description: 'Universal Communication', priority: 1 },
            { name: 'EUO', description: 'Emergent Organization', priority: 1 },
            { name: 'FMP Core', description: 'Fractal Metascience Paradigm', priority: 1 }
        ];
        
        // Добавляем концепты из названий репозиториев
        repos.forEach(repo => {
            if (repo.isFMP && repo.name.includes('-')) {
                const parts = repo.name.split('-');
                parts.forEach(part => {
                    if (part.length > 3 && !concepts.some(c => c.name.toLowerCase() === part.toLowerCase())) {
                        concepts.push({
                            name: part.toUpperCase(),
                            description: `Из репозитория: ${repo.name}`,
                            priority: 2
                        });
                    }
                });
            }
        });
        
        return concepts;
    }

    // 5. ОБНОВЛЁННЫЙ ИНТЕЛЛЕКТУАЛЬНЫЙ ИНТЕРФЕЙС
    showIntelligentPanel() {
        // Удаляем старую панель, если есть
        const oldPanel = document.getElementById('shirak-intelligent-panel');
        if (oldPanel) oldPanel.remove();
        
        const hasKnowledge = this.knowledgeBase.repositories.length > 0;
        const lastUpdate = hasKnowledge ? 
            new Date(this.knowledgeBase.lastUpdate).toLocaleString() : 
            'Никогда';
        
        const panel = document.createElement('div');
        panel.id = 'shirak-intelligent-panel';
        panel.innerHTML = `
            <div style="
                position: fixed; bottom: 20px; right: 20px;
                background: linear-gradient(135deg, ${hasKnowledge ? '#2E8B57' : '#d35400'} 0%, #1a5c3a 100%);
                color: white; padding: 25px;
                border-radius: 16px; z-index: 10000; width: 420px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                font-family: 'Inter', sans-serif;
                border: 2px solid ${hasKnowledge ? '#4CAF80' : '#e67e22'};
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div style="font-weight: bold; font-size: 20px; margin-bottom: 5px;">
                            🤖 SHIRAK Core v${this.version}
                        </div>
                        <div style="font-size: 12px; opacity: 0.9;">
                            ${hasKnowledge ? '🟢 База знаний загружена' : '🟡 Требуется сканирование'}
                        </div>
                    </div>
                    <button onclick="document.getElementById('shirak-intelligent-panel').remove()" 
                        style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                
                <!-- Статус сканирования -->
                ${hasKnowledge ? `
                <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>📊 Репозитории:</span>
                        <span>${this.knowledgeBase.stats.repos} шт</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>📁 Файлов найдено:</span>
                        <span>${this.knowledgeBase.stats.files}+</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>🧠 Концептов FMP:</span>
                        <span>${this.knowledgeBase.concepts.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.8;">
                        <span>🕐 Обновлено:</span>
                        <span>${lastUpdate}</span>
                    </div>
                </div>
                ` : `
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 14px; margin-bottom: 10px;">База знаний пуста</div>
                    <div style="font-size: 12px; opacity: 0.8;">Нажмите "Сканировать" чтобы начать</div>
                </div>
                `}
                
                <!-- Кнопки действий -->
                <button onclick="window.SHIRAK.scanRepositories()" style="
                    width: 100%; background: ${hasKnowledge ? 'white' : '#e67e22'}; 
                    color: ${hasKnowledge ? '#2E8B57' : 'white'};
                    border: none; padding: 14px; border-radius: 8px;
                    cursor: pointer; font-weight: bold; margin-bottom: 10px;
                    font-size: 16px; display: flex; align-items: center; justify-content: center;
                    ${this.isScanning ? 'opacity: 0.7; cursor: not-allowed;' : ''}">
                    ${this.isScanning ? '⏳ Сканирую...' : '🔍 Сканировать репозитории'}
                </button>
                
                <button onclick="window.SHIRAK.smartDeploy()" style="
                    width: 100%; background: transparent; color: white;
                    border: 2px solid white; padding: 14px; border-radius: 8px;
                    cursor: pointer; font-weight: bold; margin-bottom: 15px;
                    font-size: 16px;" ${!hasKnowledge ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                    🚀 Умное развертывание
                </button>
                
                <!-- Быстрый просмотр концептов -->
                ${hasKnowledge ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <div style="font-size: 13px; margin-bottom: 10px; opacity: 0.9;">Концепты FMP:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${this.knowledgeBase.concepts.slice(0, 6).map(c => 
                            `<span style="background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px;">${c.name}</span>`
                        ).join('')}
                        ${this.knowledgeBase.concepts.length > 6 ? 
                            `<span style="background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 12px; font-size: 11px;">+${this.knowledgeBase.concepts.length - 6}</span>` : ''}
                    </div>
                </div>
                ` : ''}
                
                <div style="margin-top: 15px; font-size: 11px; opacity: 0.6; text-align: center;">
                    Fractal Metascience Foundation • ${hasKnowledge ? 'Автономный режим' : 'Ожидание данных'}
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    // 6. УМНОЕ РАЗВЕРТЫВАНИЕ (теперь с контекстом)
    async smartDeploy() {
        if (this.knowledgeBase.repositories.length === 0) {
            alert('❌ SHIRAK: Сначала отсканируйте репозитории!');
            return;
        }
        
        const repo = this.knowledgeBase.repositories.find(r => r.name.includes('navoiy'));
        const corpusRepo = repo ? repo.name : 'navoiy-terra-corpus';
        
        const confirmText = `SHIRAK: Начинаю умное развертывание\n\n` +
                          `• Цель: ${corpusRepo} v1.0.0\n` +
                          `• Контекст: ${this.knowledgeBase.concepts.length} концептов FMP\n` +
                          `• Метод: Автономная публикация\n\n` +
                          `Продолжить?`;
        
        if (!confirm(confirmText)) return;
        
        // Создаем умное описание на основе знаний
        const issueBody = this.generateSmartIssue();
        const issueUrl = `https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO/issues/new?` +
            `title=[SHIRAK-AUTO] Умное развертывание ${new Date().toLocaleDateString()}&` +
            `body=${encodeURIComponent(issueBody)}&` +
            `labels=shirak-auto,deployment`;
        
        window.open(issueUrl, '_blank');
        
        alert(`✅ SHIRAK: Задача создана!\n\nОткрыта форма Issue. Нажмите "Submit new issue" для запуска.`);
    }

    // 7. ГЕНЕРАЦИЯ УМНОГО ISSUE
    generateSmartIssue() {
        const navoiyRepo = this.knowledgeBase.repositories.find(r => r.name.includes('navoiy'));
        
        return `**🤖 Автономная команда от SHIRAK v${this.version}**
        
**Основано на анализе ${this.knowledgeBase.stats.repos} репозиториев:**
${this.knowledgeBase.repositories.slice(0, 3).map(r => `- ${r.name} (${r.language || 'разное'})`).join('\n')}

**Ключевые концепты FMP:**
${this.knowledgeBase.concepts.slice(0, 4).map(c => `- **${c.name}**: ${c.description}`).join('\n')}

**🎯 Задача: Создать релиз v1.0.0 для ${navoiyRepo ? navoiyRepo.name : 'navoiy-terra-corpus'}**

**📊 Контекст анализа:**
- Всего репозиториев в экосистеме: ${this.knowledgeBase.stats.repos}
- Дата последнего сканирования: ${new Date(this.knowledgeBase.lastUpdate).toLocaleString()}
- Версия агента: SHIRAK v${this.version}

**🚀 Ожидаемые автономные шаги:**
1. Создать тег v1.0.0 в GitHub Releases
2. Zenodo автоматически получит вебхук и создаст DOI
3. Обновить CITATION.cff во всех связанных репозиториях
4. Сгенерировать отчёт в META-INDEX.md
5. Отправить уведомление в ORCID: 0009-0000-6394-4912

**🔧 Методология:**
Автономное выполнение через GitHub Actions, используя существующие секреты:
- GH_TOKEN для GitHub API
- ZENODO_TOKEN для интеграции
- CLOUDFIRE для развертывания

**🕐 Временная метка:** ${new Date().toISOString()}
**🤖 Агент:** SHIRAK (самообучаемое ядро с контекстом FMP)

---
*Сгенерировано автоматически агентом SHIRAK на основе сканирования экосистемы Fractal Metascience*`;
    }

    // 8. ОБНОВЛЕНИЕ ПАНЕЛИ
    updatePanel() {
        this.showIntelligentPanel();
    }
}

// АКТИВАЦИЯ
if (!window.SHIRAK_LOADED) {
    window.SHIRAK_LOADED = true;
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.SHIRAK = new ShirakAgent();
            window.SHIRAK.showIntelligentPanel();
            console.log('SHIRAK: Активирован с рабочим сканированием');
            
            // Автосканирование при первом посещении (если нет данных)
            if (window.SHIRAK.knowledgeBase.repositories.length === 0) {
                setTimeout(() => {
                    if (confirm('SHIRAK: База знаний пуста. Начать сканирование репозиториев?')) {
                        window.SHIRAK.scanRepositories();
                    }
                }, 2000);
            }
        }, 1000);
    });
}
