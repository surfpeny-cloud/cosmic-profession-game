// СОЗДАЙТЕ НОВЫЙ ФАЙЛ game.js И СКОПИРУЙТЕ ВЕСЬ ЭТОТ КОД

// Основной игровой код
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loading';
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameMode = 'single'; // 'single' или 'multiplayer'
        this.shopItems = {};
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
        console.log('🚀 Инициализация космической игры с мультиплеером...');
        
        // Инициализация данных
        this.loadGameData();
        
        // Показываем экран загрузки
        this.showScreen('loading');
        
        // Имитация загрузки
        setTimeout(() => {
            this.showScreen('mode');
            this.setupEventListeners();
        }, 3000);
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
        // Кнопка начала игры (одиночный режим)
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                this.createPlayerProfile();
                this.startSingleGame();
            });
        }

        // Кнопки выбора режима
        const singlePlayerBtn = document.getElementById('singlePlayerBtn');
        const multiplayerBtn = document.getElementById('multiplayerBtn');
        
        if (singlePlayerBtn) {
            singlePlayerBtn.addEventListener('click', () => {
                this.gameMode = 'single';
                this.showScreen('profile');
            });
        }

        if (multiplayerBtn) {
            multiplayerBtn.addEventListener('click', () => {
                this.gameMode = 'multiplayer';
                this.showScreen('players');
                this.initMultiplayer();
            });
        }

        // Кнопки мультиплеера
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        const startMultiplayerBtn = document.getElementById('startMultiplayerBtn');
        
        if (addPlayerBtn) {
            addPlayerBtn.addEventListener('click', () => {
                this.addPlayer();
            });
        }

        if (startMultiplayerBtn) {
            startMultiplayerBtn.addEventListener('click', () => {
                this.startMultiplayerGame();
            });
        }

        // Кнопка магазина
        const shopBtn = document.getElementById('shopBtn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.openShop();
            });
        }

        // Кнопка возврата из магазина
        const backToGameBtn = document.getElementById('backToGameBtn');
        if (backToGameBtn) {
            backToGameBtn.addEventListener('click', () => {
                this.showScreen('game');
            });
        }

        // Кнопка броска кубика
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        if (rollDiceBtn) {
            rollDiceBtn.addEventListener('click', () => {
                this.rollDice();
            });
        }

        // Кнопки для заданий
        const submitSolution = document.getElementById('submitSolution');
        if (submitSolution) {
            submitSolution.addEventListener('click', () => {
                this.submitSolution();
            });
        }

        const startPresentation = document.getElementById('startPresentation');
        if (startPresentation) {
            startPresentation.addEventListener('click', () => {
                this.startPresentation();
            });
        }

        const submitHelp = document.getElementById('submitHelp');
        if (submitHelp) {
            submitHelp.addEventListener('click', () => {
                this.submitHelp();
            });
        }

        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.continueGame();
            });
        }

        const restartGame = document.getElementById('restartGame');
        if (restartGame) {
            restartGame.addEventListener('click', () => {
                this.restartGame();
            });
        }

        // Обработчики для магазина
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectShopCategory(e.target.dataset.category);
            });
        });
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
            boosters: []
        };
    }

    startSingleGame() {
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
        
        // Проигрываем фоновую музыку
        this.playBackgroundMusic();
    }

    startMultiplayerGame() {
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
        this.showScreen('shop');
        this.updateShopBalance();
        this.selectShopCategory('skills');
    }

    selectShopCategory(category) {
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
        container.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const category = e.target.dataset.category;
                this.buyItem(itemId, category);
            });
        });
    }

    buyItem(itemId, category) {
        const currentPlayer = this.getCurrentPlayer();
        const item = GameData.shopItems[category].find(i => i.id === itemId);

        if (!item) return;

        if (currentPlayer.stars >= item.price) {
            currentPlayer.stars -= item.price;

            if (item.type === 'skill') {
                currentPlayer.skills.push(itemId);
            } else if (item.type === 'item') {
                currentPlayer.inventory.push({
                    id: itemId,
                    ...item
                });
            } else if (item.type === 'booster') {
                currentPlayer.boosters.push({
                    id: itemId,
                    ...item,
                    remainingTurns: item.duration
                });
            }

            this.updateShopBalance();
            this.renderShopItems(category);
            this.showPurchaseSuccess(item.name);
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
        alert(`Поздравляем! Вы купили "${itemName}"!`);
    }

    // Игровые функции
    rollDice() {
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
        if (!diceBtn || !diceResult) return;
        
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
                    // Увеличиваем шанс выпадения 6
                    if (Math.random() < 0.3) {
                        finalValue = 6;
                        diceResult.textContent = `${finalValue} 🍀`;
                    }
                }
                
                this.gameState.diceValue = finalValue;
                this.playSound('diceSound');
                
                setTimeout(() => this.movePlayer(), 1000);
            }
        }, 100);
    }

    movePlayer() {
        const currentPlayer = this.getCurrentPlayer();
        const newPosition = currentPlayer.position + this.gameState.diceValue;
        const maxPosition = this.gameState.planets.length;

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
        
        switch(planetType) {
            case 'blue': // Космическая задача
                missionType.textContent = 'Космическая задача';
                missionType.style.background = 'rgba(59, 130, 246, 0.3)';
                missionText.textContent = GameData.getRandomProblem();
                if (missionInput) missionInput.style.display = 'block';
                this.startTimer(120); // 2 минуты
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

        let timeLeft = seconds;
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.submitSolution(); // Автоматическая отправка при окончании времени
            }
            
            timeLeft--;
        }, 1000);
        
        this.currentTimer = timer;
    }

    setupPlayersList() {
        // В реальной игре здесь был бы список других игроков
        const playersList = document.getElementById('playersList');
        if (!playersList) return;

        playersList.innerHTML = `
            <div class="player-item">👨‍🚀 Космонавт Алексей</div>
            <div class="player-item">👩‍🚀 Космонавт Мария</div>
            <div class="player-item">👨‍🚀 Космонавт Иван</div>
        `;
    }

    setupHelpPlayers() {
        // В реальной игре здесь был бы список игроков, которым нужна помощь
        const select = document.getElementById('playerToHelp');
        if (!select) return;

        select.innerHTML = `
            <option value="1">👨‍🚀 Космонавт Алексей - "Сломался компьютер"</option>
            <option value="2">👩‍🚀 Космонавт Мария - "Грустные инопланетяне"</option>
            <option value="3">👨‍🚀 Космонавт Иван - "Потерялась карта"</option>
        `;
    }

    handleEvent(event) {
        // Обработка космических событий
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
        
        // Оцениваем решение
        const starsEarned = this.evaluateSolution(solution);
        const message = this.getFeedback(starsEarned);
        
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    startPresentation() {
        const starsEarned = 2; // За презентацию всегда 2 звезды
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
        
        const starsEarned = 1; // За помощь всегда 1 звезда
        const message = 'Спасибо за помощь другому космонавту!';
        
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    evaluateSolution(solution) {
        // Простая система оценки на основе длины и сложности решения
        const lengthScore = Math.min(solution.length / 50, 2); // Макс 2 звезды за длину
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

        return Math.min(baseStars, 3); // Максимум 3 звезды
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
        
        // Обновляем счетчик звезд
        this.updateGameUI();
        this.renderMiniPlayers();
    }

    continueGame() {
        // Разблокируем кнопку броска кубика
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
            
            // Обновляем бустеры
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
        this.playSound('winSound');
        this.showScreen('win');
        
        const winnerName = document.getElementById('winnerName');
        const winnerProfession = document.getElementById('winnerProfession');
        
        if (winnerName) winnerName.textContent = winner.name;
        if (winnerProfession) winnerProfession.textContent = winner.profession;
    }

    restartGame() {
        if (this.gameMode === 'single') {
            this.showScreen('profile');
        } else {
            this.showScreen('players');
            this.initMultiplayer();
        }
    }

    showScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        const screenElement = document.getElementById(screenName + 'Screen');
        if (screenElement) {
            screenElement.classList.add('active');
        }
        this.currentScreen = screenName;
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
    console.log('🎮 Запускаем космическую игру с мультиплеером...');
    window.game = new CosmicProfessionGame();
});
