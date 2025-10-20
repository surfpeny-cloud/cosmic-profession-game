// СОЗДАЙТЕ НОВЫЙ ФАЙЛ game.js И СКОПИРУЙТЕ ВЕСЬ ЭТОТ КОД

// Основной игровой код
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loading';
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameMode = 'single';
        this.player = null;
        this.gameState = {
            currentPosition: 0,
            stars: 0,
            planets: [],
            currentPlanet: null,
            diceValue: 0,
            gameStarted: false,
            players: [],
            currentPlayerIndex: 0
        };
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация космической игры...');
        
        // Сначала настраиваем обработчики, потом загружаем данные
        this.setupEventListeners();
        this.loadGameData();
        
        // Показываем экран загрузки
        this.showScreen('loading');
        
        // Имитация загрузки
        setTimeout(() => {
            this.showScreen('mode');
        }, 2000);
    }

    loadGameData() {
        // Загружаем навыки и интересы
        this.populateSkills();
        this.populateInterests();
        
        // Создаем игровое поле
        this.gameState.planets = GameData.createGameBoard(15);
    }

    populateSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        GameData.skills.forEach(skill => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'skill-btn';
            button.textContent = skill;
            button.addEventListener('click', () => this.selectSkill(skill, button));
            container.appendChild(button);
        });
    }

    populateInterests() {
        const container = document.getElementById('interestsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        GameData.interests.forEach(interest => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'interest-btn';
            button.textContent = interest;
            button.addEventListener('click', () => this.selectInterest(interest, button));
            container.appendChild(button);
        });
    }

    selectSkill(skill, element) {
        document.querySelectorAll('.skill-btn').forEach(btn => btn.classList.remove('selected'));
        element.classList.add('selected');
        this.updateProfessionPreview();
    }

    selectInterest(interest, element) {
        document.querySelectorAll('.interest-btn').forEach(btn => btn.classList.remove('selected'));
        element.classList.add('selected');
        this.updateProfessionPreview();
    }

    updateProfessionPreview() {
        const skillBtn = document.querySelector('.skill-btn.selected');
        const interestBtn = document.querySelector('.interest-btn.selected');
        const professionDisplay = document.getElementById('professionDisplay');
        const startBtn = document.getElementById('startGameBtn');

        if (skillBtn && interestBtn && professionDisplay && startBtn) {
            const skill = skillBtn.textContent;
            const interest = interestBtn.textContent;
            const profession = GameData.generateProfession(skill, interest);
            professionDisplay.textContent = profession;
            startBtn.disabled = false;
        } else if (professionDisplay && startBtn) {
            professionDisplay.textContent = 'Космический ...';
            startBtn.disabled = true;
        }
    }

    setupEventListeners() {
        console.log('🔧 Настройка обработчиков событий...');
        
        // Обработчики для выбора режима
        this.setupModeSelection();
        
        // Обработчики для создания профиля
        this.setupProfileCreation();
        
        // Обработчики для мультиплеера
        this.setupMultiplayer();
        
        // Обработчики для игры
        this.setupGameControls();
        
        // Обработчики для магазина
        this.setupShop();
        
        // Обработчики для заданий
        this.setupMissions();
    }

    setupModeSelection() {
        const singlePlayerBtn = document.getElementById('singlePlayerBtn');
        const multiplayerBtn = document.getElementById('multiplayerBtn');
        
        if (singlePlayerBtn) {
            singlePlayerBtn.addEventListener('click', () => {
                console.log('🎮 Выбран одиночный режим');
                this.gameMode = 'single';
                this.showScreen('profile');
            });
        }

        if (multiplayerBtn) {
            multiplayerBtn.addEventListener('click', () => {
                console.log('👥 Выбран мультиплеер');
                this.gameMode = 'multiplayer';
                this.showScreen('players');
                this.initMultiplayer();
            });
        }
    }

    setupProfileCreation() {
        const startGameBtn = document.getElementById('startGameBtn');
        const playerNameInput = document.getElementById('playerName');
        
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                console.log('🚀 Запуск одиночной игры');
                this.createPlayerProfile();
                this.startSingleGame();
            });
        }

        if (playerNameInput) {
            playerNameInput.addEventListener('input', () => {
                this.updateProfessionPreview();
            });
        }
    }

    setupMultiplayer() {
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        const startMultiplayerBtn = document.getElementById('startMultiplayerBtn');
        
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                console.log('➕ Добавление игрока');
                this.addPlayer();
            });
        }

        if (startMultiplayerBtn) {
            startMultiplayerBtn.addEventListener('click', () => {
                console.log('🎮 Запуск мультиплеера');
                this.startMultiplayerGame();
            });
        }
    }

    setupGameControls() {
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        const shopBtn = document.getElementById('shopBtn');
        const backToGameBtn = document.getElementById('backToGameBtn');
        const continueBtn = document.getElementById('continueBtn');
        const restartGame = document.getElementById('restartGame');
        
        if (rollDiceBtn) {
            rollDiceBtn.addEventListener('click', () => {
                console.log('🎲 Бросок кубика');
                this.rollDice();
            });
        }

        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                console.log('🛍️ Открытие магазина');
                this.openShop();
            });
        }

        if (backToGameBtn) {
            backToGameBtn.addEventListener('click', () => {
                console.log('↩️ Возврат в игру');
                this.showScreen('game');
            });
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                console.log('➡️ Продолжить игру');
                this.continueGame();
            });
        }

        if (restartGame) {
            restartGame.addEventListener('click', () => {
                console.log('🔄 Перезапуск игры');
                this.restartGame();
            });
        }
    }

    setupShop() {
        // Обработчики для категорий магазина
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                console.log('🏪 Выбрана категория:', category);
                this.selectShopCategory(category);
            });
        });
    }

    setupMissions() {
        const submitSolution = document.getElementById('submitSolution');
        const startPresentation = document.getElementById('startPresentation');
        const submitHelp = document.getElementById('submitHelp');
        
        if (submitSolution) {
            submitSolution.addEventListener('click', () => {
                console.log('📝 Отправка решения');
                this.submitSolution();
            });
        }

        if (startPresentation) {
            startPresentation.addEventListener('click', () => {
                console.log('🎤 Начало презентации');
                this.startPresentation();
            });
        }

        if (submitHelp) {
            submitHelp.addEventListener('click', () => {
                console.log('🤝 Отправка помощи');
                this.submitHelp();
            });
        }
    }

    // Мультиплеер функции
    initMultiplayer() {
        this.players = [];
        this.renderPlayersList();
    }

    addPlayer() {
        if (this.players.length >= 4) {
            alert('Максимум 4 игрока!');
            return;
        }

        const playerId = this.players.length + 1;
        const avatar = GameData.avatars[this.players.length % GameData.avatars.length];
        const color = GameData.playerColors[this.players.length % GameData.playerColors.length];
        
        const newPlayer = {
            id: playerId,
            name: `Игрок ${playerId}`,
            avatar: avatar,
            color: color,
            skill: '',
            interest: '',
            profession: '',
            stars: 0,
            position: 0,
            inventory: [],
            skills: [],
            boosters: []
        };

        this.players.push(newPlayer);
        this.renderPlayersList();
        this.updateStartButton();
    }

    renderPlayersList() {
        const container = document.getElementById('playersListContainer');
        if (!container) return;

        container.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-avatar" style="background: ${player.color}">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}</div>
                    <div class="player-profession">${player.profession || 'Профессия не выбрана'}</div>
                </div>
                <div class="player-controls">
                    <button class="btn-small btn-edit" data-index="${index}">✏️</button>
                    <button class="btn-small btn-delete" data-index="${index}">🗑️</button>
                </div>
            `;
            container.appendChild(playerCard);
        });

        // Добавляем обработчики для кнопок редактирования и удаления
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.editPlayer(index);
            });
        });

        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removePlayer(index);
            });
        });
    }

    editPlayer(index) {
        const player = this.players[index];
        const newName = prompt('Введите имя игрока:', player.name);
        if (newName) {
            player.name = newName;
            this.renderPlayersList();
        }
    }

    removePlayer(index) {
        this.players.splice(index, 1);
        this.renderPlayersList();
        this.updateStartButton();
    }

    updateStartButton() {
        const startBtn = document.getElementById('startMultiplayerBtn');
        if (!startBtn) return;

        const allPlayersReady = this.players.length >= 2;
        startBtn.disabled = !allPlayersReady;
        
        if (allPlayersReady) {
            startBtn.textContent = `Начать игру (${this.players.length} игрока)`;
        } else {
            startBtn.textContent = 'Начать игру';
        }
    }

    createPlayerProfile() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput ? nameInput.value || 'Космонавт' : 'Космонавт';
        const skill = document.querySelector('.skill-btn.selected')?.textContent || 'Творчество';
        const interest = document.querySelector('.interest-btn.selected')?.textContent || 'Космос';
        
        this.player = {
            name: name,
            skill: skill,
            interest: interest,
            profession: GameData.generateProfession(skill, interest),
            stars: 0,
            position: 0,
            inventory: [],
            skills: [],
            boosters: [],
            color: '#3b82f6',
            avatar: '👨‍🚀'
        };
    }

    startSingleGame() {
        console.log('🚀 Запуск одиночной игры для:', this.player.name);
        
        this.gameState = {
            players: [this.player],
            currentPlayerIndex: 0,
            planets: GameData.createGameBoard(15),
            gameStarted: true,
            diceValue: 0
        };

        this.showScreen('game');
        this.updateGameUI();
        this.renderGameBoard();
        this.renderMiniPlayers();
        
        this.playBackgroundMusic();
    }

    startMultiplayerGame() {
        console.log('👥 Запуск мультиплеера с', this.players.length, 'игроками');
        
        // Назначаем случайные профессии игрокам
        this.players.forEach(player => {
            if (!player.profession) {
                const skill = GameData.skills[Math.floor(Math.random() * GameData.skills.length)];
                const interest = GameData.interests[Math.floor(Math.random() * GameData.interests.length)];
                player.profession = GameData.generateProfession(skill, interest);
                player.skill = skill;
                player.interest = interest;
            }
        });

        this.gameState = {
            players: [...this.players],
            currentPlayerIndex: 0,
            planets: GameData.createGameBoard(15),
            gameStarted: true,
            diceValue: 0
        };

        this.showScreen('game');
        this.updateGameUI();
        this.renderGameBoard();
        this.renderMiniPlayers();
        
        this.playBackgroundMusic();
    }

    updateGameUI() {
        const currentPlayer = this.getCurrentPlayer();
        const currentPlayerName = document.getElementById('currentPlayerName');
        const currentProfession = document.getElementById('currentProfession');
        const starCount = document.getElementById('starCount');

        if (currentPlayerName) currentPlayerName.textContent = currentPlayer.name;
        if (currentProfession) currentProfession.textContent = currentPlayer.profession;
        if (starCount) starCount.textContent = currentPlayer.stars;
    }

    renderGameBoard() {
        const track = document.getElementById('planetsTrack');
        if (!track) return;

        track.innerHTML = '';
        
        this.gameState.planets.forEach(planet => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.setAttribute('data-planet-id', planet.id);
            planetElement.innerHTML = this.getPlanetEmoji(planet.type);
            
            const label = document.createElement('div');
            label.className = 'planet-label';
            label.textContent = planet.name;
            
            planetElement.appendChild(label);
            track.appendChild(planetElement);
        });

        this.updateRocketPosition();
    }

    getPlanetEmoji(type) {
        const emojis = {
            blue: '🔵',
            red: '🔴',
            green: '🟢',
            yellow: '🟡'
        };
        return emojis[type] || '🌍';
    }

    renderMiniPlayers() {
        const container = document.getElementById('playersMini');
        if (!container) return;

        container.innerHTML = '';

        this.gameState.players.forEach((player, index) => {
            const isActive = index === this.gameState.currentPlayerIndex;
            const card = document.createElement('div');
            card.className = `player-mini-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <div class="player-mini-avatar" style="background: ${player.color || '#3b82f6'}">${player.avatar || '👤'}</div>
                <div class="player-mini-info">
                    <div class="player-mini-name">${player.name}</div>
                    <div class="player-mini-stars">⭐ ${player.stars}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Функции магазина
    openShop() {
        console.log('🛍️ Открытие магазина');
        this.showScreen('shop');
        this.updateShopBalance();
        this.selectShopCategory('skills');
    }

    selectShopCategory(category) {
        console.log('📁 Выбор категории магазина:', category);
        
        // Обновляем активную кнопку категории
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const categoryBtn = document.querySelector(`[data-category="${category}"]`);
        if (categoryBtn) {
            categoryBtn.classList.add('active');
        }

        // Показываем товары категории
        this.renderShopItems(category);
    }

    renderShopItems(category) {
        const container = document.getElementById('shopItems');
        if (!container) return;

        const items = GameData.shopItems[category];
        const currentPlayer = this.getCurrentPlayer();

        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="no-items">Товары временно отсутствуют</div>';
            return;
        }

        items.forEach(item => {
            const owned = currentPlayer.skills.includes(item.id) || 
                         currentPlayer.inventory.some(inv => inv.id === item.id);
            const canAfford = currentPlayer.stars >= item.price;
            
            const itemElement = document.createElement('div');
            itemElement.className = `shop-item ${owned ? 'owned' : ''} ${!canAfford && !owned ? 'cannot-afford' : ''}`;
            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">
                    <span class="price">${item.price} ⭐</span>
                    <button class="btn-buy ${owned ? 'owned' : ''}" 
                            data-item-id="${item.id}" 
                            data-category="${category}"
                            ${owned || !canAfford ? 'disabled' : ''}>
                        ${owned ? 'Куплено' : 'Купить'}
                    </button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        // Добавляем обработчики для кнопок покупки
        container.querySelectorAll('.btn-buy:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const category = e.target.dataset.category;
                this.buyItem(itemId, category);
            });
        });
    }

    buyItem(itemId, category) {
        console.log('🛒 Покупка товара:', itemId);
        
        const currentPlayer = this.getCurrentPlayer();
        const item = GameData.shopItems[category].find(i => i.id === itemId);

        if (!item) {
            console.error('Товар не найден:', itemId);
            return;
        }

        if (currentPlayer.stars >= item.price) {
            currentPlayer.stars -= item.price;

            if (item.type === 'skill') {
                currentPlayer.skills.push(itemId);
                console.log('✅ Навык приобретен:', item.name);
            } else if (item.type === 'item') {
                currentPlayer.inventory.push({
                    id: itemId,
                    ...item
                });
                console.log('✅ Предмет приобретен:', item.name);
            } else if (item.type === 'booster') {
                currentPlayer.boosters.push({
                    id: itemId,
                    ...item,
                    remainingTurns: item.duration
                });
                console.log('✅ Бустер приобретен:', item.name);
            }

            this.updateShopBalance();
            this.renderShopItems(category);
            this.showPurchaseSuccess(item.name);
        } else {
            console.log('❌ Недостаточно звезд для покупки');
        }
    }

    updateShopBalance() {
        const currentPlayer = this.getCurrentPlayer();
        const shopBalance = document.getElementById('shopBalance');
        if (shopBalance) {
            shopBalance.textContent = currentPlayer.stars;
        }
    }

    getCurrentPlayer() {
        if (this.gameMode === 'single') {
            return this.player;
        } else {
            return this.gameState.players[this.gameState.currentPlayerIndex];
        }
    }

    showPurchaseSuccess(itemName) {
        alert(`🎉 Поздравляем! Вы купили "${itemName}"!`);
    }

    // Игровые функции
    rollDice() {
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
        if (!diceBtn || !diceResult) return;
        
        console.log('🎲 Бросок кубика...');
        
        // Блокируем кнопку на время анимации
        diceBtn.disabled = true;
        
        // Анимация броска
        let rolls = 0;
        const maxRolls = 10;
        const rollInterval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = randomValue;
            rolls++;
            
            if (rolls >= maxRolls) {
                clearInterval(rollInterval);
                let finalValue = Math.floor(Math.random() * 6) + 1;
                
                // Проверяем улучшения игрока
                const currentPlayer = this.getCurrentPlayer();
                if (currentPlayer.skills.includes('extra_dice')) {
                    const secondValue = Math.floor(Math.random() * 6) + 1;
                    finalValue = Math.max(finalValue, secondValue);
                    diceResult.textContent = `${finalValue} (из ${finalValue},${secondValue})`;
                }
                
                if (currentPlayer.boosters.some(b => b.id === 'lucky_charm')) {
                    if (Math.random() < 0.3) {
                        finalValue = 6;
                        diceResult.textContent = `${finalValue} 🍀`;
                    }
                }
                
                this.gameState.diceValue = finalValue;
                this.playSound('diceSound');
                
                console.log('🎲 Выпало:', finalValue);
                setTimeout(() => this.movePlayer(), 1000);
            }
        }, 100);
    }

    movePlayer() {
        const currentPlayer = this.getCurrentPlayer();
        const newPosition = currentPlayer.position + this.gameState.diceValue;
        const maxPosition = this.gameState.planets.length;

        console.log(`📍 Перемещение игрока ${currentPlayer.name} с ${currentPlayer.position} на ${newPosition}`);

        if (newPosition >= maxPosition) {
            currentPlayer.position = maxPosition - 1;
            this.checkWinCondition();
        } else {
            currentPlayer.position = newPosition;
            this.updateRocketPosition();
            setTimeout(() => this.activatePlanet(), 1000);
        }
    }

    updateRocketPosition() {
        const currentPlayer = this.getCurrentPlayer();
        const rocket = document.getElementById('playerRocket');
        const track = document.getElementById('planetsTrack');
        
        if (!rocket || !track) return;
        
        const planets = track.querySelectorAll('.planet');
        
        if (planets[currentPlayer.position]) {
            const planetRect = planets[currentPlayer.position].getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            
            const position = planetRect.left - trackRect.left + planetRect.width / 2;
            rocket.style.left = position + 'px';
        }
    }

    activatePlanet() {
        const currentPlayer = this.getCurrentPlayer();
        const currentPlanet = this.gameState.planets[currentPlayer.position];
        
        console.log(`🌍 Активация планеты: ${currentPlanet.name} (${currentPlanet.type})`);
        
        this.gameState.currentPlanet = currentPlanet;
        this.showMissionScreen(currentPlanet);
    }

    showMissionScreen(planet) {
        this.showScreen('mission');
        
        // Обновляем информацию о планете
        const missionPlanetName = document.getElementById('missionPlanetName');
        const missionPlanetIcon = document.getElementById('missionPlanetIcon');
        const missionProfession = document.getElementById('missionProfession');
        
        if (missionPlanetName) missionPlanetName.textContent = planet.name;
        if (missionPlanetIcon) missionPlanetIcon.textContent = this.getPlanetEmoji(planet.type);
        if (missionProfession) missionProfession.textContent = this.getCurrentPlayer().profession;
        
        // Настраиваем задание в зависимости от типа планеты
        this.setupMission(planet.type);
    }

    setupMission(planetType) {
        const missionType = document.getElementById('missionType');
        const missionText = document.getElementById('missionText');
        const missionInput = document.getElementById('missionInput');
        const convincePlayers = document.getElementById('convincePlayers');
        const helpOthers = document.getElementById('helpOthers');
        
        if (!missionType || !missionText) return;
        
        // Скрываем все типы заданий
        if (missionInput) missionInput.style.display = 'none';
        if (convincePlayers) convincePlayers.style.display = 'none';
        if (helpOthers) helpOthers.style.display = 'none';
        
        // Сбрасываем поля ввода
        const solutionInput = document.getElementById('solutionInput');
        const helpText = document.getElementById('helpText');
        if (solutionInput) solutionInput.value = '';
        if (helpText) helpText.value = '';
        
        switch(planetType) {
            case 'blue': // Космическая задача
                missionType.textContent = 'Космическая задача';
                missionType.style.background = 'rgba(59, 130, 246, 0.3)';
                missionText.textContent = GameData.getRandomProblem();
                if (missionInput) missionInput.style.display = 'block';
                this.startTimer(120);
                break;
                
            case 'red': // Доказательство полезности
                missionType.textContent = 'Доказательство полезности';
                missionType.style.background = 'rgba(239, 68, 68, 0.3)';
                missionText.textContent = 'Объясни, почему твоя профессия полезна для космонавтов!';
                if (convincePlayers) convincePlayers.style.display = 'block';
                this.setupPlayersList();
                break;
                
            case 'green': // Помощь другим
                missionType.textContent = 'Помощь другим';
                missionType.style.background = 'rgba(16, 185, 129, 0.3)';
                missionText.textContent = 'Помоги другому игроку с его заданием!';
                if (helpOthers) helpOthers.style.display = 'block';
                this.setupHelpPlayers();
                break;
                
            case 'yellow': // Космическое событие
                missionType.textContent = 'Космическое событие';
                missionType.style.background = 'rgba(245, 158, 11, 0.3)';
                const event = GameData.getRandomEvent();
                missionText.textContent = `${event.title}\n\n${event.description}`;
                this.handleEvent(event);
                break;
        }
    }

    startTimer(seconds) {
        const timerElement = document.getElementById('missionTimer');
        if (!timerElement) return;

        // Останавливаем предыдущий таймер, если есть
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }

        let timeLeft = seconds;
        
        this.currentTimer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(this.currentTimer);
                this.submitSolution();
            }
            
            timeLeft--;
        }, 1000);
    }

    setupPlayersList() {
        const playersList = document.getElementById('playersList');
        if (!playersList) return;

        playersList.innerHTML = `
            <div class="player-item">👨‍🚀 Космонавт Алексей</div>
            <div class="player-item">👩‍🚀 Космонавт Мария</div>
            <div class="player-item">👨‍🚀 Космонавт Иван</div>
        `;
    }

    setupHelpPlayers() {
        const select = document.getElementById('playerToHelp');
        if (!select) return;

        select.innerHTML = `
            <option value="1">👨‍🚀 Космонавт Алексей - "Сломался компьютер"</option>
            <option value="2">👩‍🚀 Космонавт Мария - "Грустные инопланетяне"</option>
            <option value="3">👨‍🚀 Космонавт Иван - "Потерялась карта"</option>
        `;
    }

    handleEvent(event) {
        console.log('⚡ Космическое событие:', event.title);
        
        setTimeout(() => {
            let starsEarned = 0;
            let message = '';
            
            switch(event.type) {
                case 'positive':
                    starsEarned = event.title.includes('+3') ? 3 : event.title.includes('+2') ? 2 : 1;
                    message = `Ты получаешь ${starsEarned} звезду(ы) за ${event.title.toLowerCase()}`;
                    break;
                    
                case 'challenge':
                    if (event.effect.includes('Пропуск хода')) {
                        message = 'Ты пропускаешь ход, но придумал новое применение своей профессии! +1 звезда';
                        starsEarned = 1;
                    } else if (event.effect.includes('Откат')) {
                        const currentPlayer = this.getCurrentPlayer();
                        currentPlayer.position = Math.max(0, currentPlayer.position - 2);
                        this.updateRocketPosition();
                        message = 'Космический ветер отбросил тебя на 2 планеты назад!';
                    }
                    break;
            }
            
            if (starsEarned > 0) {
                const currentPlayer = this.getCurrentPlayer();
                currentPlayer.stars += starsEarned;
                this.showResult(starsEarned, message);
            } else {
                this.nextPlayer();
            }
        }, 3000);
    }

    submitSolution() {
        const solutionInput = document.getElementById('solutionInput');
        const solution = solutionInput ? solutionInput.value : '';
        
        if (!solution.trim()) {
            alert('Опиши своё решение!');
            return;
        }
        
        // Останавливаем таймер
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }
        
        const starsEarned = this.evaluateSolution(solution);
        const message = this.getFeedback(starsEarned);
        
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    startPresentation() {
        const starsEarned = 2;
        const message = 'Ты убедительно доказал полезность своей профессии!';
        
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    submitHelp() {
        const helpText = document.getElementById('helpText');
        const text = helpText ? helpText.value : '';
        
        if (!text.trim()) {
            alert('Опиши, чем ты можешь помочь!');
            return;
        }
        
        const starsEarned = 1;
        const message = 'Спасибо за помощь другому космонавту!';
        
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    evaluateSolution(solution) {
        const lengthScore = Math.min(solution.length / 50, 2);
        const complexityBonus = solution.includes('!') || solution.includes('?') ? 0.5 : 0;
        
        let baseStars = Math.min(Math.floor(lengthScore + complexityBonus), 3);
        
        // Применяем бустеры
        const currentPlayer = this.getCurrentPlayer();
        if (currentPlayer.boosters.some(b => b.id === 'double_stars')) {
            baseStars *= 2;
        }

        if (currentPlayer.boosters.some(b => b.id === 'inspiration')) {
            baseStars += 1;
        }

        return Math.min(baseStars, 3);
    }

    getFeedback(stars) {
        const feedbacks = {
            1: 'Хорошая идея! Ты получаешь 1 звезду.',
            2: 'Отличное решение! Ты получаешь 2 звезды.',
            3: 'Блестящая идея! Ты получаешь 3 звезды!'
        };
        return feedbacks[stars] || 'Спасибо за участие!';
    }

    showResult(starsEarned, message) {
        this.showScreen('result');
        
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const resultText = document.getElementById('resultText');
        const starsEarnedElement = document.getElementById('starsEarned');
        
        if (resultIcon) resultIcon.textContent = '⭐'.repeat(Math.min(starsEarned, 3));
        if (resultTitle) resultTitle.textContent = starsEarned > 0 ? 'Успех!' : 'Событие';
        if (resultText) resultText.textContent = message;
        if (starsEarnedElement) starsEarnedElement.textContent = starsEarned > 0 ? `+${starsEarned} ⭐` : '';
        
        this.updateGameUI();
        this.renderMiniPlayers();
    }

    continueGame() {
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        if (rollDiceBtn) rollDiceBtn.disabled = false;
        
        this.nextPlayer();
    }

    nextPlayer() {
        if (this.gameMode === 'multiplayer') {
            this.gameState.currentPlayerIndex = 
                (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
            
            this.updateGameUI();
            this.renderMiniPlayers();
            
            this.updateBoosters();
        }
        
        this.showScreen('game');
    }

    updateBoosters() {
        const currentPlayer = this.getCurrentPlayer();
        
        currentPlayer.boosters = currentPlayer.boosters.filter(booster => {
            booster.remainingTurns--;
            return booster.remainingTurns > 0;
        });
    }

    checkWinCondition() {
        const currentPlayer = this.getCurrentPlayer();
        
        if (currentPlayer.stars >= 10) {
            this.showWinScreen(currentPlayer);
        } else {
            this.nextPlayer();
        }
    }

    showWinScreen(winner) {
        console.log('🎉 Победа игрока:', winner.name);
        this.playSound('winSound');
        this.showScreen('win');
        
        const winnerName = document.getElementById('winnerName');
        const winnerProfession = document.getElementById('winnerProfession');
        
        if (winnerName) winnerName.textContent = winner.name;
        if (winnerProfession) winnerProfession.textContent = winner.profession;
    }

    restartGame() {
        console.log('🔄 Перезапуск игры');
        
        if (this.gameMode === 'single') {
            this.showScreen('profile');
        } else {
            this.showScreen('players');
            this.initMultiplayer();
        }
    }

    showScreen(screenName) {
        console.log('🖥️ Переключение на экран:', screenName);
        
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        const screenElement = document.getElementById(screenName + 'Screen');
        if (screenElement) {
            screenElement.classList.add('active');
            this.currentScreen = screenName;
        } else {
            console.error('Экран не найден:', screenName + 'Screen');
        }
    }

    playBackgroundMusic() {
        const music = document.getElementById('backgroundMusic');
        if (music) {
            music.volume = 0.3;
            music.play().catch(e => console.log('Автовоспроизведение музыки заблокировано'));
        }
    }

    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.volume = 0.5;
            sound.play().catch(e => console.log('Не удалось воспроизвести звук'));
        }
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Запускаем космическую игру...');
    window.game = new CosmicProfessionGame();
});
