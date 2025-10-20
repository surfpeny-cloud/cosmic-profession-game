// ===== КОСМИЧЕСКАЯ ИГРА =====
console.log('🎮 Загрузка космической игры...');

class CosmicProfessionGame {
    constructor() {
        // ===== КОСМИЧЕСКАЯ ИГРА С TELEGRAM ИНТЕГРАЦИЕЙ =====
console.log('🎮 Загрузка космической игры...');

class CosmicProfessionGame {
    constructor() {
        console.log('🔄 Создание космической миссии...');
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentTurn = 1;
        this.gameState = 'setup';
        this.gameBoard = [];
        this.history = [];
        this.diceValue = 0;
        this.currentQuest = null;
        this.selectedColor = 'blue';
        this.timer = null;
        this.tg = null;
        this.telegramUser = null;
        this.hapticAvailable = false;
        
        this.initializeTelegram();
        this.initializeGame();
    }

    initializeTelegram() {
        // Интеграция с Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            
            console.log('✅ Telegram Web App подключен');
            console.log('📱 Платформа:', this.tg.platform);
            console.log('🎨 Тема:', this.tg.colorScheme);
            console.log('📏 Viewport:', this.tg.viewportHeight, 'x', this.tg.viewportWidth);
            
            // Настройка интерфейса
            this.tg.setHeaderColor('#6c5ce7');
            this.tg.setBackgroundColor('#0a0a2a');
            
            // Получаем данные пользователя
            this.telegramUser = this.tg.initDataUnsafe?.user;
            if (this.telegramUser) {
                console.log('👤 Пользователь Telegram:', this.telegramUser);
                this.personalizeForUser();
            }
            
            // Настройка вибрации
            this.setupHapticFeedback();
            
            // Обработчики событий Telegram
            this.setupTelegramEvents();
            
        } else {
            console.log('🌐 Запуск в обычном браузере');
        }
    }

    setupTelegramEvents() {
        if (!this.tg) return;
        
        // Изменение темы
        this.tg.onEvent('themeChanged', () => {
            console.log('Тема изменена на:', this.tg.colorScheme);
            this.applyTelegramTheme();
        });
        
        // Изменение размера окна
        this.tg.onEvent('viewportChanged', (event) => {
            console.log('Viewport изменен:', event);
            this.adjustForViewport();
        });
        
        // Закрытие приложения
        this.tg.onEvent('closed', () => {
            console.log('Приложение закрыто');
            this.saveToStorage(); // Сохраняем при закрытии
        });
    }

    personalizeForUser() {
        if (!this.telegramUser) return;
        
        // Персонализируем приветствие
        const welcomeElement = document.getElementById('userWelcome');
        if (welcomeElement) {
            welcomeElement.textContent = `👋 ${this.telegramUser.first_name}`;
        }
        
        // Можно использовать username для сохранений
        if (this.telegramUser.username) {
            console.log('💾 Username для сохранений:', this.telegramUser.username);
        }
    }

    applyTelegramTheme() {
        if (!this.tg) return;
        
        if (this.tg.colorScheme === 'dark') {
            document.documentElement.style.setProperty('--space-dark', '#0a0a2a');
            document.documentElement.style.setProperty('--space-darker', '#050518');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.08)');
        } else {
            document.documentElement.style.setProperty('--space-dark', '#1a1a4a');
            document.documentElement.style.setProperty('--space-darker', '#0f0f2a');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.12)');
        }
    }

    setupHapticFeedback() {
        // Проверяем поддержку вибрации
        if (this.tg && this.tg.isVersionAtLeast('6.1') && 'vibrate' in navigator) {
            this.hapticAvailable = true;
            console.log('📳 Вибрация доступна');
        }
    }

    playHapticFeedback(type) {
        if (!this.hapticAvailable) return;
        
        const patterns = {
            success: [50, 50, 50],        // Успех
            error: [150, 50, 150],        // Ошибка
            warning: [100],               // Предупреждение
            selection: [50],              // Выбор
            heavy: [200],                 // Важное событие
            light: [30]                   // Легкое уведомление
        };
        
        const pattern = patterns[type] || patterns.light;
        
        try {
            navigator.vibrate(pattern);
            console.log('📳 Вибрация:', type, pattern);
        } catch (error) {
            console.log('⚠️ Вибрация не сработала:', error);
        }
    }

    adjustForViewport() {
        if (!this.tg) return;
        
        const viewportHeight = this.tg.viewportHeight;
        console.log('📏 Высота viewport:', viewportHeight);
        
        // Адаптируем интерфейс под маленькие экраны
        if (viewportHeight < 600) {
            document.body.classList.add('compact-view');
        } else {
            document.body.classList.remove('compact-view');
        }
    }

    // ОБНОВЛЕННЫЙ МЕТОД ПОКАЗА УВЕДОМЛЕНИЙ
    showMessage(message, type = 'info') {
        console.log(`💬 ${type}: ${message}`);
        
        // Вибрация в зависимости от типа сообщения
        this.playHapticFeedback(type);
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌', 
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        // Применяем стили
        const colors = {
            success: 'linear-gradient(135deg, #00b894, #00a085)',
            error: 'linear-gradient(135deg, #ff7675, #d63031)',
            warning: 'linear-gradient(135deg, #fdcb6e, #f39c12)',
            info: 'linear-gradient(135deg, #74b9ff, #0984e3)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: ${type === 'warning' ? '#000' : 'white'};
            padding: 15px 20px;
            border-radius: 15px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
            font-weight: 600;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    // ОБНОВЛЕННЫЙ МЕТОД СОХРАНЕНИЯ С УЧЕТОМ TELEGRAM USER
    saveToStorage() {
        try {
            const gameData = {
                players: this.players,
                currentPlayerIndex: this.currentPlayerIndex,
                currentTurn: this.currentTurn,
                gameState: this.gameState,
                history: this.history,
                gameBoard: this.gameBoard,
                diceValue: this.diceValue,
                currentQuest: this.currentQuest,
                saveTime: new Date().toISOString(),
                // Добавляем информацию о пользователе Telegram для персонализации
                telegramUser: this.telegramUser ? {
                    id: this.telegramUser.id,
                    username: this.telegramUser.username
                } : null
            };
            
            // Создаем уникальный ключ для пользователя Telegram
            const storageKey = this.telegramUser ? 
                `cosmicProfessionGame_${this.telegramUser.id}` : 
                'cosmicProfessionGame';
            
            localStorage.setItem(storageKey, JSON.stringify(gameData));
            console.log('💾 Игра сохранена:', storageKey);
            
        } catch (e) {
            console.warn('⚠️ Не удалось сохранить игру:', e);
        }
    }

    // ОБНОВЛЕННЫЙ МЕТОД ЗАГРУЗКИ С УЧЕТОМ TELEGRAM USER
    loadFromStorage() {
        try {
            // Создаем уникальный ключ для пользователя Telegram
            const storageKey = this.telegramUser ? 
                `cosmicProfessionGame_${this.telegramUser.id}` : 
                'cosmicProfessionGame';
            
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const gameData = JSON.parse(saved);
                
                this.players = gameData.players || [];
                this.currentPlayerIndex = gameData.currentPlayerIndex || 0;
                this.currentTurn = gameData.currentTurn || 1;
                this.gameState = gameData.gameState || 'setup';
                this.history = gameData.history || [];
                this.gameBoard = gameData.gameBoard || [];
                this.diceValue = gameData.diceValue || 0;
                this.currentQuest = gameData.currentQuest || null;
                
                console.log('💾 Игра загружена из сохранения:', storageKey, this.players.length, 'космонавтов');
                
                // Восстанавливаем состояние интерфейса
                this.restoreGameState();
            }
        } catch (e) {
            console.error('❌ Ошибка загрузки сохранения:', e);
        }
    }

    restoreGameState() {
        switch (this.gameState) {
            case 'playing':
                document.getElementById('setupSection').style.display = 'none';
                document.getElementById('gameInterface').style.display = 'block';
                this.updateGameInterface();
                this.showMessage('🚀 Продолжаем космическую миссию!', 'info');
                break;
                
            case 'ended':
                this.endGame();
                break;
                
            default:
                this.updatePlayersList();
                this.updateStartButton();
        }
    }

    // ОБНОВЛЕННЫЙ МЕТОД ДОБАВЛЕНИЯ ИГРОКА С TELEGRAM ДАННЫМИ
    addPlayer() {
        console.log('👤 Добавление космонавта...');
        
        const nameInput = document.getElementById('playerNameInput');
        const professionInput = document.getElementById('professionInput');
        const skillSelect = document.getElementById('mainSkillSelect');
        const interestSelect = document.getElementById('interestSelect');
        
        if (!nameInput || !professionInput) {
            this.showMessage('Ошибка загрузки формы', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const profession = professionInput.value.trim();
        const skill = skillSelect ? skillSelect.value : 'creativity';
        const interest = interestSelect ? interestSelect.value : 'art';
        const color = this.selectedColor;

        console.log(`📝 Данные: "${name}", профессия: "${profession}", цвет: ${color}`);

        // Валидация
        if (!name) {
            this.showMessage('Введите имя космонавта', 'error');
            this.animateError(nameInput);
            return;
        }

        if (!profession) {
            this.showMessage('Придумайте название профессии', 'error');
            this.animateError(professionInput);
            return;
        }

        if (this.players.length >= GAME_CONFIG.maxPlayers) {
            this.showMessage(`Максимум ${GAME_CONFIG.maxPlayers} космонавтов`, 'warning');
            return;
        }

        // Создаем космонавта с дополнительными данными
        const player = {
            id: this.generateId(),
            name: name,
            profession: profession,
            skill: skill,
            interest: interest,
            color: color,
            stars: 0,
            position: 0,
            completedQuests: 0,
            joinTime: new Date().toISOString(),
            // Добавляем информацию о Telegram пользователе если есть
            telegramData: this.telegramUser ? {
                userId: this.telegramUser.id,
                username: this.telegramUser.username
            } : null
        };

        console.log('🎮 Создан космонавт:', player);

        // Вибрация при успешном добавлении
        this.playHapticFeedback('success');
        
        // Добавляем в массив
        this.players.push(player);
        
        // Обновляем интерфейс
        this.updatePlayersList();
        this.updateStartButton();
        
        // Очищаем форму
        this.resetForm(nameInput, professionInput);
        
        // Уведомление
        this.showMessage(`🚀 Космонавт "${name}" присоединился к миссии!`, 'success');
        
        // Сохраняем
        this.saveToStorage();

        console.log('✅ Космонавт добавлен. Всего в экипаже:', this.players.length);
    }

    // ... остальные методы остаются как в предыдущей версии, но с добавлением вибрации
    // в ключевых моментах (бросок кубика, выполнение заданий и т.д.)
}

// Глобальные функции для HTML
function removePlayer(playerId) {
    if (game && typeof game.removePlayer === 'function') {
        game.removePlayer(playerId);
    }
}

// Инициализация игры
let game;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM загружен, запускаем космическую миссию...');
    
    try {
        game = new CosmicProfessionGame();
        console.log('🎉 Космическая игра успешно запущена!');
        
        // Делаем глобально доступным для HTML
        window.game = game;
        
    } catch (error) {
        console.error('💥 Критическая ошибка при запуске игры:', error);
        
        // Показываем пользователю ошибку
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff7675;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            max-width: 300px;
        `;
        errorMsg.innerHTML = `
            <h3>😔 Ошибка загрузки</h3>
            <p>Игра не смогла запуститься. Пожалуйста, обновите страницу.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Обновить</button>
        `;
        document.body.appendChild(errorMsg);
    }
});
        console.log('🔄 Создание космической миссии...');
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentTurn = 1;
        this.gameState = 'setup';
        this.gameBoard = [];
        this.history = [];
        this.diceValue = 0;
        this.currentQuest = null;
        this.selectedColor = 'blue';
        this.timer = null;
        
        this.initializeGame();
    }

    initializeGame() {
        console.log('🚀 Инициализация игры...');
        this.bindEvents();
        this.loadFromStorage();
        this.generateGameBoard();
        this.updateUI();
        this.setupColorSelection();
        console.log('✅ Игра инициализирована');
    }

    bindEvents() {
        console.log('🔗 Привязка космических событий...');
        
        // Основные кнопки
        this.safeBind('addPlayerBtn', () => this.addPlayer());
        this.safeBind('startGameBtn', () => this.startGame());
        this.safeBind('rollBtn', () => this.rollDice());
        this.safeBind('nextPlayerBtn', () => this.nextPlayer());
        this.safeBind('successBtn', () => this.completeQuest(true));
        this.safeBind('skipBtn', () => this.completeQuest(false));
        this.safeBind('endGameBtn', () => this.endGame());
        this.safeBind('newGameBtn', () => this.newGame());

        // Ввод по Enter
        const nameInput = document.getElementById('playerNameInput');
        const professionInput = document.getElementById('professionInput');
        
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addPlayer();
            });
        }
        
        if (professionInput) {
            professionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addPlayer();
            });
        }

        console.log('✅ События привязаны');
    }

    safeBind(elementId, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', handler);
        } else {
            console.warn(`⚠️ Элемент ${elementId} не найден`);
        }
    }

    setupColorSelection() {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Убираем выделение у всех
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // Добавляем выделение выбранному
                option.classList.add('selected');
                this.selectedColor = option.dataset.color;
                console.log(`🎨 Выбран цвет: ${this.selectedColor}`);
            });
        });
    }

    // ===== СОЗДАНИЕ КОСМОНАВТА =====
    addPlayer() {
        console.log('👤 Добавление космонавта...');
        
        const nameInput = document.getElementById('playerNameInput');
        const professionInput = document.getElementById('professionInput');
        const skillSelect = document.getElementById('mainSkillSelect');
        const interestSelect = document.getElementById('interestSelect');
        
        if (!nameInput || !professionInput) {
            this.showMessage('Ошибка загрузки формы', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const profession = professionInput.value.trim();
        const skill = skillSelect ? skillSelect.value : 'creativity';
        const interest = interestSelect ? interestSelect.value : 'art';
        const color = this.selectedColor;

        console.log(`📝 Данные: "${name}", профессия: "${profession}", цвет: ${color}`);

        // Валидация
        if (!name) {
            this.showMessage('Введите имя космонавта', 'error');
            this.animateError(nameInput);
            return;
        }

        if (!profession) {
            this.showMessage('Придумайте название профессии', 'error');
            this.animateError(professionInput);
            return;
        }

        if (this.players.length >= GAME_CONFIG.maxPlayers) {
            this.showMessage(`Максимум ${GAME_CONFIG.maxPlayers} космонавтов`, 'warning');
            return;
        }

        // Проверка уникальности имени
        if (this.players.some(player => player.name.toLowerCase() === name.toLowerCase())) {
            this.showMessage('Космонавт с таким именем уже есть', 'error');
            this.animateError(nameInput);
            return;
        }

        // Создаем космонавта
        const player = {
            id: this.generateId(),
            name: name,
            profession: profession,
            skill: skill,
            interest: interest,
            color: color,
            stars: 0,
            position: 0,
            completedQuests: 0
        };

        console.log('🎮 Создан космонавт:', player);

        // Добавляем в массив
        this.players.push(player);
        
        // Обновляем интерфейс
        this.updatePlayersList();
        this.updateStartButton();
        
        // Очищаем форму
        this.resetForm(nameInput, professionInput);
        
        // Уведомление
        this.showMessage(`🚀 Космонавт "${name}" присоединился к миссии!`, 'success');
        
        // Сохраняем
        this.saveToStorage();

        console.log('✅ Космонавт добавлен. Всего в экипаже:', this.players.length);
    }

    resetForm(nameInput, professionInput) {
        nameInput.value = '';
        professionInput.value = '';
        nameInput.focus();
    }

    animateError(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    removePlayer(playerId) {
        console.log('🗑️ Удаление космонавта:', playerId);
        
        this.players = this.players.filter(player => player.id !== playerId);
        this.updatePlayersList();
        this.updateStartButton();
        this.saveToStorage();
        
        this.showMessage('Космонавт покинул миссию', 'info');
    }

    // ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
    updatePlayersList() {
        const playersList = document.getElementById('playersList');
        const playerCount = document.getElementById('playerCount');
        
        if (!playersList || !playerCount) return;

        playerCount.textContent = `${this.players.length} космонавт${this.getRussianPlural(this.players.length, '', 'а', 'ов')}`;

        if (this.players.length === 0) {
            playersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <div class="empty-text">Экипаж пуст</div>
                    <div class="empty-subtext">Добавьте первого космонавта</div>
                </div>
            `;
        } else {
            playersList.innerHTML = this.players.map(player => `
                <div class="player-item ${player.color}">
                    <div class="player-info">
                        <div class="player-color ${player.color}"></div>
                        <div>
                            <div class="player-name">${player.name}</div>
                            <div class="player-profession">${player.profession}</div>
                        </div>
                    </div>
                    <button class="remove-player" onclick="game.removePlayer('${player.id}')">×</button>
                </div>
            `).join('');
        }
    }

    updateStartButton() {
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            const isValid = this.players.length >= GAME_CONFIG.minPlayers;
            startBtn.disabled = !isValid;
        }
    }

    // ===== ИГРОВОЕ ПОЛЕ =====
    generateGameBoard() {
        this.gameBoard = [];
        const totalCells = GAME_CONFIG.boardSize;
        
        // Создаем клетки с распределением по типам
        for (let i = 0; i < totalCells; i++) {
            let type;
            const rand = Math.random();
            
            if (i === totalCells - 1) {
                type = 'final'; // Последняя клетка - финиш
            } else if (rand < PLANET_TYPES.blue.frequency) {
                type = 'blue';
            } else if (rand < PLANET_TYPES.blue.frequency + PLANET_TYPES.red.frequency) {
                type = 'red'; 
            } else if (rand < PLANET_TYPES.blue.frequency + PLANET_TYPES.red.frequency + PLANET_TYPES.green.frequency) {
                type = 'green';
            } else {
                type = 'yellow';
            }
            
            this.gameBoard.push({
                position: i,
                type: type,
                name: this.getRandomPlanetName()
            });
        }
        
        console.log('🗺️ Игровое поле создано:', this.gameBoard);
    }

    getRandomPlanetName() {
        return PLANET_NAMES[Math.floor(Math.random() * PLANET_NAMES.length)];
    }

    renderGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;

        gameBoard.innerHTML = this.gameBoard.map((cell, index) => {
            const playersOnCell = this.players.filter(p => p.position === index);
            const playerMarkers = playersOnCell.map(player => 
                `<span class="player-marker" style="color: ${PLAYER_COLORS[player.color].hex}">${PLAYER_COLORS[player.color].emoji}</span>`
            ).join('');
            
            const isCurrent = this.getCurrentPlayer().position === index;
            const cellClass = `cell ${cell.type} ${isCurrent ? 'current' : ''} ${cell.type === 'final' ? 'final' : ''}`;
            
            return `
                <div class="${cellClass}" data-position="${index}">
                    ${index + 1}
                    ${playerMarkers}
                </div>
            `;
        }).join('');
    }

    // ===== ИГРОВОЙ ПРОЦЕСС =====
    startGame() {
        if (this.players.length < GAME_CONFIG.minPlayers) {
            this.showMessage(`Нужно как минимум ${GAME_CONFIG.minPlayers} космонавта`, 'warning');
            return;
        }
        
        this.gameState = 'playing';
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        
        this.renderGameBoard();
        this.updateGameInterface();
        this.addHistory('🌌 Космическая миссия началась!');
        
        this.showMessage('🚀 Миссия началась! Удачи, космонавты!', 'success');
        this.saveToStorage();
    }

    async rollDice() {
        if (this.isRolling) return;
        
        const dice = document.getElementById('dice');
        const rollBtn = document.getElementById('rollBtn');
        
        this.isRolling = true;
        rollBtn.disabled = true;

        // Анимация броска
        dice.classList.add('rolling');
        
        // Случайные значения во время анимации
        for (let i = 0; i < 10; i++) {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            document.getElementById('diceNumber').textContent = DICE_SYMBOLS[randomValue - 1];
            await this.sleep(100);
        }
        
        // Финальное значение
        this.diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('diceNumber').textContent = DICE_SYMBOLS[this.diceValue - 1];
        
        // Завершение анимации
        setTimeout(() => {
            dice.classList.remove('rolling');
            rollBtn.disabled = false;
            this.isRolling = false;
            
            this.processDiceResult();
            this.saveToStorage();
        }, 500);
    }

    processDiceResult() {
        const currentPlayer = this.getCurrentPlayer();
        const newPosition = Math.min(currentPlayer.position + this.diceValue, GAME_CONFIG.boardSize - 1);
        
        // Обновляем позицию
        currentPlayer.position = newPosition;
        
        // Показываем результат
        document.getElementById('diceResult').innerHTML = `
            <span class="result-icon">🎯</span>
            <span class="result-text">Результат: ${this.diceValue}</span>
        `;
        
        this.addHistory(`${currentPlayer.name} переместился на ${this.diceValue} планет`);
        
        // Проверяем достижение финиша
        if (newPosition === GAME_CONFIG.boardSize - 1) {
            this.checkVictory();
        } else {
            // Показываем задание планеты
            this.showPlanetQuest();
        }
        
        this.updateGameInterface();
    }

    showPlanetQuest() {
        const currentPlayer = this.getCurrentPlayer();
        const currentCell = this.gameBoard[currentPlayer.position];
        const planetType = PLANET_TYPES[currentCell.type];
        
        // Получаем случайное задание для этого типа планеты
        const quests = COSMIC_QUESTS[currentCell.type];
        const randomQuest = quests[Math.floor(Math.random() * quests.length)];
        
        this.currentQuest = {
            ...randomQuest,
            planetType: currentCell.type,
            planetName: currentCell.name
        };
        
        // Показываем секцию заданий
        document.getElementById('questSection').style.display = 'block';
        
        // Заполняем информацию
        document.getElementById('planetTypeIcon').innerHTML = `${planetType.emoji} ${planetType.name}`;
        document.getElementById('planetType').textContent = planetType.description;
        document.getElementById('planetName').textContent = currentCell.name;
        document.getElementById('questDescription').innerHTML = `
            <strong>Проблема:</strong> ${this.currentQuest.problem}<br><br>
            <strong>Задание:</strong> ${this.currentQuest.task}
        `;
        
        // Показываем таймер если есть
        if (this.currentQuest.time) {
            document.getElementById('questTimer').style.display = 'block';
            document.getElementById('timerValue').textContent = this.currentQuest.time;
            this.startTimer(this.currentQuest.time);
        }
        
        // Показываем кнопки выполнения
        document.getElementById('completionButtons').style.display = 'grid';
        
        this.addHistory(`${currentPlayer.name} прибыл на планету ${currentCell.name}`);
    }

    startTimer(seconds) {
        if (this.timer) clearInterval(this.timer);
        
        let timeLeft = seconds;
        const timerElement = document.getElementById('timerValue');
        
        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.completeQuest(false);
            }
        }, 1000);
    }

    completeQuest(success) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const currentPlayer = this.getCurrentPlayer();
        
        if (success) {
            let starsEarned = 1;
            
            // Особые эффекты для желтых планет
            if (this.currentQuest.effect) {
                switch (this.currentQuest.effect) {
                    case 'all_plus_one':
                        this.players.forEach(player => player.stars++);
                        this.addHistory('🌠 Все космонавты получили по звезде за метеоритный дождь!');
                        break;
                    case 'plus_two_stars':
                        starsEarned = 2;
                        break;
                    case 'all_move_forward':
                        this.players.forEach(player => {
                            if (player.position < GAME_CONFIG.boardSize - 1) {
                                player.position++;
                            }
                        });
                        this.addHistory('⚡ Все космонавты продвинулись вперед!');
                        break;
                }
            }
            
            currentPlayer.stars += starsEarned;
            currentPlayer.completedQuests++;
            
            this.addHistory(`${currentPlayer.name} выполнил задание и получил ${starsEarned} ⭐`);
            this.showMessage(`✅ Отлично! +${starsEarned} звезда!`, 'success');
            
        } else {
            this.addHistory(`${currentPlayer.name} не справился с заданием`);
            this.showMessage('❌ Попробуй в следующий раз!', 'error');
        }
        
        // Скрываем секцию заданий
        document.getElementById('questSection').style.display = 'none';
        document.getElementById('completionButtons').style.display = 'none';
        
        // Проверяем победу
        this.checkVictory();
        
        this.saveToStorage();
    }

    checkVictory() {
        const currentPlayer = this.getCurrentPlayer();
        
        // Проверяем достижение финиша или достаточное количество звезд
        if (currentPlayer.position === GAME_CONFIG.boardSize - 1 || currentPlayer.stars >= GAME_CONFIG.maxStars) {
            this.endGame();
            return;
        }
    }

    nextPlayer() {
        // Переходим к следующему игроку
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.currentTurn++;
        
        // Сбрасываем состояние
        this.diceValue = 0;
        this.currentQuest = null;
        
        // Обновляем интерфейс
        this.updateGameInterface();
        
        // Сбрасываем отображение кубика
        document.getElementById('diceNumber').textContent = '?';
        document.getElementById('diceResult').innerHTML = `
            <span class="result-icon">📊</span>
            <span class="result-text">Результат: -</span>
        `;
        
        // Скрываем задания если были открыты
        document.getElementById('questSection').style.display = 'none';
        
        this.addHistory(`👨‍🚀 Ход переходит к ${this.getCurrentPlayer().name}`);
        this.saveToStorage();
    }

    updateGameInterface() {
        const currentPlayer = this.getCurrentPlayer();
        
        // Обновляем информацию о текущем игроке
        document.getElementById('currentPlayerName').textContent = currentPlayer.name;
        document.getElementById('currentPlayerProfession').textContent = currentPlayer.profession;
        document.getElementById('currentPlayerStars').textContent = currentPlayer.stars;
        document.getElementById('currentPlayerPosition').textContent = currentPlayer.position + 1;
        
        // Обновляем аватар
        const avatar = document.getElementById('currentPlayerAvatar');
        avatar.innerHTML = `<span class="avatar-emoji">${PLAYER_COLORS[currentPlayer.color].emoji}</span>`;
        
        // Обновляем ход
        document.getElementById('currentTurn').textContent = this.currentTurn;
        
        // Обновляем игровое поле
        this.renderGameBoard();
        
        // Обновляем таблицу лидеров
        this.updateLeaderboard();
        
        // Обновляем историю
        this.updateHistory();
        
        // Обновляем текущий шаг в заголовке
        document.getElementById('currentStep').textContent = 
            `Ход ${this.currentTurn} • ${currentPlayer.name}`;
    }

    updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        if (!leaderboard) return;
        
        // Сортируем игроков по звездам (по убыванию)
        const sortedPlayers = [...this.players].sort((a, b) => b.stars - a.stars);
        
        leaderboard.innerHTML = sortedPlayers.map((player, index) => {
            const isCurrent = player.id === this.getCurrentPlayer().id;
            const itemClass = `leaderboard-item ${isCurrent ? 'current' : ''}`;
            
            return `
                <div class="${itemClass}">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="leaderboard-player">
                        <div class="player-color ${player.color}"></div>
                        <div>
                            <div class="player-name">${player.name}</div>
                            <div class="player-profession">${player.profession}</div>
                        </div>
                    </div>
                    <div class="leaderboard-stats">
                        <span>⭐ ${player.stars}</span>
                        <span>🛸 ${player.position + 1}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateHistory() {
        const historyElement = document.getElementById('missionHistory');
        if (!historyElement) return;
        
        if (this.history.length === 0) {
            historyElement.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">📝</div>
                    <div class="empty-text">История миссии пуста</div>
                </div>
            `;
        } else {
            historyElement.innerHTML = this.history
                .slice(-8) // Последние 8 записей
                .reverse() // Новые сверху
                .map(entry => `
                    <div class="history-item ${entry.type || 'blue'}">
                        ${entry.message}
                    </div>
                `)
                .join('');
        }
    }

    addHistory(message, type = 'blue') {
        this.history.push({
            message: message,
            type: type,
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем размер истории
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }

    // ===== ЗАВЕРШЕНИЕ ИГРЫ =====
    endGame() {
        this.gameState = 'ended';
        
        // Определяем победителя
        const winner = [...this.players].sort((a, b) => {
            if (b.stars !== a.stars) return b.stars - a.stars;
            return b.position - a.position;
        })[0];
        
        // Показываем экран победы
        document.getElementById('gameInterface').style.display = 'none';
        document.getElementById('victorySection').style.display = 'block';
        
        // Заполняем информацию о победителе
        document.getElementById('winnerInfo').innerHTML = `
            <h3>🏆 ${winner.name}</h3>
            <p>Профессия: <strong>${winner.profession}</strong></p>
            <p>Звезд: <strong>${winner.stars} ⭐</strong></p>
            <p>Пройдено планет: <strong>${winner.position + 1}</strong></p>
        `;
        
        // Показываем финальную таблицу
        this.showFinalLeaderboard();
        
        this.addHistory(`🏆 ${winner.name} достиг Планеты Профессий!`, 'yellow');
        this.showMessage(`🎉 ${winner.name} победил в космической миссии!`, 'success');
        this.saveToStorage();
    }

    showFinalLeaderboard() {
        const finalLeaderboard = document.getElementById('finalLeaderboard');
        if (!finalLeaderboard) return;
        
        const sortedPlayers = [...this.players].sort((a, b) => {
            if (b.stars !== a.stars) return b.stars - a.stars;
            return b.position - a.position;
        });
        
        finalLeaderboard.innerHTML = `
            <h4>Итоговый рейтинг:</h4>
            ${sortedPlayers.map((player, index) => `
                <div class="leaderboard-item ${index === 0 ? 'current' : ''}">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="leaderboard-player">
                        <div class="player-color ${player.color}"></div>
                        <div>
                            <div class="player-name">${player.name}</div>
                            <div class="player-profession">${player.profession}</div>
                        </div>
                    </div>
                    <div class="leaderboard-stats">
                        <span>⭐ ${player.stars}</span>
                    </div>
                </div>
            `).join('')}
        `;
    }

    newGame() {
        if (confirm('Начать новую космическую миссию? Текущий прогресс будет потерян.')) {
            this.players = [];
            this.currentPlayerIndex = 0;
            this.currentTurn = 1;
            this.gameState = 'setup';
            this.history = [];
            this.diceValue = 0;
            this.currentQuest = null;
            
            // Переключаем интерфейсы
            document.getElementById('victorySection').style.display = 'none';
            document.getElementById('gameInterface').style.display = 'none';
            document.getElementById('setupSection').style.display = 'block';
            
            this.updatePlayersList();
            this.updateStartButton();
            
            // Очищаем хранилище
            localStorage.removeItem('cosmicProfessionGame');
            
            this.showMessage('🔄 Новая миссия начата!', 'success');
        }
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    generateId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showMessage(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00b894' : type === 'error' ? '#ff7675' : type === 'warning' ? '#fdcb6e' : '#74b9ff'};
            color: ${type === 'warning' ? '#000' : 'white'};
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    getRussianPlural(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) return five;
        n %= 10;
        if (n === 1) return one;
        if (n >= 2 && n <= 4) return two;
        return five;
    }

    // ===== СОХРАНЕНИЕ И ЗАГРУЗКА =====
    saveToStorage() {
        try {
            const gameData = {
                players: this.players,
                currentPlayerIndex: this.currentPlayerIndex,
                currentTurn: this.currentTurn,
                gameState: this.gameState,
                history: this.history,
                gameBoard: this.gameBoard,
                diceValue: this.diceValue,
                currentQuest: this.currentQuest,
                saveTime: new Date().toISOString()
            };
            
            localStorage.setItem('cosmicProfessionGame', JSON.stringify(gameData));
        } catch (e) {
            console.warn('⚠️ Не удалось сохранить игру:', e);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('cosmicProfessionGame');
            if (saved) {
                const gameData = JSON.parse(saved);
                
                this.players = gameData.players || [];
                this.currentPlayerIndex = gameData.currentPlayerIndex || 0;
                this.currentTurn = gameData.currentTurn || 1;
                this.gameState = gameData.gameState || 'setup';
                this.history = gameData.history || [];
                this.gameBoard = gameData.gameBoard || [];
                this.diceValue = gameData.diceValue || 0;
                this.currentQuest = gameData.currentQuest || null;
                
                console.log('💾 Игра загружена из сохранения:', this.players.length, 'космонавтов');
                
                // Восстанавливаем состояние интерфейса
                if (this.gameState === 'playing') {
                    document.getElementById('setupSection').style.display = 'none';
                    document.getElementById('gameInterface').style.display = 'block';
                    this.updateGameInterface();
                } else if (this.gameState === 'ended') {
                    this.endGame();
                }
            }
        } catch (e) {
            console.error('❌ Ошибка загрузки сохранения:', e);
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ИГРЫ =====
let game;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM загружен, запускаем космическую миссию...');
    
    try {
        game = new CosmicProfessionGame();
        console.log('🎉 Космическая игра успешно запущена!');
        
        // Делаем глобально доступным для HTML
        window.game = game;
        
    } catch (error) {
        console.error('💥 Критическая ошибка при запуске игры:', error);
        alert('Ошибка загрузки игры. Пожалуйста, обновите страницу.');
    }
});

// Глобальные функции для HTML
function removePlayer(playerId) {
    if (game && typeof game.removePlayer === 'function') {
        game.removePlayer(playerId);
    }

}
