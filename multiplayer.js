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
{
                id: 'COSMIC123',
                hostName: 'Космический Исследователь',
                players: 2,
                maxPlayers: 4,
                mode: 'cooperative',
                status: 'waiting'
            },
            {
                id: 'GALAXY456',
                hostName: 'Звездный Путешественник', 
                players: 3,
                maxPlayers: 4,
                mode: 'competitive',
                status: 'waiting'
            },
            {
                id: 'NEBULA789',
                hostName: 'Галактический Ученый',
                players: 1,
                maxPlayers: 3,
                mode: 'creative',
                status: 'waiting'
            }
        ];

        return demo Sessions.map(session => `
            <div class="session-item">
                <div class="session-info">
                    <div class="session-id">${session.id}</div>
                    <div class="session-host">Хост: ${session.hostName}</div>
                    <div class="session-mode">Режим: ${this.getModeText(session.mode)}</div>
                </div>
                <div class="session-players">
                    👥 ${session.players}/${session.maxPlayers}
                </div>
                <button class="btn btn-primary join-session-btn" data-session="${session.id}">
                    Присоединиться
                </button>
            </div>
        `).join('');
    }

    // Генерация HTML для гильдий
    generateGuildsHTML() {
        return `
            <div class="guilds-container">
                <div class="guilds-header">
                    <h3>🌌 Космические Гильдии</h3>
                    <button class="btn btn-primary create-guild-btn">
                        🏰 Создать гильдию
                    </button>
                </div>

                <div class="guilds-list">
                    <div class="guild-card">
                        <div class="guild-icon">🚀</div>
                        <div class="guild-info">
                            <div class="guild-name">Звездные Исследователи</div>
                            <div class="guild-description">Исследуем самые далекие уголки галактики</div>
                            <div class="guild-stats">
                                <span>👥 15 участников</span>
                                <span>⭐ 245 звезд</span>
                                <span>🏆 12 достижений</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-guild-btn">
                            Вступить
                        </button>
                    </div>

                    <div class="guild-card">
                        <div class="guild-icon">🎨</div>
                        <div class="guild-info">
                            <div class="guild-name">Космические Творцы</div>
                            <div class="guild-description">Создаем красоту во вселенной</div>
                            <div class="guild-stats">
                                <span>👥 8 участников</span>
                                <span>⭐ 180 звезд</span>
                                <span>🏆 8 достижений</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-guild-btn">
                            Вступить
                        </button>
                    </div>

                    <div class="guild-card">
                        <div class="guild-icon">🔬</div>
                        <div class="guild-info">
                            <div class="guild-name">Галактические Ученые</div>
                            <div class="guild-description">Открываем тайны вселенной</div>
                            <div class="guild-stats">
                                <span>👥 22 участника</span>
                                <span>⭐ 310 звезд</span>
                                <span>🏆 18 достижений</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-guild-btn">
                            Вступить
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Генерация HTML для рейтинга
    generateLeaderboardHTML() {
        const demo Leaders = [
            { name: 'Космонавт Алекс', stars: 156, professions: 8, level: 5 },
            { name: 'Звездная Мария', stars: 142, professions: 7, level: 5 },
            { name: 'Галактический Макс', stars: 128, professions: 6, level: 4 },
            { name: 'Орбитальная Анна', stars: 115, professions: 5, level: 4 },
            { name: 'Кометный Иван', stars: 98, professions: 4, level: 3 }
        ];

        return `
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h3>🏆 Рейтинг Игроков</h3>
                    <div class="leaderboard-filters">
                        <button class="filter-btn active" data-filter="stars">По звездам</button>
                        <button class="filter-btn" data-filter="professions">По профессиям</button>
                        <button class="filter-btn" data-filter="level">По уровню</button>
                    </div>
                </div>

                <div class="leaderboard-list">
                    ${demo Leaders.map((player, index) => `
                        <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
                            <div class="rank">${index + 1}</div>
                            <div class="player-avatar">${this.getRankIcon(index + 1)}</div>
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-stats">
                                    <span>⭐ ${player.stars}</span>
                                    <span>🎓 ${player.professions}</span>
                                    <span>📈 Ур. ${player.level}</span>
                                </div>
                            </div>
                            <div class="player-badges">
                                ${index === 0 ? '👑' : ''}
                                ${player.stars > 100 ? '💫' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="my-rank">
                    <h4>Ваше место в рейтинге</h4>
                    <div class="leaderboard-item my-rank-item">
                        <div class="rank">27</div>
                        <div class="player-avatar">👨‍🚀</div>
                        <div class="player-info">
                            <div class="player-name">${window.game?.player?.name || 'Вы'}</div>
                            <div class="player-stats">
                                <span>⭐ ${window.game?.gameState?.stars || 0}</span>
                                <span>🎓 1</span>
                                <span>📈 Ур. 1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Генерация HTML для вызовов
    generateChallengesHTML() {
        return `
            <div class="challenges-container">
                <div class="challenges-header">
                    <h3>🎯 Космические Вызовы</h3>
                    <p>Соревнуйтесь с другими игроками в специальных заданиях!</p>
                </div>

                <div class="challenges-list">
                    <div class="challenge-card">
                        <div class="challenge-icon">⚡</div>
                        <div class="challenge-info">
                            <div class="challenge-name">Скоростное прохождение</div>
                            <div class="challenge-description">Достигните Планеты Профессий за минимальное время</div>
                            <div class="challenge-stats">
                                <span>⏱️ 3 дня осталось</span>
                                <span>👥 45 участников</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-challenge-btn">
                            Участвовать
                        </button>
                    </div>

                    <div class="challenge-card">
                        <div class="challenge-icon">💎</div>
                        <div class="challenge-info">
                            <div class="challenge-name">Сборщик кристаллов</div>
                            <div class="challenge-description">Соберите максимальное количество космических кристаллов</div>
                            <div class="challenge-stats">
                                <span>⏱️ 5 дней осталось</span>
                                <span>👥 32 участника</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-challenge-btn">
                            Участвовать
                        </button>
                    </div>

                    <div class="challenge-card">
                        <div class="challenge-icon">🎨</div>
                        <div class="challenge-info">
                            <div class="challenge-name">Конкурс профессий</div>
                            <div class="challenge-description">Создайте самую креативную профессию будущего</div>
                            <div class="challenge-stats">
                                <span>⏱️ 7 дней осталось</span>
                                <span>👥 28 участников</span>
                            </div>
                        </div>
                        <button class="btn btn-primary join-challenge-btn">
                            Участвовать
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Вспомогательные методы
    generateSessionId() {
        return 'COSMIC' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    getStatusText(status) {
        const statuses = {
            'waiting': 'Ожидание игроков',
            'playing': 'Игра идет',
            'finished': 'Завершена'
        };
        return statuses[status] || status;
    }

    getModeText(mode) {
        const modes = {
            'cooperative': 'Кооператив',
            'competitive': 'Соревнование', 
            'creative': 'Творческий'
        };
        return modes[mode] || mode;
    }

    getRankIcon(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '👨‍🚀';
    }

    showNotification(message, type = 'info') {
        // Используем существующую систему уведомлений
        if (window.GameUtils) {
            GameUtils.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    updateMultiplayerUI() {
        this.updateMultiplayerContent('lobby');
    }

    // Синхронизация игрового состояния в мультиплеере
    syncGameState(gameState) {
        if (!this.currentSession || this.connectionStatus !== 'connected') return;

        // Отправляем состояние игры другим игрокам
        const syncData = {
            type: 'game_state_sync',
            sessionId: this.sessionId,
            playerId: window.game?.player?.telegramId,
            gameState: gameState,
            timestamp: Date.now()
        };

        // В реальном приложении здесь будет отправка через WebSocket
        console.log('🔄 Синхронизация состояния:', syncData);
    }

    // Обработка хода другого игрока
    handlePlayerMove(playerId, moveData) {
        console.log(`🎲 Игрок ${playerId} сделал ход:`, moveData);
        
        // Показываем уведомление о ходе другого игрока
        this.showNotification(`Игрок ${this.players.get(playerId)?.name} сделал ход!`, 'info');
    }

    // Совместное выполнение задания
    startCooperativeMission(missionData) {
        if (!this.currentSession) return;

        // Собираем всех готовых игроков
        const readyPlayers = Array.from(this.players.values()).filter(p => p.ready);
        
        // Запускаем совместное задание
        const cooperativeMission = {
            ...missionData,
            type: 'cooperative',
            players: readyPlayers,
            sharedProgress: 0,
            maxProgress: readyPlayers.length * 100
        };

        console.log('🤝 Запуск совместного задания:', cooperativeMission);
        return cooperativeMission;
    }

    // Завершение сессии
    endSession() {
        if (this.currentSession) {
            console.log('🛑 Завершение мультиплеер сессии:', this.sessionId);
            
            // Сохраняем результаты
            this.saveSessionResults();
            
            // Очищаем состояние
            this.currentSession = null;
            this.sessionId = null;
            this.players.clear();
            this.isHost = false;
            this.connectionStatus = 'disconnected';
        }

        this.updateMultiplayerUI();
    }

    saveSessionResults() {
        const results = {
            sessionId: this.sessionId,
            players: Array.from(this.players.values()),
            endTime: new Date().toISOString(),
            duration: Date.now() - new Date(this.currentSession.created).getTime()
        };

        console.log('💾 Сохранение результатов сессии:', results);
        
        // В реальном приложении здесь будет сохранение на сервер
        localStorage.setItem(`session_${this.sessionId}`, JSON.stringify(results));
    }
}

// Стили для мультиплеера
const multiplayerStyles = `
.multiplayer-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.multiplayer-header {
    text-align: center;
    margin-bottom: 30px;
}

.multiplayer-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
}

.mp-tab {
    background: none;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.mp-tab.active {
    background: rgba(102, 126, 234, 0.3);
    color: #ffd93d;
}

.mp-tab:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Стили для лобби */
.no-session {
    text-align: center;
    padding: 40px 20px;
}

.no-session-icon {
    font-size: 4em;
    margin-bottom: 20px;
    opacity: 0.7;
}

.session-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.session-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.session-info {
    flex: 1;
}

.session-id {
    font-weight: bold;
    color: #ffd93d;
}

.session-host {
    font-size: 0.9em;
    opacity: 0.8;
}

.session-mode {
    font-size: 0.8em;
    opacity: 0.6;
}

.session-players {
    margin: 0 20px;
    font-weight: bold;
}

/* Стили для активной сессии */
.active-session {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(102, 126, 234, 0.3);
}

.session-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.session-status {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: bold;
}

.session-status.waiting {
    background: rgba(255, 217, 61, 0.2);
    color: #ffd93d;
}

.session-status.playing {
    background: rgba(86, 171, 47, 0.2);
    color: #56ab2f;
}

.players-list {
    margin-bottom: 20px;
}

.player-slot {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.player-slot.ready {
    border-color: rgba(86, 171, 47, 0.5);
    background: rgba(86, 171, 47, 0.1);
}

.player-avatar {
    font-size: 1.5em;
}

.player-info {
    flex: 1;
}

.player-name {
    font-weight: bold;
    margin-bottom: 2px;
}

.player-profession {
    font-size: 0.8em;
    opacity: 0.8;
}

.player-stats {
    display: flex;
    gap: 10px;
    font-size: 0.8em;
}

.player-status {
    font-size: 0.8em;
    font-weight: bold;
}

.session-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
}

/* Стили для гильдий */
.guilds-container {
    padding: 20px;
}

.guilds-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.guilds-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.guild-card {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.guild-card:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
}

.guild-icon {
    font-size: 2.5em;
}

.guild-info {
    flex: 1;
}

.guild-name {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 5px;
    color: #ffd93d;
}

.guild-description {
    opacity: 0.8;
    margin-bottom: 10px;
}

.guild-stats {
    display: flex;
    gap: 15px;
    font-size: 0.8em;
    opacity: 0.7;
}

/* Стили для рейтинга */
.leaderboard-container {
    padding: 20px;
}

.leaderboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.leaderboard-filters {
    display: flex;
    gap: 10px;
}

.filter-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8em;
}

.filter-btn.active {
    background: rgba(102, 126, 234, 0.5);
    color: #ffd93d;
}

.leaderboard-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
}

.leaderboard-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.leaderboard-item.top-three {
    background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(255, 154, 61, 0.1) 100%);
    border-color: rgba(255, 217, 61, 0.3);
}

.rank {
    font-weight: bold;
    font-size: 1.2em;
    width: 30px;
    text-align: center;
}

.player-badges {
    margin-left: auto;
}

.my-rank {
    border-top: 2px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
}

.my-rank-item {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
}

/* Стили для вызовов */
.challenges-container {
    padding: 20px;
}

.challenges-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.challenge-card {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.challenge-icon {
    font-size: 2em;
}

.challenge-info {
    flex: 1;
}

.challenge-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 5px;
    color: #ffd93d;
}

.challenge-description {
    opacity: 0.8;
    margin-bottom: 10px;
}

.challenge-stats {
    display: flex;
    gap: 15px;
    font-size: 0.8em;
    opacity: 0.7;
}
`;

// Добавляем стили в документ
const multiplayerStyleSheet = document.createElement('style');
multiplayerStyleSheet.textContent = multiplayerStyles;
document.head.appendChild(multiplayerStyleSheet);

window.multiplayerSystem = new MultiplayerSystem();
