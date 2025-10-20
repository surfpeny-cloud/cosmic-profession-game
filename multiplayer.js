// Система мультиплеера для космической игры
class MultiplayerSystem {
    constructor() {
        this.socket = null;
        this.sessionId = null;
        this.players = new Map();
        this.currentSession = null;
        this.isHost = false;
        this.connectionStatus = 'disconnected';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMultiplayerTemplates();
    }

    setupEventListeners() {
        // Слушатели для вкладки мультиплеера
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-mptab]')) {
                const tab = e.target.closest('[data-mptab]').dataset.mptab;
                this.switchMultiplayerTab(tab);
            }

            if (e.target.closest('.create-session-btn')) {
                this.createSession();
            }

            if (e.target.closest('.join-session-btn')) {
                const sessionId = e.target.closest('.join-session-btn').dataset.session;
                this.joinSession(sessionId);
            }
        });
    }

    // Создание мультиплеер сессии
    async createSession() {
        const sessionData = {
            sessionId: this.generateSessionId(),
            host: window.game?.player?.telegramId || 'local_player',
            hostName: window.game?.player?.name || 'Исследователь',
            maxPlayers: 4,
            currentPlayers: 1,
            status: 'waiting',
            gameMode: 'cooperative', // cooperative, competitive, creative
            created: new Date().toISOString(),
            settings: {
                planets: 15,
                timeLimit: 3600, // 1 час
                allowHelpers: true
            }
        };

        this.currentSession = sessionData;
        this.isHost = true;
        this.sessionId = sessionData.sessionId;

        // Сохраняем в базу данных
        if (window.gameDatabase) {
            await window.gameDatabase.createMultiplayerSession(sessionData);
        }

        // Подключаемся к "серверу" (в реальности WebRTC или WebSocket)
        this.connectToSession(sessionData.sessionId);

        this.updateMultiplayerUI();
        this.showNotification(`Сессия ${sessionData.sessionId} создана!`, 'success');
    }

    // Подключение к сессии
    async joinSession(sessionId) {
        this.sessionId = sessionId;
        this.isHost = false;

        // Загружаем данные сессии
        const session = await this.loadSession(sessionId);
        if (!session) {
            this.showNotification('Сессия не найдена!', 'error');
            return;
        }

        if (session.status !== 'waiting') {
            this.showNotification('Сессия уже началась!', 'error');
            return;
        }

        if (session.currentPlayers >= session.maxPlayers) {
            this.showNotification('Сессия заполнена!', 'error');
            return;
        }

        this.currentSession = session;
        this.connectToSession(sessionId);

        this.updateMultiplayerUI();
        this.showNotification(`Присоединились к сессии ${sessionId}`, 'success');
    }

    // Подключение к сессии (заглушка для демо)
    connectToSession(sessionId) {
        this.connectionStatus = 'connecting';
        
        // Имитация подключения
        setTimeout(() => {
            this.connectionStatus = 'connected';
            
            // Добавляем тестовых игроков для демо
            this.addDemoPlayers();
            
            this.updateMultiplayerUI();
            this.showNotification('Подключение установлено!', 'success');
        }, 2000);
    }

    // Добавление демо-игроков
    addDemoPlayers() {
        const demoPlayers = [
            {
                id: 'demo1',
                name: 'Космический Исследователь',
                profession: 'Звездный Биолог-Эколог',
                avatar: '👨‍🚀',
                ready: true,
                position: 0,
                stars: 5
            },
            {
                id: 'demo2', 
                name: 'Галактический Художник',
                profession: 'Космический Дизайнер-Архитектор',
                avatar: '👩‍🎨',
                ready: false,
                position: 2,
                stars: 3
            }
        ];

        demoPlayers.forEach(player => {
            this.players.set(player.id, player);
        });
    }

    // Загрузка сессии (заглушка)
    async loadSession(sessionId) {
        return {
            sessionId: sessionId,
            host: 'demo_host',
            hostName: 'Демо Хост',
            maxPlayers: 4,
            currentPlayers: 2,
            status: 'waiting',
            gameMode: 'cooperative',
            created: new Date().toISOString()
        };
    }

    // Переключение вкладок мультиплеера
    switchMultiplayerTab(tab) {
        // Обновляем активные кнопки
        document.querySelectorAll('.mp-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-mptab="${tab}"]`).classList.add('active');

        // Показываем соответствующий контент
        this.updateMultiplayerContent(tab);
    }

    // Обновление контента мультиплеера
    updateMultiplayerContent(tab) {
        const content = document.querySelector('.multiplayer-content');
        if (!content) return;

        switch (tab) {
            case 'lobby':
                content.innerHTML = this.generateLobbyHTML();
                break;
            case 'guilds':
                content.innerHTML = this.generateGuildsHTML();
                break;
            case 'leaderboard':
                content.innerHTML = this.generateLeaderboardHTML();
                break;
            case 'challenges':
                content.innerHTML = this.generateChallengesHTML();
                break;
        }
    }

    // Генерация HTML для лобби
    generateLobbyHTML() {
        if (!this.currentSession) {
            return `
                <div class="no-session">
                    <div class="no-session-icon">👥</div>
                    <h3>Нет активной сессии</h3>
                    <p>Создайте новую сессию или присоединитесь к существующей</p>
                    <button class="btn btn-primary create-session-btn">
                        🚀 Создать сессию
                    </button>
                    <div class="available-sessions">
                        <h4>Доступные сессии:</h4>
                        <div class="session-list">
                            ${this.generateSessionList()}
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="active-session">
                <div class="session-header">
                    <h3>Сессия: ${this.currentSession.sessionId}</h3>
                    <div class="session-status ${this.currentSession.status}">
                        ${this.getStatusText(this.currentSession.status)}
                    </div>
                </div>

                <div class="players-list">
                    <h4>Игроки (${this.players.size}/${this.currentSession.maxPlayers})</h4>
                    ${Array.from(this.players.values()).map(player => `
                        <div class="player-slot ${player.ready ? 'ready' : ''}">
                            <div class="player-avatar">${player.avatar}</div>
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-profession">${player.profession}</div>
                            </div>
                            <div class="player-stats">
                                <span>⭐ ${player.stars}</span>
                                <span>🪐 ${player.position}</span>
                            </div>
                            <div class="player-status">
                                ${player.ready ? '✅ Готов' : '⏳ Ожидание'}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="session-controls">
                    ${this.isHost ? `
                        <button class="btn btn-success start-session-btn">
                            🎮 Начать игру
                        </button>
                        <button class="btn btn-secondary settings-btn">
                            ⚙️ Настройки
                        </button>
                    ` : `
                        <button class="btn ${this.isReady ? 'btn-secondary' : 'btn-primary'} ready-btn">
                            ${this.isReady ? '❌ Не готов' : '✅ Готов'}
                        </button>
                    `}
                    <button class="btn btn-danger leave-btn">
                        🚪 Покинуть
                    </button>
                </div>
            </div>
        `;
    }

    // Генерация списка сессий
    generateSessionList() {
        const demo
