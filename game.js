// Главный класс многопользовательской игры
class MultiplayerSpaceGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameBoard = [];
        this.currentScreen = 'loading';
        this.isDiceRolling = false;
        this.timerInterval = null;
        this.timeLeft = 0;
        this.taskGenerator = new TaskGenerator();
        this.turnCount = 1;
        this.gameActive = true;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Инициализация многопользовательской игры...');
            await this.initializeGame();
            this.setupEventListeners();
            this.showLoadingScreen();
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.handleInitError();
        }
    }

    async initializeGame() {
        // Инициализация Telegram Web App
        this.initializeTelegramWebApp();
        
        // Генерация игрового поля
        this.generateGameBoard();
        
        console.log('✅ Игра инициализирована');
    }

    initializeTelegramWebApp() {
        if (window.Telegram && Telegram.WebApp) {
            try {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                console.log('✅ Telegram Web App инициализирован');
            } catch (error) {
                console.warn('⚠️ Telegram Web App не доступен');
            }
        }
    }

    setupEventListeners() {
        // Кнопки настройки игры
        this.safeAddEventListener('startGameBtn', 'click', () => this.startGame());
        
        // Основные кнопки игры
        this.safeAddEventListener('rollDiceBtn', 'click', () => this.rollDice());
        
        // Кнопки заданий
        this.safeAddEventListener('completeTaskBtn', 'click', () => this.completeTask());
        this.safeAddEventListener('skipTaskBtn', 'click', () => this.skipTask());
        this.safeAddEventListener('closeTaskBtn', 'click', () => this.closeTaskScreen());
        
        // Кнопки магазина
        this.safeAddEventListener('shopBtn', 'click', () => this.showShop());
        this.safeAddEventListener('closeShopBtn', 'click', () => this.closeShop());
        
        // Кнопки игроков
        this.safeAddEventListener('playersBtn', 'click', () => this.showPlayers());
        this.safeAddEventListener('closePlayersBtn', 'click', () => this.closePlayers());
        
        // Кнопки победы
        this.safeAddEventListener('newGameBtn', 'click', () => this.newGame());
        this.safeAddEventListener('continueGameBtn', 'click', () => this.continueGame());
        
        // Категории магазина
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterShopItems(e.target.dataset.category));
        });

        console.log('✅ Обработчики событий установлены');
    }

    safeAddEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    showLoadingScreen() {
        this.showScreen('loadingScreen');
        
        setTimeout(() => {
            this.showSetupScreen();
        }, 3000);
    }

    showSetupScreen() {
        this.showScreen('setupScreen');
        this.renderPlayersGrid();
        this.setupPlayerInputs();
    }

    renderPlayersGrid() {
        const grid = document.getElementById('playersGrid');
        grid.innerHTML = '';

        for (let i = 2; i <= 16; i++) {
            const btn = document.createElement('button');
            btn.className = 'player-count-btn';
            btn.innerHTML = `
                <span class="player-count">${i}</span>
                <span class="player-label">игроков</span>
            `;
            btn.addEventListener('click', () => this.selectPlayerCount(i));
            grid.appendChild(btn);
        }
    }

    selectPlayerCount(count) {
        this.selectedPlayerCount = count;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.player-count-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.renderPlayersList(count);
    }

    renderPlayersList(count) {
        const list = document.getElementById('playersList');
        list.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-setup-card';
            playerCard.innerHTML = `
                <div class="player-avatar-input" style="background: ${PLAYER_COLORS[i]}">
                    ${PLAYER_AVATARS[i]}
                </div>
                <input type="text" class="player-name-input" value="${generatePlayerName(i)}" 
                       placeholder="Имя игрока">
            `;
            list.appendChild(playerCard);
        }
    }

    setupPlayerInputs() {
        // Настройка начальных монет и цели
        const startCoinsInput = document.getElementById('startCoins');
        const targetCoinsInput = document.getElementById('targetCoins');
        
        if (startCoinsInput) {
            startCoinsInput.value = GAME_CONFIG.startCoins;
        }
        if (targetCoinsInput) {
            targetCoinsInput.value = GAME_CONFIG.targetCoins;
        }
    }

    startGame() {
        if (!this.selectedPlayerCount) {
            alert('Выберите количество игроков!');
            return;
        }

        // Создаем игроков
        this.players = [];
        const nameInputs = document.querySelectorAll('.player-name-input');
        
        for (let i = 0; i < this.selectedPlayerCount; i++) {
            const name = nameInputs[i]?.value || generatePlayerName(i);
            this.players.push({
                id: i,
                name: name,
                avatar: PLAYER_AVATARS[i],
                color: PLAYER_COLORS[i],
                coins: parseInt(document.getElementById('startCoins').value) || GAME_CONFIG.startCoins,
                position: 0,
                inventory: [],
                activeEffects: [],
                turnsPlayed: 0
            });
        }

        this.targetCoins = parseInt(document.getElementById('targetCoins').value) || GAME_CONFIG.targetCoins;
        this.currentPlayerIndex = 0;
        this.turnCount = 1;
        this.gameActive = true;

        this.showMainScreen();
        this.updateGameUI();
    }

    showMainScreen() {
        this.showScreen('mainScreen');
        this.renderGameBoard();
        this.updatePlayersOnBoard();
        this.animateEntrance();
    }

    generateGameBoard() {
        this.gameBoard = [];
        for (let i = 0; i < GAME_CONFIG.totalCells; i++) {
            const specialCell = SPECIAL_CELLS[i];
            this.gameBoard.push({
                position: i,
                type: specialCell ? specialCell.type : 'normal',
                name: specialCell ? specialCell.name : `Клетка ${i + 1}`,
                effect: specialCell ? specialCell.effect : null
            });
        }
    }

    renderGameBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';

        this.gameBoard.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.className = `board-cell ${cell.type}`;
            cellElement.textContent = cell.position + 1;
            cellElement.title = cell.name;
            
            // Добавляем специальные стили для особых клеток
            if (cell.type !== 'normal') {
                cellElement.style.background = this.getCellColor(cell.type);
                cellElement.style.color = 'white';
            }

            board.appendChild(cellElement);
        });
    }

    getCellColor(cellType) {
        const colors = {
            start: 'linear-gradient(135deg, #10b981, #16a34a)',
            shop: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            event: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            challenge: 'linear-gradient(135deg, #f59e0b, #d97706)',
            finish: 'linear-gradient(135deg, #ef4444, #dc2626)'
        };
        return colors[cellType] || 'rgba(255, 255, 255, 0.05)';
    }

    updatePlayersOnBoard() {
        const container = document.getElementById('playersOnBoard');
        container.innerHTML = '';

        this.players.forEach(player => {
            const token = document.createElement('div');
            token.className = 'player-token';
            token.style.background = player.color;
            token.textContent = player.avatar;
            
            // Позиционируем фишку на поле
            this.positionPlayerToken(token, player.position);
            
            container.appendChild(token);
        });
    }

    positionPlayerToken(token, position) {
        const board = document.getElementById('gameBoard');
        if (!board) return;

        const cells = board.getElementsByClassName('board-cell');
        if (cells[position]) {
            const cellRect = cells[position].getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            
            const x = cellRect.left - boardRect.left + cellRect.width / 2;
            const y = cellRect.top - boardRect.top + cellRect.height / 2;
            
            token.style.left = `${x - 15}px`;
            token.style.top = `${y - 15}px`;
        }
    }

    updateGameUI() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        // Обновляем информацию о текущем игроке
        this.updateElementText('currentPlayerName', currentPlayer.name);
        this.updateElementText('currentPlayerAvatar', currentPlayer.avatar);
        this.updateElementText('currentPlayerCoins', currentPlayer.coins.toString());
        
        // Обновляем общую информацию
        this.updateElementText('currentTurn', this.turnCount.toString());
        this.updateElementText('playersCount', this.players.length.toString());
        
        // Обновляем стиль баджа текущего игрока
        const badge = document.getElementById('currentPlayerBadge');
        if (badge) {
            badge.style.borderColor = currentPlayer.color;
        }
    }

    async rollDice() {
        if (this.isDiceRolling || !this.gameActive) return;
        
        this.isDiceRolling = true;
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
        if (diceBtn) diceBtn.disabled = true;

        // Анимация броска
        for (let i = 0; i < 8; i++) {
            const randomNum = Math.floor(Math.random() * 6) + 1;
            if (diceResult) diceResult.textContent = randomNum;
            await this.delay(150);
        }

        const finalRoll = Math.floor(Math.random() * 6) + 1;
        if (diceResult) {
            diceResult.textContent = finalRoll;
            diceResult.classList.add('fade-in-up');
        }

        console.log(`🎲 Игрок ${this.currentPlayerIndex + 1} выбросил: ${finalRoll}`);

        setTimeout(() => {
            this.movePlayer(finalRoll);
            if (diceResult) diceResult.classList.remove('fade-in-up');
            if (diceBtn) diceBtn.disabled = false;
            this.isDiceRolling = false;
        }, 1000);
    }

    async movePlayer(steps) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const newPosition = (currentPlayer.position + steps) % GAME_CONFIG.totalCells;
        
        // Анимация движения
        for (let i = 1; i <= steps; i++) {
            currentPlayer.position = (currentPlayer.position + 1) % GAME_CONFIG.totalCells;
            this.updatePlayersOnBoard();
            await this.delay(300);
        }

        console.log(`🪐 Игрок ${currentPlayer.name} прибыл на клетку ${currentPlayer.position + 1}`);

        // Обрабатываем клетку
        this.handleCellArrival(currentPlayer.position);
    }

    handleCellArrival(position) {
        const cell = this.gameBoard[position];
        const currentPlayer = this.players[this.currentPlayerIndex];

        console.log(`📍 Клетка: ${cell.name} (${cell.type})`);

        // Обрабатываем специальные эффекты клеток
        switch (cell.type) {
            case 'start':
                this.showMessage(`${currentPlayer.name} проходит старт! +10 🪙`);
                this.addCoins(currentPlayer, 10);
                this.nextTurn();
                break;
            case 'shop':
                this.showMessage(`Магазин! ${currentPlayer.name} может купить усиления`);
                setTimeout(() => this.showShop(), 1000);
                break;
            case 'event':
                this.triggerRandomEvent();
                break;
            case 'challenge':
                this.showMessage(`Испытание! ${currentPlayer.name} получает особое задание`);
                setTimeout(() => this.showSpecialChallenge(), 1000);
                break;
            case 'finish':
                this.showMessage(`Финиш! ${currentPlayer.name} получает бонус +25 🪙`);
                this.addCoins(currentPlayer, 25);
                this.nextTurn();
                break;
            default:
                // Обычная клетка - выдаем случайное задание
                setTimeout(() => this.showTaskScreen(), 1000);
        }
    }

    showTaskScreen() {
        const task = this.taskGenerator.getTaskByDifficulty();
        const difficulty = DIFFICULTY_LEVELS[task.difficulty];
        const category = TASK_CATEGORIES[task.category];
        
        // Обновляем интерфейс задания
        this.updateElementText('taskDifficulty', difficulty.name);
        this.updateElementText('taskReward', `+${difficulty.reward} 🪙`);
        this.updateElementText('taskCategory', category.name);
        this.updateElementText('taskTitle', task.title);
        this.updateElementText('taskDescription', task.description);
        this.updateElementText('taskHint', task.hint);
        
        // Устанавливаем иконку
        const taskIcon = document.getElementById('taskIcon');
        if (taskIcon) taskIcon.textContent = category.icon;
        
        // Настраиваем сложность
        const difficultyBadge = document.getElementById('taskDifficultyBadge');
        if (difficultyBadge) {
            difficultyBadge.className = `difficulty-badge ${task.difficulty}`;
        }
        
        // Запускаем таймер
        this.startTimer(difficulty.time);
        
        this.showScreen('taskScreen');
        this.currentTask = task;
    }

    startTimer(duration) {
        this.timeLeft = duration;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.showMessage('Время вышло! Задание провалено.');
                this.nextTurn();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.updateElementText('timerText', `${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Обновление прогресс-бара
        const progress = document.querySelector('.timer-progress');
        if (progress && this.currentTask) {
            const duration = DIFFICULTY_LEVELS[this.currentTask.difficulty].time;
            const circumference = 283;
            const offset = circumference - (this.timeLeft / duration) * circumference;
            progress.style.strokeDashoffset = offset;
        }
    }

    completeTask() {
        this.stopTimer();
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        const reward = DIFFICULTY_LEVELS[this.currentTask.difficulty].reward;
        
        // Проверяем усиления
        let finalReward = reward;
        if (currentPlayer.activeEffects.includes('next_reward_double')) {
            finalReward *= 2;
            this.removeEffect(currentPlayer, 'next_reward_double');
        }
        
        this.addCoins(currentPlayer, finalReward);
        
        this.showMainScreen();
        
        setTimeout(() => {
            this.showMessage(`Отлично! ${currentPlayer.name} получает ${finalReward} 🪙`);
            this.checkWinCondition();
            this.nextTurn();
        }, 500);
    }

    skipTask() {
        this.stopTimer();
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        const penalty = GAME_CONFIG.skipTaskPenalty;
        
        // Проверяем наличие бесплатного пропуска
        if (currentPlayer.activeEffects.includes('free_skip')) {
            this.removeEffect(currentPlayer, 'free_skip');
            this.showMessage(`${currentPlayer.name} использовал бесплатный пропуск!`);
        } else {
            this.addCoins(currentPlayer, -penalty);
            this.showMessage(`${currentPlayer.name} пропускает задание. Штраф -${penalty} 🪙`);
        }
        
        this.showMainScreen();
        setTimeout(() => this.nextTurn(), 500);
    }

    addCoins(player, amount) {
        player.coins = Math.max(0, player.coins + amount);
        this.updateGameUI();
        
        // Анимация изменения монет
        this.animateCoinsChange(amount);
    }

    animateCoinsChange(amount) {
        const coinsDisplay = document.querySelector('.player-coins');
        if (coinsDisplay) {
            coinsDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                coinsDisplay.style.transform = 'scale(1)';
            }, 300);
        }
    }

    nextTurn() {
        // Увеличиваем счетчик ходов
        this.players[this.currentPlayerIndex].turnsPlayed++;
        
        // Переходим к следующему игроку
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.turnCount++;
        
        // Обновляем интерфейс
        this.updateGameUI();
        
        console.log(`🔄 Ход ${this.turnCount}. Сейчас играет: ${this.players[this.currentPlayerIndex].name}`);
    }

    checkWinCondition() {
        const winner = this.players.find(player => player.coins >= this.targetCoins);
        if (winner) {
            this.showWinScreen(winner);
        }
    }

    showWinScreen(winner) {
        this.gameActive = false;
        
        this.updateElementText('winnerText', `${winner.name} достиг цели!`);
        this.updateElementText('winnerCoins', winner.coins.toString());
        this.updateElementText('gameTurns', this.turnCount.toString());
        
        this.renderFinalRanking();
        this.showScreen('winScreen');
    }

    renderFinalRanking() {
        const ranking = document.getElementById('finalRanking');
        ranking.innerHTML = '';

        // Сортируем игроков по монетам
        const sortedPlayers = [...this.players].sort((a, b) => b.coins - a.coins);
        
        sortedPlayers.forEach((player, index) => {
            const rankItem = document.createElement('div');
            rankItem.className = 'ranking-item';
            rankItem.innerHTML = `
                <div class="ranking-position pos-${index + 1}">${index + 1}</div>
                <div class="ranking-avatar">${player.avatar}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${player.name}</div>
                    <div class="ranking-coins">${player.coins} 🪙</div>
                </div>
            `;
            ranking.appendChild(rankItem);
        });
    }

    showShop() {
        this.renderShopItems();
        this.updateShopCoins();
        this.showScreen('shopScreen');
    }

    renderShopItems() {
        const container = document.getElementById('shopItems');
        container.innerHTML = '';

        const allItems = [
            ...SHOP_ITEMS.boosters,
            ...SHOP_ITEMS.powers,
            ...SHOP_ITEMS.cosmetics
        ];

        allItems.forEach(item => {
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            shopItem.innerHTML = `
                <div class="shop-item-header">
                    <div class="shop-item-icon">${item.icon}</div>
                    <div class="shop-item-info">
                        <div class="shop-item-name">${item.name}</div>
                        <div class="shop-item-category">${item.category}</div>
                    </div>
                    <div class="shop-item-price">${item.price} 🪙</div>
                </div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-actions">
                    <button class="buy-button" onclick="window.multiplayerGame.buyItem('${item.id}')">
                        Купить
                    </button>
                </div>
            `;
            container.appendChild(shopItem);
        });
    }

    updateShopCoins() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.updateElementText('shopPlayerCoins', currentPlayer.coins.toString());
    }

    buyItem(itemId) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const allItems = [
            ...SHOP_ITEMS.boosters,
            ...SHOP_ITEMS.powers,
            ...SHOP_ITEMS.cosmetics
        ];
        
        const item = allItems.find(i => i.id === itemId);
        
        if (!item) {
            console.error('Предмет не найден:', itemId);
            return;
        }
        
        if (currentPlayer.coins < item.price) {
            this.showMessage('Недостаточно монет!');
            return;
        }
        
        // Покупаем предмет
        this.addCoins(currentPlayer, -item.price);
        currentPlayer.inventory.push(item);
        currentPlayer.activeEffects.push(item.effect);
        
        this.showMessage(`Куплено: ${item.name}!`);
        this.updateShopCoins();
        this.renderInventory();
        
        // Обновляем кнопку покупки
        const buyButton = event.target;
        buyButton.textContent = 'Куплено';
        buyButton.disabled = true;
    }

    renderInventory() {
        const container = document.getElementById('inventoryItems');
        container.innerHTML = '';

        const currentPlayer = this.players[this.currentPlayerIndex];
        
        currentPlayer.inventory.forEach(item => {
            const invItem = document.createElement('div');
            invItem.className = 'inventory-item';
            invItem.innerHTML = `
                <div class="inventory-item-icon">${item.icon}</div>
                <div class="inventory-item-name">${item.name}</div>
            `;
            container.appendChild(invItem);
        });
    }

    removeEffect(player, effect) {
        const index = player.activeEffects.indexOf(effect);
        if (index > -1) {
            player.activeEffects.splice(index, 1);
        }
    }

    showPlayers() {
        this.renderPlayersRanking();
        this.showScreen('playersScreen');
    }

    renderPlayersRanking() {
        const container = document.getElementById('playersRanking');
        container.innerHTML = '';

        const sortedPlayers = [...this.players].sort((a, b) => b.coins - a.coins);
        
        sortedPlayers.forEach((player, index) => {
            const isCurrent = player.id === this.players[this.currentPlayerIndex].id;
            const rankItem = document.createElement('div');
            rankItem.className = `player-rank-item ${isCurrent ? 'current' : ''}`;
            rankItem.innerHTML = `
                <div class="rank-position rank-${index + 1}">${index + 1}</div>
                <div class="player-rank-avatar">${player.avatar}</div>
                <div class="player-rank-info">
                    <div class="player-rank-name">${player.name}</div>
                    <div class="player-rank-stats">
                        <span>${player.coins} 🪙</span>
                        <span>${player.turnsPlayed} ходов</span>
                    </div>
                </div>
            `;
            container.appendChild(rankItem);
        });
    }

    triggerRandomEvent() {
        const events = [
            { message: "Космический ветер! Все игроки получают +5 🪙", effect: () => {
                this.players.forEach(player => this.addCoins(player, 5));
            }},
            { message: "Метеоритный дождь! Текущий игрок теряет -10 🪙", effect: () => {
                this.addCoins(this.players[this.currentPlayerIndex], -10);
            }},
            { message: "Обнаружен астероид с сокровищами! +15 🪙", effect: () => {
                this.addCoins(this.players[this.currentPlayerIndex], 15);
            }}
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.showMessage(randomEvent.message);
        randomEvent.effect();
        
        this.nextTurn();
    }

    showSpecialChallenge() {
        // Специальное сложное задание с увеличенной наградой
        const task = this.taskGenerator.getRandomTask('hard');
        this.currentTask = task;
        
        this.updateElementText('taskDifficulty', 'Особое');
        this.updateElementText('taskReward', '+50 🪙');
        this.updateElementText('taskCategory', 'Особое испытание');
        this.updateElementText('taskTitle', task.title);
        this.updateElementText('taskDescription', task.description);
        this.updateElementText('taskHint', task.hint);
        
        const taskIcon = document.getElementById('taskIcon');
        if (taskIcon) taskIcon.textContent = '⚡';
        
        const difficultyBadge = document.getElementById('taskDifficultyBadge');
        if (difficultyBadge) {
            difficultyBadge.className = 'difficulty-badge hard';
        }
        
        this.startTimer(150); // 2.5 минуты на особое задание
        this.showScreen('taskScreen');
    }

    closeTaskScreen() {
        this.stopTimer();
        this.showMainScreen();
    }

    closeShop() {
        this.showMainScreen();
    }

    closePlayers() {
        this.showMainScreen();
    }

    newGame() {
        this.showSetupScreen();
        this.taskGenerator.resetUsedTasks();
    }

    continueGame() {
        this.gameActive = true;
        this.showMainScreen();
    }

    filterShopItems(category) {
        // Обновляем активные кнопки категорий
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Фильтрация предметов (упрощенная версия)
        this.renderShopItems(); // В реальной реализации здесь была бы фильтрация
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }

    showMessage(message) {
        // Можно реализовать красивую систему уведомлений
        console.log(`💬 ${message}`);
        // Временное решение - alert
        alert(message);
    }

    animateEntrance() {
        const elements = document.querySelectorAll('.game-header, .game-area, .control-panel');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    handleInitError() {
        this.showMessage('Произошла ошибка при загрузке игры. Пожалуйста, обновите страницу.');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Запуск многопользовательской космической игры...');
    window.multiplayerGame = new MultiplayerSpaceGame();
});

// Глобальные функции для отладки
window.debugGame = () => {
    console.log('Отладочная информация:', window.multiplayerGame);
};

window.addCoins = (amount = 100) => {
    if (window.multiplayerGame) {
        const player = window.multiplayerGame.players[window.multiplayerGame.currentPlayerIndex];
        window.multiplayerGame.addCoins(player, amount);
    }
};
