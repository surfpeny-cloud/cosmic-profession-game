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
        console.log('Инициализация игры...');
        this.initTelegram();
        this.createGamePlanets();
        this.bindEvents();
        this.showScreen('loadingScreen');
        
        // Имитация загрузки
        setTimeout(() => {
            this.showScreen('characterScreen');
        }, 2000);
    }

    initTelegram() {
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            console.log('Telegram WebApp инициализирован');
        }
    }

    createGamePlanets() {
        this.planets = GAME_DATA.planets;
        console.log('Создано планет:', this.planets.length);
    }

    bindEvents() {
        console.log('Привязка событий...');
        
        // Создание персонажа
        document.getElementById('generateProfession').addEventListener('click', () => {
            console.log('Клик по генерации профессии');
            this.generatePlayerProfession();
        });

        document.getElementById('startGame').addEventListener('click', () => {
            console.log('Старт игры');
            this.startGame();
        });

        // Игровые действия
        document.getElementById('rollDice').addEventListener('click', () => {
            console.log('Бросок кубика');
            this.rollDice();
        });

        // Задания
        document.getElementById('completeMission').addEventListener('click', () => {
            console.log('Обычное решение');
            this.showSolutionInput();
        });

        document.getElementById('creativeSolution').addEventListener('click', () => {
            console.log('Креативное решение');
            this.showSolutionInput(true);
        });

        document.getElementById('submitSolution').addEventListener('click', () => {
            console.log('Отправка решения');
            this.completeMission();
        });

        // Перезапуск игры
        document.getElementById('restartGame').addEventListener('click', () => {
            console.log('Перезапуск игры');
            this.restartGame();
        });

        console.log('Все события привязаны');
    }

    generatePlayerProfession() {
        const name = document.getElementById('playerName').value.trim();
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;

        console.log('Данные формы:', { name, skill, interest });

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

        console.log('Сгенерирована профессия:', profession);

        // Показываем результат
        const resultDiv = document.getElementById('professionResult');
        document.getElementById('professionName').textContent = profession.fullName;
        document.getElementById('professionDescription').textContent = profession.description;
        resultDiv.style.display = 'block';

        // Активируем кнопку старта
        document.getElementById('startGame').disabled = false;

        // Анимация появления профессии
        resultDiv.style.animation = 'fadeIn 0.5s ease-in';
        
        this.showNotification('Профессия создана! Теперь можно начинать игру.', 'success');
    }

    startGame() {
        if (!this.player) {
            this.showNotification('Сначала создайте персонажа!', 'error');
            return;
        }

        console.log('Начало игры для:', this.player.name);
        
        this.gameState.startTime = new Date();
        this.updateGameDisplay();
        this.showScreen('gameScreen');
        
        // Даем время для отрисовки DOM перед рендерингом карты
        setTimeout(() => {
            this.renderGameMap();
        }, 100);
        
        this.addLogMessage(`🚀 Космический корабль ${this.player.name} стартовал к Планете Профессий!`);
        this.addLogMessage(`🎯 Ваша профессия: ${this.player.profession.fullName}`);
    }

    renderGameMap() {
        const track = document.getElementById('planetsTrack');
        if (!track) {
            console.error('Элемент planetsTrack не найден!');
            return;
        }
        
        track.innerHTML = '';

        this.planets.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${GameUtils.getPlanetDescription(planet.name)}`;
            track.appendChild(planetElement);
        });

        console.log('Карта отрендерена, планет:', this.planets.length);
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const marker = document.getElementById('playerMarker');
        const planets = document.querySelectorAll('.planet');
        
        console.log('Обновление позиции:', this.gameState.currentPosition);
        
        if (planets.length > 0 && planets[this.gameState.currentPosition]) {
            const planetRect = planets[this.gameState.currentPosition].getBoundingClientRect();
            const trackRect = document.querySelector('.planets-track').getBoundingClientRect();
            
            const leftPosition = planetRect.left - trackRect.left + planetRect.width/2 - 15;
            const topPosition = planetRect.top - trackRect.top - 30;
            
            marker.style.left = `${leftPosition}px`;
            marker.style.top = `${topPosition}px`;
            
            console.log('Позиция обновлена:', { left: leftPosition, top: topPosition });
        } else {
            console.error('Не могу обновить позицию игрока');
        }
    }

    rollDice() {
        const diceBtn = document.getElementById('rollDice');
        diceBtn.disabled = true;

        console.log('Бросок кубика...');

        // Анимация броска
        const diceResult = document.getElementById('diceResult');
        diceResult.textContent = '🎲';
        diceResult.style.animation = 'none';
        void diceResult.offsetWidth; // Сброс анимации
        diceResult.style.animation = 'diceRoll 0.5s ease-out';

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = this.getDiceEmoji(roll);
            console.log('Выпало:', roll);
            
            this.movePlayer(roll);
            diceBtn.disabled = false;
        }, 500);
    }

    getDiceEmoji(number) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[number - 1] || '🎲';
    }

    movePlayer(steps) {
        this.addLogMessage(`🎲 Выпало: ${steps}`);

        const newPosition = this.gameState.currentPosition + steps;
        const maxPosition = this.planets.length;

        console.log(`Движение: с ${this.gameState.currentPosition} на ${newPosition}`);

        if (newPosition >= maxPosition) {
            this.gameState.currentPosition = maxPosition - 1;
            this.addLogMessage('🎯 Достигнута конечная планета!');
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
        
        console.log('Прибытие на планету:', currentPlanet);
        
        this.addLogMessage(`🪐 Прибытие на планету: ${currentPlanet.name}`);
        this.addLogMessage(`📝 ${GameUtils.getPlanetDescription(currentPlanet.name)}`);

        // Показываем экран задания
        this.showMissionScreen(currentPlanet);
    }

    showMissionScreen(planet) {
        const mission = GameUtils.generateMission(planet.type, this.player.profession);
        
        console.log('Показ экрана задания:', mission);
        
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

        // Останавливаем предыдущий таймер если был
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
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

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

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
            starsEarned += 1;
            this.addLogMessage('💬 Убедительное доказательство! +1 дополнительная звезда');
        }

        this.gameState.stars += starsEarned;
        this.gameState.visitedPlanets.push(currentPlanet.id);

        this.addLogMessage(`⭐ Получено звезд: ${starsEarned}`);
        this.addLogMessage(`📊 Всего звезд: ${this.gameState.stars}/10`);

        // Проверка победы
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1000);
        } else {
            this.showScreen('gameScreen');
        }
    }

    reachFinalPlanet() {
        this.addLogMessage('🎯 Вы достигли Планеты Профессий!');
        
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1000);
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
        if (!logContainer) {
            console.error('Контейнер лога не найден!');
            return;
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContainer.appendChild(messageElement);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Сохраняем в историю игры
        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            message: message
        });
        
        console.log('Лог добавлен:', message);
    }

    showScreen(screenName) {
        console.log('Переход на экран:', screenName);
        
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('Экран показан:', screenName);
        } else {
            console.error('Экран не найден:', screenName);
        }

        // Обновляем позицию игрока при переходе на игровой экран
        if (screenName === 'gameScreen') {
            setTimeout(() => {
                this.updatePlayerPosition();
            }, 200);
        }
    }

    showNotification(message, type = 'info') {
        // Временная реализация уведомления через alert
        // В реальном приложении лучше использовать красивый toast
        alert(`${type.toUpperCase()}: ${message}`);
    }

    restartGame() {
        console.log('Перезапуск игры...');
        
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
        
        const logContainer = document.querySelector('.log-messages');
        if (logContainer) {
            logContainer.innerHTML = '';
        }

        this.showScreen('characterScreen');
        this.showNotification('Игра перезапущена! Создайте нового персонажа.', 'info');
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запуск игры...');
    window.game = new CosmicProfessionGame();
});

// Вспомогательные CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in { 
        animation: fadeIn 0.5s ease-in; 
    }
    
    /* Добавляем стили для уведомлений */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 10px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success { background: #4CAF50; }
    .notification.error { background: #f44336; }
    .notification.info { background: #2196F3; }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
