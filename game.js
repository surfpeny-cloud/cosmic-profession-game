// Основной игровой код
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loading';
        this.player = null;
        this.gameState = {
            currentPosition: 0,
            stars: 0,
            planets: [],
            currentPlanet: null,
            diceValue: 0,
            gameStarted: false
        };
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация космической игры...');
        
        // Инициализация данных
        this.loadGameData();
        
        // Показываем экран загрузки
        this.showScreen('loading');
        
        // Имитация загрузки
        setTimeout(() => {
            this.showScreen('profile');
            this.setupEventListeners();
        }, 3000);
    }

    loadGameData() {
        // Загружаем навыки и интересы
        this.populateSkills();
        this.populateInterests();
        
        // Создаем игровое поле
        this.gameState.planets = GameData.createGameBoard(15);
        this.renderGameBoard();
    }

    populateSkills() {
        const container = document.getElementById('skillsContainer');
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

        if (skillBtn && interestBtn) {
            const skill = skillBtn.textContent;
            const interest = interestBtn.textContent;
            const profession = GameData.generateProfession(skill, interest);
            professionDisplay.textContent = profession;
            startBtn.disabled = false;
        } else {
            professionDisplay.textContent = 'Космический ...';
            startBtn.disabled = true;
        }
    }

    setupEventListeners() {
        // Кнопка начала игры
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.createPlayerProfile();
            this.startGame();
        });

        // Кнопка броска кубика
        document.getElementById('rollDiceBtn').addEventListener('click', () => {
            this.rollDice();
        });

        // Кнопки для заданий
        document.getElementById('submitSolution').addEventListener('click', () => {
            this.submitSolution();
        });

        document.getElementById('startPresentation').addEventListener('click', () => {
            this.startPresentation();
        });

        document.getElementById('submitHelp').addEventListener('click', () => {
            this.submitHelp();
        });

        document.getElementById('continueBtn').addEventListener('click', () => {
            this.continueGame();
        });

        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });
    }

    createPlayerProfile() {
        const name = document.getElementById('playerName').value || 'Космонавт';
        const skill = document.querySelector('.skill-btn.selected')?.textContent || 'Творчество';
        const interest = document.querySelector('.interest-btn.selected')?.textContent || 'Космос';
        
        this.player = {
            name: name,
            skill: skill,
            interest: interest,
            profession: GameData.generateProfession(skill, interest)
        };
    }

    startGame() {
        this.showScreen('game');
        this.updatePlayerInfo();
        this.gameState.gameStarted = true;
        
        // Проигрываем фоновую музыку
        this.playBackgroundMusic();
    }

    updatePlayerInfo() {
        document.getElementById('currentPlayerName').textContent = this.player.name;
        document.getElementById('currentProfession').textContent = this.player.profession;
        document.getElementById('starCount').textContent = this.gameState.stars;
    }

    renderGameBoard() {
        const track = document.getElementById('planetsTrack');
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

    rollDice() {
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
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
                const finalValue = Math.floor(Math.random() * 6) + 1;
                this.gameState.diceValue = finalValue;
                diceResult.textContent = finalValue;
                
                // Проигрываем звук
                this.playSound('diceSound');
                
                // Перемещаем игрока
                setTimeout(() => this.movePlayer(), 1000);
            }
        }, 100);
    }

    movePlayer() {
        const newPosition = this.gameState.currentPosition + this.gameState.diceValue;
        const maxPosition = this.gameState.planets.length;
        
        if (newPosition >= maxPosition) {
            this.gameState.currentPosition = maxPosition - 1;
            this.completeGame();
        } else {
            this.gameState.currentPosition = newPosition;
            this.updateRocketPosition();
            
            // Активируем планету
            setTimeout(() => this.activatePlanet(), 1000);
        }
    }

    updateRocketPosition() {
        const rocket = document.getElementById('playerRocket');
        const track = document.getElementById('planetsTrack');
        const planets = track.querySelectorAll('.planet');
        
        if (planets[this.gameState.currentPosition]) {
            const planetRect = planets[this.gameState.currentPosition].getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            
            const position = planetRect.left - trackRect.left + planetRect.width / 2;
            rocket.style.left = position + 'px';
        }
    }

    activatePlanet() {
        const currentPlanet = this.gameState.planets[this.gameState.currentPosition];
        this.gameState.currentPlanet = currentPlanet;
        
        this.showMissionScreen(currentPlanet);
    }

    showMissionScreen(planet) {
        this.showScreen('mission');
        
        // Обновляем информацию о планете
        document.getElementById('missionPlanetName').textContent = planet.name;
        document.getElementById('missionPlanetIcon').textContent = this.getPlanetEmoji(planet.type);
        document.getElementById('missionProfession').textContent = this.player.profession;
        
        // Настраиваем задание в зависимости от типа планеты
        this.setupMission(planet.type);
    }

    setupMission(planetType) {
        const missionType = document.getElementById('missionType');
        const missionText = document.getElementById('missionText');
        const missionInput = document.getElementById('missionInput');
        const convincePlayers = document.getElementById('convincePlayers');
        const helpOthers = document.getElementById('helpOthers');
        
        // Скрываем все типы заданий
        missionInput.style.display = 'none';
        convincePlayers.style.display = 'none';
        helpOthers.style.display = 'none';
        
        switch(planetType) {
            case 'blue': // Космическая задача
                missionType.textContent = 'Космическая задача';
                missionType.style.background = 'rgba(59, 130, 246, 0.3)';
                missionText.textContent = GameData.getRandomProblem();
                missionInput.style.display = 'block';
                this.startTimer(120); // 2 минуты
                break;
                
            case 'red': // Доказательство полезности
                missionType.textContent = 'Доказательство полезности';
                missionType.style.background = 'rgba(239, 68, 68, 0.3)';
                missionText.textContent = 'Объясни, почему твоя профессия полезна для космонавтов!';
                convincePlayers.style.display = 'block';
                this.setupPlayersList();
                break;
                
            case 'green': // Помощь другим
                missionType.textContent = 'Помощь другим';
                missionType.style.background = 'rgba(16, 185, 129, 0.3)';
                missionText.textContent = 'Помоги другому игроку с его заданием!';
                helpOthers.style.display = 'block';
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
        playersList.innerHTML = `
            <div class="player-item">👨‍🚀 Космонавт Алексей</div>
            <div class="player-item">👩‍🚀 Космонавт Мария</div>
            <div class="player-item">👨‍🚀 Космонавт Иван</div>
        `;
    }

    setupHelpPlayers() {
        // В реальной игре здесь был бы список игроков, которым нужна помощь
        const select = document.getElementById('playerToHelp');
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
                        this.gameState.currentPosition = Math.max(0, this.gameState.currentPosition - 2);
                        this.updateRocketPosition();
                        message = 'Космический ветер отбросил тебя на 2 планеты назад!';
                    }
                    break;
            }
            
            if (starsEarned > 0) {
                this.gameState.stars += starsEarned;
                this.showResult(starsEarned, message);
            } else {
                this.continueGame();
            }
        }, 3000);
    }

    submitSolution() {
        const solution = document.getElementById('solutionInput').value;
        if (!solution.trim()) {
            alert('Опиши своё решение!');
            return;
        }
        
        // Оцениваем решение (в реальной игре была бы система оценки)
        const starsEarned = this.evaluateSolution(solution);
        const message = this.getFeedback(starsEarned);
        
        this.gameState.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    startPresentation() {
        const starsEarned = 2; // За презентацию всегда 2 звезды
        const message = 'Ты убедительно доказал полезность своей профессии!';
        
        this.gameState.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    submitHelp() {
        const helpText = document.getElementById('helpText').value;
        if (!helpText.trim()) {
            alert('Опиши, чем ты можешь помочь!');
            return;
        }
        
        const starsEarned = 1; // За помощь всегда 1 звезда
        const message = 'Спасибо за помощь другому космонавту!';
        
        this.gameState.stars += starsEarned;
        this.showResult(starsEarned, message);
    }

    evaluateSolution(solution) {
        // Простая система оценки на основе длины и сложности решения
        const lengthScore = Math.min(solution.length / 50, 2); // Макс 2 звезды за длину
        const complexityBonus = solution.includes('!') || solution.includes('?') ? 0.5 : 0;
        
        return Math.min(Math.floor(lengthScore + complexityBonus), 3);
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
        
        document.getElementById('resultIcon').textContent = '⭐'.repeat(Math.min(starsEarned, 3));
        document.getElementById('resultTitle').textContent = starsEarned > 0 ? 'Успех!' : 'Событие';
        document.getElementById('resultText').textContent = message;
        document.getElementById('starsEarned').textContent = starsEarned > 0 ? `+${starsEarned} ⭐` : '';
        
        // Обновляем счетчик звезд
        this.updatePlayerInfo();
        
        // Проверяем победу
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.completeGame(), 2000);
        }
    }

    continueGame() {
        // Разблокируем кнопку броска кубика
        document.getElementById('rollDiceBtn').disabled = false;
        this.showScreen('game');
    }

    completeGame() {
        this.playSound('winSound');
        this.showScreen('win');
        
        document.getElementById('winnerName').textContent = this.player.name;
        document.getElementById('winnerProfession').textContent = this.player.profession;
    }

    restartGame() {
        this.gameState = {
            currentPosition: 0,
            stars: 0,
            planets: GameData.createGameBoard(15),
            currentPlanet: null,
            diceValue: 0,
            gameStarted: true
        };
        
        this.renderGameBoard();
        this.updatePlayerInfo();
        this.updateRocketPosition();
        this.showScreen('game');
    }

    showScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        document.getElementById(screenName + 'Screen').classList.add('active');
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
    console.log('🎮 Запускаем космическую игру...');
    window.game = new CosmicProfessionGame();
});
