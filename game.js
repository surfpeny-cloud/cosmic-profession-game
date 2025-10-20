// Основной игровой класс
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loadingScreen';
        this.player = null;
        this.gameState = {
            currentPosition: 0,
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null
        };
        this.planets = [];
        this.init();
    }

    init() {
        this.initTelegram();
        this.createGamePlanets();
        this.bindEvents();
        this.showScreen('loadingScreen');
        
        // Имитация загрузки
        setTimeout(() => {
            this.showScreen('characterScreen');
        }, 3000);
    }

    initTelegram() {
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }

    createGamePlanets() {
        this.planets = GAME_DATA.planets;
    }

    bindEvents() {
        // Создание персонажа
        document.getElementById('generateProfession').addEventListener('click', () => {
            this.generatePlayerProfession();
        });

        document.getElementById('startGame').addEventListener('click', () => {
            this.startGame();
        });

        // Игровые действия
        document.getElementById('rollDice').addEventListener('click', () => {
            this.rollDice();
        });

        // Задания
        document.getElementById('completeMission').addEventListener('click', () => {
            this.showSolutionInput();
        });

        document.getElementById('creativeSolution').addEventListener('click', () => {
            this.showSolutionInput(true);
        });

        document.getElementById('submitSolution').addEventListener('click', () => {
            this.completeMission();
        });

        // Перезапуск игры
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });
    }

    generatePlayerProfession() {
        const name = document.getElementById('playerName').value.trim();
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;

        if (!name || !skill || !interest) {
            this.showNotification('Заполните все поля!', 'error');
            return;
        }

        const profession = GameUtils.generateProfession(skill, interest);
        
        this.player = {
            name: name,
            profession: profession,
            skill: skill,
            interest: interest
        };

        // Показываем результат
        const resultDiv = document.getElementById('professionResult');
        document.getElementById('professionName').textContent = profession.fullName;
        document.getElementById('professionDescription').textContent = profession.description;
        resultDiv.style.display = 'block';

        // Активируем кнопку старта
        document.getElementById('startGame').disabled = false;

        // Анимация появления профессии
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
    }

    startGame() {
        if (!this.player) return;

        this.gameState.startTime = new Date();
        this.updateGameDisplay();
        this.showScreen('gameScreen');
        this.renderGameMap();
        
        this.addLogMessage(`🚀 Космический корабль ${this.player.name} стартовал к Планете Профессий!`);
        this.addLogMessage(`🎯 Ваша профессия: ${this.player.profession.fullName}`);
    }

    renderGameMap() {
        const track = document.getElementById('planetsTrack');
        track.innerHTML = '';

        this.planets.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${GameUtils.getPlanetDescription(planet.name)}`;
            track.appendChild(planetElement);
        });

        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const marker = document.getElementById('playerMarker');
        const planets = document.querySelectorAll('.planet');
        
        if (planets[this.gameState.currentPosition]) {
            const planetRect = planets[this.gameState.currentPosition].getBoundingClientRect();
            const trackRect = document.querySelector('.planets-track').getBoundingClientRect();
            
            marker.style.left = `${planetRect.left + planetRect.width/2 - 15}px`;
            marker.style.top = `${planetRect.top - 30}px`;
        }
    }

    rollDice() {
        const diceBtn = document.getElementById('rollDice');
        diceBtn.disabled = true;

        // Анимация броска
        const diceResult = document.getElementById('diceResult');
        diceResult.textContent = '🎲';
        diceResult.style.animation = 'diceRoll 0.5s ease-out';

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = this.getDiceEmoji(roll);
            
            this.movePlayer(roll);
            diceBtn.disabled = false;
        }, 500);
    }

    getDiceEmoji(number) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[number - 1];
    }

    movePlayer(steps) {
        this.addLogMessage(`🎲 Выпало: ${steps}`);

        const newPosition = this.gameState.currentPosition + steps;
        const maxPosition = this.planets.length;

        if (newPosition >= maxPosition) {
            this.gameState.currentPosition = maxPosition - 1;
            this.reachFinalPlanet();
        } else {
            this.gameState.currentPosition = newPosition;
            this.arriveAtPlanet();
        }

        this.updatePlayerPosition();
        this.updateGameDisplay();
    }

    arriveAtPlanet() {
        const currentPlanet = this.planets[this.gameState.currentPosition];
        
        this.addLogMessage(`🪐 Прибытие на планету: ${currentPlanet.name}`);
        this.addLogMessage(`📝 ${GameUtils.getPlanetDescription(currentPlanet.name)}`);

        // Показываем экран задания
        this.showMissionScreen(currentPlanet);
    }

    showMissionScreen(planet) {
        const mission = GameUtils.generateMission(planet.type, this.player.profession);
        
        document.getElementById('missionPlanetIcon').textContent = planet.icon;
        document.getElementById('missionPlanetName').textContent = planet.name;
        document.getElementById('missionType').textContent = mission.name;
        document.getElementById('missionType').className = `mission-type ${planet.type}`;
        document.getElementById('missionText').textContent = mission.text;
        document.getElementById('missionProfession').textContent = this.player.profession.fullName;

        // Сброс таймера и поля ввода
        document.getElementById('missionTimer').textContent = this.formatTime(mission.time);
        document.getElementById('solutionInput').style.display = 'none';
        document.getElementById('solutionText').value = '';

        this.startMissionTimer(mission.time);
        this.showScreen('missionScreen');
    }

    startMissionTimer(seconds) {
        this.timerSeconds = seconds;
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            document.getElementById('missionTimer').textContent = this.formatTime(this.timerSeconds);
            
            if (this.timerSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.timeOutMission();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    timeOutMission() {
        this.addLogMessage('⏰ Время вышло! Задание не выполнено.');
        this.showScreen('gameScreen');
    }

    showSolutionInput(isCreative = false) {
        this.isCreativeSolution = isCreative;
        document.getElementById('solutionInput').style.display = 'block';
        
        if (isCreative) {
            this.addLogMessage('✨ Вы выбрали креативное решение!');
        }
    }

    completeMission() {
        const solution = document.getElementById('solutionText').value.trim();
        
        if (!solution) {
            this.showNotification('Опишите ваше решение!', 'error');
            return;
        }

        clearInterval(this.timerInterval);

        const currentPlanet = this.planets[this.gameState.currentPosition];
        let starsEarned = 1;

        if (this.isCreativeSolution) {
            starsEarned = 2;
            this.addLogMessage('🎉 Креативное решение! +2 звезды');
        } else {
            this.addLogMessage('✅ Задание выполнено! +1 звезда');
        }

        // Особые случаи для разных типов планет
        if (currentPlanet.type === 'red') {
            starsEarned += 1; // Дополнительная звезда за убедительность
            this.addLogMessage('💬 Убедительное доказательство! +1 дополнительная звезда');
        }

        this.gameState.stars += starsEarned;
        this.gameState.visitedPlanets.push(currentPlanet.id);

        this.addLogMessage(`⭐ Получено звезд: ${starsEarned}`);
        this.addLogMessage(`📊 Всего звезд: ${this.gameState.stars}/10`);

        // Проверка победы
        if (this.gameState.stars >= 10) {
            this.showVictoryScreen();
        } else {
            this.showScreen('gameScreen');
        }
    }

    reachFinalPlanet() {
        this.addLogMessage('🎯 Вы достигли Планеты Профессий!');
        
        if (this.gameState.stars >= 10) {
            this.showVictoryScreen();
        } else {
            this.addLogMessage('❌ Нужно больше звезд для победы! Продолжайте путешествие.');
        }
    }

    showVictoryScreen() {
        const timePlayed = Math.floor((new Date() - this.gameState.startTime) / 1000);
        
        document.getElementById('victoryProfession').textContent = this.player.profession.fullName;
        document.getElementById('victoryStars').textContent = this.gameState.stars;
        document.getElementById('victoryTime').textContent = this.formatTime(timePlayed);
        
        this.showScreen('victoryScreen');
        this.addLogMessage('🎉 ПОБЕДА! Вы достигли Планеты Профессий!');
    }

    updateGameDisplay() {
        if (this.player) {
            document.getElementById('currentPlayerName').textContent = this.player.name;
            document.getElementById('currentProfession').textContent = this.player.profession.fullName;
            document.getElementById('starsCount').textContent = this.gameState.stars;
        }
    }

    addLogMessage(message) {
        const logContainer = document.querySelector('.log-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.textContent = message;
        
        logContainer.appendChild(messageElement);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Сохраняем в историю игры
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            message: message
        });
    }

    showScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;

        // Обновляем позицию игрока при переходе на игровой экран
        if (screenName === 'gameScreen') {
            setTimeout(() => this.updatePlayerPosition(), 100);
        }
    }

    showNotification(message, type = 'info') {
        // Простая реализация уведомления
        alert(message);
    }

    restartGame() {
        this.player = null;
        this.gameState = {
            currentPosition: 0,
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null
        };

        // Очищаем форму
        document.getElementById('playerName').value = '';
        document.getElementById('mainSkill').value = '';
        document.getElementById('interestArea').value = '';
        document.getElementById('professionResult').style.display = 'none';
        document.getElementById('startGame').disabled = true;
        document.querySelector('.log-messages').innerHTML = '';

        this.showScreen('characterScreen');
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CosmicProfessionGame();
});

// Вспомогательные CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in { animation: fadeIn 0.5s ease-in; }
`;
document.head.appendChild(style);
