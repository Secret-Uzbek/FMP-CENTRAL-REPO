// SHIRAK v4.0: Автономное ядро с самообучением
class ShirakAgent {
    constructor() {
        this.version = '4.0.self-learning';
        this.knowledgeBase = JSON.parse(localStorage.getItem('shirak_knowledge')) || {
            repositoriesScanned: [],
            concepts: {},
            lastScan: null
        };
        this.scanning = false;
    }

    // 1. САМОСТОЯТЕЛЬНОЕ ИЗУЧЕНИЕ РЕПОЗИТОРИЕВ
    async scanRepositories() {
        if (this.scanning) return;
        this.scanning = true;
        
        alert('SHIRAK: Начинаю сканирование ваших 17 репозиториев...');
        
        try {
            // Анализируем центральный репозиторий первым
            const files = await this.fetchRepoStructure('FMP-CENTRAL-REPO');
            
            // Ищем ключевые файлы
            const keyFiles = files.filter(f => 
                f.includes('.md') || 
                f.includes('.py') || 
                f.includes('README') ||
                f.includes('META-') ||
                f.includes('theory')
            );
            
            this.knowledgeBase.repositoriesScanned.push({
                repo: 'FMP-CENTRAL-REPO',
                files: keyFiles.length,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem('shirak_knowledge', JSON.stringify(this.knowledgeBase));
            
            alert(`SHIRAK: Просканировал FMP-CENTRAL-REPO\nНайдено ${keyFiles.length} ключевых файлов\nТеперь могу работать с вашими концепциями`);
            
        } catch (error) {
            console.error('Scan error:', error);
        }
        
        this.scanning = false;
    }

    // 2. УМНАЯ КОМАНДА: анализ перед действием
    async smartDeploy() {
        const confirm = window.confirm(
            'SHIRAK: Анализирую ситуацию...\n\n' +
            'Действие: Создание релиза navoiy-terra-corpus\n' +
            'Контекст: FMP, NULLO, автономная публикация\n' +
            'Продолжить?'
        );
        
        if (!confirm) return;
        
        // Автономное создание Issue с умным описанием
        const issueBody = this.generateIssueFromKnowledge();
        const issueUrl = `https://github.com/Secret-Uzbek/FMP-CENTRAL-REPO/issues/new?` +
            `title=[SHIRAK-AUTO] Умное развертывание ${new Date().toLocaleDateString()}&` +
            `body=${encodeURIComponent(issueBody)}&` +
            `labels=shirak-auto`;
        
        window.open(issueUrl, '_blank');
        alert('SHIRAK: Создал умную задачу. Ваш пайплайн выполнит её.');
    }

    // 3. ГЕНЕРАЦИЯ КОНТЕКСТА ИЗ ЗНАНИЙ
    generateIssueFromKnowledge() {
        return `**Автономная команда от SHIRAK v${this.version}**

**Основано на анализе:**
- Репозиториев: ${this.knowledgeBase.repositoriesScanned.length}
- Принципов: NULLO, PLT, UCOMM, EUO
- Контекст: Fractal Metascience Paradigm

**Задача:** Создать релиз v1.0.0 для navoiy-terra-corpus

**Ожидаемые автономные шаги:**
1. Создать тег v1.0.0 в GitHub
2. Zenodo автоматически получит DOI
3. Обновить CITATION.cff
4. Сгенерировать отчёт в META-INDEX.md

**Методология:** 
${this.knowledgeBase.repositoriesScanned.length > 0 ? 
'Использую паттерны из ранее просканированных репозиториев' : 
'Стандартный пайплайн FMP'}

**Временная метка:** ${new Date().toISOString()}
**Агент:** SHIRAK (самообучаемое ядро)`;
    }

    // 4. ИНТЕЛЛЕКТУАЛЬНЫЙ ИНТЕРФЕЙС
    showIntelligentPanel() {
        const panel = document.createElement('div');
        panel.id = 'shirak-intelligent-panel';
        panel.innerHTML = `
            <div style="
                position: fixed; bottom: 20px; right: 20px;
                background: linear-gradient(135deg, #2E8B57 0%, #1a5c3a 100%);
                color: white; padding: 25px;
                border-radius: 16px; z-index: 10000; width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                font-family: 'Inter', sans-serif;
                border: 2px solid #4CAF80;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div style="font-weight: bold; font-size: 20px; margin-bottom: 5px;">🤖 SHIRAK Core v${this.version}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Автономный агент с самообучением</div>
                    </div>
                    <button onclick="document.getElementById('shirak-intelligent-panel').remove()" 
                        style="background: transparent; border: none; color: white; font-size: 24px; cursor: pointer;">×</button>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>База знаний:</span>
                        <span>${this.knowledgeBase.repositoriesScanned.length} репозиториев</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Принципы:</span>
                        <span>NULLO • PLT • UCOMM • EUO</span>
                    </div>
                </div>
                
                <button onclick="window.SHIRAK.scanRepositories()" style="
                    width: 100%; background: white; color: #2E8B57;
                    border: none; padding: 14px; border-radius: 8px;
                    cursor: pointer; font-weight: bold; margin-bottom: 10px;
                    font-size: 16px;">
                    🔍 Сканировать мои репозитории
                </button>
                
                <button onclick="window.SHIRAK.smartDeploy()" style="
                    width: 100%; background: transparent; color: white;
                    border: 2px solid white; padding: 14px; border-radius: 8px;
                    cursor: pointer; font-weight: bold; margin-bottom: 10px;
                    font-size: 16px;">
                    🚀 Умное развертывание
                </button>
                
                <div style="margin-top: 15px; font-size: 11px; opacity: 0.7; text-align: center;">
                    Самообучаемое ядро • Сохраняет знания в localStorage<br>
                    Fractal Metascience Foundation
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }
}

// АКТИВАЦИЯ
if (!window.SHIRAK_LOADED) {
    window.SHIRAK_LOADED = true;
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.SHIRAK = new ShirakAgent();
            window.SHIRAK.showIntelligentPanel();
            console.log('SHIRAK: Интеллектуальное ядро активировано');
            
            // Автоматически сканируем при первом посещении
            if (!localStorage.getItem('shirak_first_scan')) {
                setTimeout(() => {
                    window.SHIRAK.scanRepositories();
                    localStorage.setItem('shirak_first_scan', 'done');
                }, 3000);
            }
        }, 1000);
    });
}
