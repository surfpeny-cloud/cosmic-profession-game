// Основной игровой код для "ПУТЕШЕСТВИЕ К ПЛАНЕТЕ ПРОФЕССИЙ"

class CosmicProfessionGame {
    constructor() {
        this.players = new Map();
        this.currentPlayerId = null;
        this.gameState = 'waiting'; // waiting, playing, finished
        this.gameBoard = [];
        this.currentTurn = 0;
        this.gameCode = '';
        this.maxPlayers = 18;
        this.gameSpeed = 'normal';
        this.timer = null;
        this.timeLeft = 0;
        this.shopItems = new Map();
        
        this.initializeGame();
        this.initializeEventListeners();
    }
    
    initializeGame() {
        // Загрузка сохраненной игры или создание новой
        const savedGame = GameStorage.loadGame();
        if (savedGame) {
            this.loadGame(savedGame);
        } else {
            this.setupNewGame();
        }
        
        this.renderMainMenu();
    }
    
    setupNewGame() {
        this.gameBoard = generateGameBoard();
        this.gameCode = generateGameCode();
        this.gameState = 'waiting';
        this.currentTurn = 0;
        this.players.clear();
        this.shopItems.clear();
        
        // Инициализация магазина
        this.initializeShop();
    }
    
    initializeShop() {
        // Загрузка всех товаров в магазин
        Object.values(SHOP_ITEMS).forEach(category => {
            category.forEach(item => {
                this.shopItems.set(item.id, { ...item, quantity: 10 });
            });
        });
    }
    
    initializeEventListeners() {
        // Главное меню
        document.getElementById('new-game').addEventListener('click', () => this.showGameSetup());
        document.getElementById('join-game').addEventListener('click', () => this.showJoinGame());
        document.getElementById('how-to-play').addEventListener('click', () => this.showHowToPlay());
        
        // Настройка игры
        document.getElementById('back-to-menu').addEventListener('click', () => this.showMainMenu());
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('copy-code').addEventListener('click', () => this.copyGameCode());
        
        // Игровой процесс
        document.getElementById('roll-dice').addEventListener('click', () => this.rollDice());
        document.getElementById('open-shop').addEventListener('click', () => this.openShop());
        document.getElementById('send-message').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        
        // Модальные окна
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });
        
        // Победа
        document.getElementById('play-again').addEventListener('click', () => this.restartGame());
        document.getElementById('back-to-main').addEventListener('click', () => this.showMainMenu());
        
        // Инициализация аватаров
        this.initializeAvatars();
        
        // Генерация случайных значений для демо
        this.initializeDemoValues();
    }
    
    initializeAvatars() {
        const container = document.getElementById('avatars-container');
        container.innerHTML = '';
        
        AVATARS.forEach((avatar, index) => {
            const avatarElement = document.createElement('div');
            avatarElement.className = 'avatar-option';
            avatarElement.textContent = avatar;
            avatarElement.dataset.avatar = avatar;
            
            avatarElement.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                avatarElement.classList.add('selected');
                this.selectedAvatar = avatar;
            });
            
            container.appendChild(avatarElement);
        });
        
        // Выбираем первый аватар по умолчанию
        if (container.firstChild) {
            container.firstChild.classList.add('selected');
            this.selectedAvatar = AVATARS[0];
        }
    }
    
    initializeDemoValues() {
        // Заполняем поля случайными значениями для демонстрации
        document.getElementById('player-name').value = 'Космонавт_' + Math.floor(Math.random() * 1000);
        document.getElementById('profession-name').value = getRandomProfession();
        document.getElementById('main-skill').value = getRandomSkill();
    }
    
    renderMainMenu() {
        this.showScreen('main-menu');
        this.updateOnlineCount();
    }
    
    showGameSetup() {
        this.showScreen('game-setup');
        document.getElementById('game-code').textContent = this.gameCode;
    }
    
    showJoinGame() {
        const code = prompt('Введите код игры:');
        if (code && code.length === 4) {
            this.joinGame(code);
        }
    }
    
    showHowToPlay() {
        document.getElementById('how-to-play-modal').classList.add('active');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    copyGameCode() {
        const code = document.getElementById('game-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Код игры скопирован!');
        });
    }
    
    startGame() {
        const playerName = document.getElementById('player-name').value.trim();
        const profession = document.getElementById('profession-name').value.trim();
        const skill = document.getElementById('main-skill').value.trim();
        
        if (!playerName || !profession || !skill) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        // Создаем главного игрока
        this.currentPlayerId = this.addPlayer(playerName, profession, skill, this.selectedAvatar);
        
        // Настройки игры
        this.maxPlayers = parseInt(document.getElementById('max-players').value);
        this.gameSpeed = document.getElementById('game-speed').value;
        
        // Добавляем демо-игроков
        this.addDemoPlayers();
        
        this.gameState = 'playing';
        this.showGameBoard();
        this.saveGame();
    }
    
    addPlayer(name, profession, skill, avatar) {
        const playerId = 'player_' + Date.now();
        const player = {
            id: playerId,
            name,
            profession,
            skill,
            avatar,
            position: 0,
            stars: 0,
            coins: 100,
            inventory: [],
            abilities: [],
            isCurrent: false
        };
        
        this.players.set(playerId, player);
        return playerId;
    }
    
    addDemoPlayers() {
        const demoPlayers = [
            { name: "Галактика", profession: "Звездный картограф", skill: "Навигация в космосе" },
            { name: "Орион", profession: "Космический биолог", skill: "Изучение инопланетной жизни" },
            { name: "Андромеда", profession: "Инженер гравитации", skill: "Создание искусственной тяжести" }
        ];
        
        demoPlayers.forEach((demo, index) => {
            this.addPlayer(
                demo.name,
                demo.profession,
                demo.skill,
                AVATARS[index + 1]
            );
        });
    }
    
    showGameBoard() {
        this.showScreen('game-board');
        
        // Обновляем информацию об игре
        document.getElementById('current-game-code').textContent = this.gameCode;
        document.getElementById('max-players-display').textContent = this.maxPlayers;
        document.getElementById('current-players').textContent = this.players.size;
        
        // Обновляем информацию о текущем игроке
        this.updateCurrentPlayerInfo();
        
        // Рендерим игровое поле
        this.renderGameBoard();
        
        // Рендерим список игроков
        this.renderPlayersList();
    }
    
    updateCurrentPlayerInfo() {
        const player = this.players.get(this.currentPlayerId);
        if (!player) return;
        
        document.getElementById('current-player-name').textContent = player.name;
        document.getElementById('current-player-profession').textContent = player.profession;
        document.getElementById('player-avatar').textContent = player.avatar;
        document.getElementById('stars-earned').textContent = player.stars;
        document.getElementById('coins-earned').textContent = player.coins;
    }
    
    renderGameBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        this.gameBoard.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = `
                <div class="planet-number">${planet.number}</div>
                <div class="planet-type">${planet.name}</div>
            `;
            
            // Добавляем маркеры игроков
            this.players.forEach(player => {
                if (player.position === index) {
                    const marker = document.createElement('div');
                    marker.className = `player-marker ${player.id === this.currentPlayerId ? 'current' : ''}`;
                    marker.style.backgroundColor = this.getPlayerColor(player.id);
                    marker.textContent = player.avatar;
                    marker.title = player.name;
                    planetElement.appendChild(marker);
                }
            });
            
            boardElement.appendChild(planetElement);
        });
    }
    
    renderPlayersList() {
        const listElement = document.getElementById('players-list');
        listElement.innerHTML = '';
        
        this.players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.className = `player-item ${player.id === this.currentPlayerId ? 'current' : ''}`;
            playerElement.innerHTML = `
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-details">
                    <div class="player-name">${player.name}</div>
                    <div class="player-stats">
                        <span>⭐ ${player.stars}</span>
                        <span>🪙 ${player.coins}</span>
                        <span>📍 ${player.position}</span>
                    </div>
                </div>
            `;
            listElement.appendChild(playerElement);
        });
    }
    
    getPlayerColor(playerId) {
        // Генерируем цвет на основе ID игрока
        const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
            '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ];
        let hash = 0;
        for (let i = 0; i < playerId.length; i++) {
            hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }
    
    rollDice() {
        const rollButton = document.getElementById('roll-dice');
        rollButton.disabled = true;
        
        const diceElement = document.getElementById('dice');
        let rolls = 0;
        const maxRolls = 10;
        
        const rollInterval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = randomValue;
            diceElement.style.animation = 'none';
            void diceElement.offsetWidth;
            diceElement.style.animation = 'pulse 0.3s ease-out';
            
            rolls++;
            if (rolls >= maxRolls) {
                clearInterval(rollInterval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                diceElement.textContent = finalValue;
                
                setTimeout(() => {
                    this.movePlayer(finalValue);
                    rollButton.disabled = false;
                }, 500);
            }
        }, 100);
    }
    
    movePlayer(steps) {
        const player = this.players.get(this.currentPlayerId);
        const oldPosition = player.position;
        const newPosition = Math.min(oldPosition + steps, this.gameBoard.length - 1);
        
        player.position = newPosition;
        
        // Показываем сообщение о перемещении
        this.addChatMessage('system', `${player.name} переместился на ${steps} шагов и прибыл на ${this.gameBoard[newPosition].name}`);
        
        this.renderGameBoard();
        this.renderPlayersList();
        
        // Проверяем достижение финиша
        if (newPosition === this.gameBoard.length - 1 && player.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1000);
            return;
        }
        
        // Показываем задание для планеты
        setTimeout(() => {
            this.showPlanetTask(newPosition);
        }, 1500);
    }
    
    showPlanetTask(planetIndex) {
        const planet = this.gameBoard[planetIndex];
        const taskElement = document.getElementById('current-task');
        
        let taskHTML = '';
        
        if (planet.type === 'start') {
            taskHTML = this.generateStartTask();
        } else if (planet.type === 'finish') {
            taskHTML = this.generateFinishTask();
        } else {
            switch (planet.type) {
                case 'blue':
                    taskHTML = this.generateBluePlanetTask();
                    break;
                case 'red':
                    taskHTML = this.generateRedPlanetTask();
                    break;
                case 'green':
                    taskHTML = this.generateGreenPlanetTask();
                    break;
                case 'yellow':
                    taskHTML = this.generateYellowPlanetTask();
                    break;
            }
        }
        
        taskElement.innerHTML = taskHTML;
        
        // Запускаем таймер для заданий с ограничением по времени
        if (planet.type === 'blue') {
            this.startTaskTimer();
        }
    }
    
    generateStartTask() {
        return `
            <div class="task-content">
                <h3 class="task-title">🚀 Начало путешествия!</h3>
                <p class="task-description">Ваше космическое путешествие начинается! Приготовьтесь к удивительным приключениям на Планете Профессий!</p>
                <div class="task-actions">
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(1)">Начать приключение! (+1⭐)</button>
                </div>
            </div>
        `;
    }
    
    generateFinishTask() {
        const player = this.players.get(this.currentPlayerId);
        
        if (player.stars >= 10) {
            this.showVictoryScreen();
            return '';
        }
        
        return `
            <div class="task-content">
                <h3 class="task-title">🎯 Почти у цели!</h3>
                <p class="task-description">Вы достигли Планеты Профессий, но вам нужно собрать еще ${10 - player.stars} звезд, чтобы выиграть!</p>
                <div class="task-actions">
                    <button class="btn btn-secondary" onclick="game.continueFromFinish()">Продолжить сбор звезд</button>
                </div>
            </div>
        `;
    }
    
    generateBluePlanetTask() {
        const problem = getRandomProblem();
        const player = this.players.get(this.currentPlayerId);
        
        return `
            <div class="task-content">
                <h3 class="task-title">🔵 Космическая задача</h3>
                <p class="task-description"><strong>Проблема:</strong> ${problem}</p>
                <p class="task-description"><strong>Ваша профессия:</strong> ${player.profession}</p>
                <p class="task-description"><strong>Задание:</strong> Придумай, как твоя профессия может помочь! Опиши или нарисуй решение.</p>
                <div class="task-timer" id="task-timer">⏱️ Осталось времени: 2:00</div>
                <div class="task-actions">
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(1)">Простое решение (+1⭐)</button>
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(2)">Оригинальное решение (+2⭐)</button>
                    <button class="btn btn-secondary fail-task" onclick="game.failTask()">Не могу решить</button>
                </div>
            </div>
        `;
    }
    
    generateRedPlanetTask() {
        const player = this.players.get(this.currentPlayerId);
        
        return `
            <div class="task-content">
                <h3 class="task-title">🔴 Доказательство полезности</h3>
                <p class="task-description"><strong>Ваша профессия:</strong> ${player.profession}</p>
                <p class="task-description"><strong>Задание:</strong> Убеди других игроков, что твоя профессия полезна для космонавтов!</p>
                <div class="task-actions">
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(3)">Убедил всех! (+3⭐)</button>
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(2)">Убедил частично (+2⭐)</button>
                    <button class="btn btn-secondary fail-task" onclick="game.failTask()">Нужно больше аргументов</button>
                </div>
            </div>
        `;
    }
    
    generateGreenPlanetTask() {
        return `
            <div class="task-content">
                <h3 class="task-title">🟢 Помощь другим</h3>
                <p class="task-description"><strong>Задание:</strong> Помоги другому игроку с его заданием!</p>
                <div class="task-actions">
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(1)">Помог успешно! (+1⭐)</button>
                    <button class="btn btn-secondary fail-task" onclick="game.failTask()">Не смог помочь</button>
                </div>
            </div>
        `;
    }
    
    generateYellowPlanetTask() {
        const event = getRandomEvent();
        
        return `
            <div class="task-content">
                <h3 class="task-title">🟡 Космическое событие</h3>
                <p class="task-description"><strong>Событие:</strong> ${event.title}</p>
                <p class="task-description">${event.description}</p>
                <div class="task-actions">
                    <button class="btn btn-primary complete-task" onclick="game.completeTask(1)">Принять событие (+1⭐)</button>
                </div>
            </div>
        `;
    }
    
    startTaskTimer() {
        this.timeLeft = 120;
        const timerElement = document.getElementById('task-timer');
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            
            if (timerElement) {
                timerElement.textContent = `⏱️ Осталось времени: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.failTask();
            }
        }, 1000);
    }
    
    completeTask(stars) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const player = this.players.get(this.currentPlayerId);
        player.stars += stars;
        player.coins += stars * 10; // Награда монетами
        
        this.addChatMessage('system', `${player.name} выполнил задание и получил ${stars} ⭐!`);
        
        this.updateCurrentPlayerInfo();
        this.renderPlayersList();
        
        const taskElement = document.getElementById('current-task');
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">🎉 Отлично!</h3>
                <p class="task-description">Вы получили ${stars} ⭐ и ${stars * 10} 🪙 за выполнение задания!</p>
                <p class="task-description">Теперь у вас ${player.stars} из 10 необходимых звезд.</p>
                ${player.stars >= 10 ? '<p style="color: var(--accent-color); font-weight: bold;">🎯 Вы собрали достаточно звезд! Достигайте Планеты Профессий чтобы победить!</p>' : ''}
            </div>
        `;
        
        // Проверяем победу
        if (player.position === this.gameBoard.length - 1 && player.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 2000);
        }
        
        this.saveGame();
    }
    
    failTask() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const taskElement = document.getElementById('current-task');
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">😔 Не удалось выполнить задание</h3>
                <p class="task-description">Не расстраивайтесь! В космосе бывают разные трудности.</p>
                <p class="task-description">Попробуйте в следующий раз!</p>
            </div>
        `;
    }
    
    continueFromFinish() {
        const player = this.players.get(this.currentPlayerId);
        player.position = Math.max(0, player.position - 3);
        
        this.renderGameBoard();
        this.renderPlayersList();
        
        const taskElement = document.getElementById('current-task');
        taskElement.innerHTML = '<div class="task-placeholder"><div class="placeholder-icon">🎯</div><p>Бросьте кубик, чтобы продолжить!</p></div>';
        
        this.addChatMessage('system', `${player.name} возвращается на поиски звезд!`);
    }
    
    openShop() {
        const modal = document.getElementById('shop-modal');
        const player = this.players.get(this.currentPlayerId);
        
        document.getElementById('shop-balance').textContent = player.coins;
        this.renderShopItems();
        
        modal.classList.add('active');
        
        // Обработчики вкладок магазина
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderShopItems(e.target.dataset.tab);
            });
        });
    }
    
    renderShopItems(category = 'abilities') {
        const container = document.getElementById('shop-items');
        const items = SHOP_ITEMS[category] || [];
        const player = this.players.get(this.currentPlayerId);
        
        container.innerHTML = '';
        
        items.forEach(item => {
            const canAfford = player.coins >= item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <div class="item-header">
                    <h4>${item.icon} ${item.name}</h4>
                    <div class="item-price">${item.price} 🪙</div>
                </div>
                <p class="item-description">${item.description}</p>
                <button class="buy-btn" ${!canAfford ? 'disabled' : ''} 
                        onclick="game.buyItem('${item.id}')">
                    ${canAfford ? 'Купить' : 'Недостаточно монет'}
                </button>
            `;
            container.appendChild(itemElement);
        });
    }
    
    buyItem(itemId) {
        const player = this.players.get(this.currentPlayerId);
        const item = this.shopItems.get(itemId);
        
        if (!item || player.coins < item.price) {
            return;
        }
        
        player.coins -= item.price;
        player.inventory.push({ ...item, purchaseDate: new Date() });
        
        this.addChatMessage('system', `${player.name} купил ${item.name} за ${item.price} 🪙`);
        
        // Обновляем интерфейс
        this.updateCurrentPlayerInfo();
        this.renderShopItems();
        
        this.saveGame();
    }
    
    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            const player = this.players.get(this.currentPlayerId);
            this.addChatMessage('player', `${player.name}: ${message}`);
            input.value = '';
        }
    }
    
    addChatMessage(type, message) {
        const container = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type === 'system' ? 'system-message' : ''}`;
        messageElement.textContent = message;
        
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
    }
    
    showVictoryScreen() {
        const player = this.players.get(this.currentPlayerId);
        
        document.getElementById('winner-name').textContent = player.name;
        document.getElementById('winner-profession').textContent = player.profession;
        document.getElementById('winner-skill').textContent = player.skill;
        document.getElementById('winner-stars').textContent = player.stars;
        document.getElementById('winner-coins').textContent = player.coins;
        document.getElementById('winner-avatar').textContent = player.avatar;
        
        // Создаем конфетти
        this.createConfetti();
        
        this.showScreen('victory-screen');
        this.gameState = 'finished';
    }
    
    createConfetti() {
        const container = document.querySelector('.confetti');
        container.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(confetti);
        }
    }
    
    restartGame() {
        GameStorage.clearGame();
        this.setupNewGame();
        this.showGameSetup();
    }
    
    joinGame(code) {
        // В реальном приложении здесь был бы запрос к серверу
        alert(`Присоединение к игре с кодом ${code}...`);
        // this.gameCode = code;
        // this.loadGameFromServer(code);
    }
    
    updateOnlineCount() {
        // В реальном приложении здесь были бы реальные данные
        document.getElementById('online-count').textContent = Math.floor(Math.random() * 100) + 50;
    }
    
    saveGame() {
        const gameData = {
            players: Array.from(this.players.entries()),
            currentPlayerId: this.currentPlayerId,
            gameState: this.gameState,
            gameBoard: this.gameBoard,
            gameCode: this.gameCode,
            maxPlayers: this.maxPlayers,
            currentTurn: this.currentTurn
        };
        
        GameStorage.saveGame(gameData);
    }
    
    loadGame(savedGame) {
        this.players = new Map(savedGame.players);
        this.currentPlayerId = savedGame.currentPlayerId;
        this.gameState = savedGame.gameState;
        this.gameBoard = savedGame.gameBoard;
        this.gameCode = savedGame.gameCode;
        this.maxPlayers = savedGame.maxPlayers;
        this.currentTurn = savedGame.currentTurn;
        
        if (this.gameState === 'playing') {
            this.showGameBoard();
        }
    }
    
    loadGameFromServer(code) {
        // Заглушка для загрузки игры с сервера
        console.log('Loading game from server with code:', code);
    }
}

// Вспомогательные функции
function updateOnlineCount() {
    // Обновление счетчика онлайн игроков
    setInterval(() => {
        const countElement = document.getElementById('online-count');
        if (countElement) {
            countElement.textContent = Math.floor(Math.random() * 50) + 100;
        }
    }, 10000);
}

// Инициализация игры при загрузке страницы
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new CosmicProfessionGame();
    updateOnlineCount();
});
