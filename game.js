// Основной игровой класс
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loadingScreen';
        this.player = null;
        this.gameState = {
            currentPosition: -1, // Старт перед первой планетой
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null,
            currentMission: null
        };
        this.planets = [];
        this.isCreativeSolution = false;
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация космической игры...');
        this.initTelegram();
        this.createGamePlanets();
        this.bindEvents();
        this.startLoadingAnimation();
    }

    initTelegram() {
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            console.log('📱 Telegram WebApp инициализирован');
        }
    }

    createGamePlanets() {
        this.planets = GAME_DATA.planets;
        console.log(`🪐 Создано ${this.planets.length} планет для путешествия`);
    }

    bindEvents() {
        console.log('🔗 Привязка событий...');
        
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
            this.showSolutionInput(false);
        });

        document.getElementById('creativeSolution').addEventListener('click', () => {
            this.showSolutionInput(true);
        });

        document.getElementById('submitSolution').addEventListener('click', () => {
            this.completeMission();
        });

        document.getElementById('cancelSolution').addEventListener('click', () => {
            this.hideSolutionInput();
        });

        // Очистка лога
        document.getElementById('clearLog').addEventListener('click', () => {
            this.clearLog();
        });

        // Перезапуск игры
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });

        // Плавающие labels
        const floatingInput = document.getElementById('playerName');
        if (floatingInput) {
            floatingInput.addEventListener('input', this.handleFloatingLabel.bind(this));
        }

        console.log('✅ Все события успешно привязаны');
    }

    handleFloatingLabel(event) {
        const input = event.target;
        const label = input.nextElementSibling;
        if (input.value.trim() !== '') {
            label.classList.add('filled');
        } else {
            label.classList.remove('filled');
        }
    }

    startLoadingAnimation() {
        let progress = 0;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        const interval = setInterval(() => {
            progress += 2;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showScreen('characterScreen');
                }, 500);
            }
        }, 60);
    }

    generatePlayerProfession() {
        const name = document.getElementById('playerName').value.trim();
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;

        console.log('📝 Данные формы:', { name, skill, interest });

        if (!name) {
            GameUtils.showNotification('Введите имя космонавта!', 'error');
            return;
        }

        if (!skill) {
            GameUtils.showNotification('Выберите главный навык!', 'error');
            return;
        }

        if (!interest) {
            GameUtils.showNotification('Выберите сферу интересов!', 'error');
            return;
        }

        // Генерация профессии
        const profession = GameUtils.generateProfession(skill, interest);
        
        this.player = {
            name: name,
            profession: profession,
            skill: skill,
            interest: interest
        };

        console.log('🎓 Сгенерирована профессия:', profession);

        // Показываем результат
        const resultDiv = document.getElementById('professionResult');
        document.getElementById('professionName').textContent = profession.fullName;
        document.getElementById('professionDescription').textContent = profession.description;
        document.getElementById('professionSkill').textContent = this.getSkillDisplayName(skill);
        document.getElementById('professionInterest').textContent = this.getInterestDisplayName(interest);
        
        resultDiv.style.display = 'block';
        resultDiv.style.animation = 'slideUp 0.5s ease-out';

        // Активируем кнопку старта
        document.getElementById('startGame').disabled = false;

        GameUtils.showNotification(`Профессия "${profession.fullName}" создана!`, 'success');
    }

    getSkillDisplayName(skill) {
        const names = {
            'рисование': '🎨 Творческое видение',
            'программирование': '💻 Техническое мышление',
            'помощь другим': '🤝 Коммуникабельность',
            'исследования': '🔭 Аналитический склад ума',
            'творчество': '✨ Креативность',
            'организация': '📊 Системное мышление'
        };
        return names[skill] || skill;
    }

    getInterestDisplayName(interest) {
        const names = {
            'животные': '🐾 Любовь к животным',
            'технологии': '🤖 Интерес к технологиям',
            'искусство': '🎭 Тяга к искусству',
            'природа': '🌿 Связь с природой',
            'космос': '🚀 Страсть к космосу',
            'музыка': '🎵 Музыкальность'
        };
        return names[interest] || interest;
    }

    startGame() {
        if (!this.player) {
            GameUtils.showNotification('Сначала создайте персонажа!', 'error');
            return;
        }

        console.log('🎮 Начало игры для:', this.player.name);
        
        this.gameState.startTime = new Date();
        this.gameState.currentPosition = -1; // Стартовая позиция
        
        this.updateGameDisplay();
        this.showScreen('gameScreen');
        
        // Даем время для отрисовки DOM
        setTimeout(() => {
            this.renderGameMap();
        }, 100);
        
        this.addLogMessage(`🚀 КОСМИЧЕСКИЙ СТАРТ! Корабль "${this.player.name}" начал путешествие к Планете Профессий!`);
        this.addLogMessage(`🎯 Ваша миссия: стать первым ${this.player.profession.fullName} во вселенной!`);
        this.addLogMessage(`⭐ Соберите 10 звезд полезности, чтобы достичь цели.`);
        
        GameUtils.showNotification('Путешествие началось! Бросьте кубик для первого хода.', 'success');
    }

    renderGameMap() {
        const container = document.getElementById('planetsContainer');
        if (!container) {
            console.error('❌ Элемент planetsContainer не найден!');
            return;
        }
        
        container.innerHTML = '';

        this.planets.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${planet.description}`;
            
            // Добавляем класс для посещенных планет
            if (this.gameState.visitedPlanets.includes(planet.id)) {
                planetElement.classList.add('visited');
            }
            
            // Добавляем класс для текущей планеты
            if (index === this.gameState.currentPosition) {
                planetElement.classList.add('current');
            }
            
            container.appendChild(planetElement);
        });

        console.log('🗺️ Карта отрендерена, планет:', this.planets.length);
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const marker = document.getElementById('playerMarker');
        const planets = document.querySelectorAll('.planet');
        
        console.log('📍 Обновление позиции:', this.gameState.currentPosition);
        
        if (this.gameState.currentPosition >= 0 && planets[this.gameState.currentPosition]) {
            const planetRect = planets[this.gameState.currentPosition].getBoundingClientRect();
            const containerRect = document.querySelector('.planets-container').getBoundingClientRect();
            
            const leftPosition = planetRect.left - containerRect.left + planetRect.width/2 - 20;
            const topPosition = planetRect.top - containerRect.top - 25;
            
            marker.style.left = `${leftPosition}px`;
            marker.style.top = `${topPosition}px`;
            
            console.log('✅ Позиция обновлена:', { left: leftPosition, top: topPosition });
        } else {
            // Стартовая позиция
            marker.style.left = '20px';
            marker.style.top = '50%';
            marker.style.transform = 'translateY(-50%)';
        }
    }

    rollDice() {
        const diceBtn = document.getElementById('rollDice');
        diceBtn.disabled = true;

        console.log('🎲 Бросок космического кубика...');

        // Анимация броска
        const diceResult = document.getElementById('diceResult');
        diceResult.textContent = '🎲';
        diceResult.style.animation = 'none';
        void diceResult.offsetWidth; // Сброс анимации
        diceResult.style.animation = 'diceRoll 0.8s ease-out';

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = this.getDiceEmoji(roll);
            console.log('✅ Выпало:', roll);
            
            this.movePlayer(roll);
            
            // Включаем кнопку через секунду после завершения хода
            setTimeout(() => {
                diceBtn.disabled = false;
            }, 1000);
            
        }, 800);
    }

    getDiceEmoji(number) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[number - 1] || '🎲';
    }

    movePlayer(steps) {
        this.addLogMessage(`🎲 Бросок кубика: выпало ${steps}`);

        const newPosition = this.gameState.currentPosition + steps;
        const maxPosition = this.planets.length - 1;

        console.log(`🔄 Движение: с ${this.gameState.currentPosition} на ${newPosition}`);

        if (newPosition > maxPosition) {
            this.gameState.currentPosition = maxPosition;
            this.addLogMessage('🎯 Достигнута конечная планета!');
            this.reachFinalPlanet();
        } else {
            this.gameState.currentPosition = newPosition;
            this.arriveAtPlanet();
        }

        this.renderGameMap(); // Перерисовываем карту для обновления классов
        this.updateGameDisplay();
    }

    arriveAtPlanet() {
        const currentPlanet = this.planets[this.gameState.currentPosition];
        
        console.log('🪐 Прибытие на планету:', currentPlanet);
        
        this.addLogMessage(`🪐 ПРИБЫТИЕ НА ПЛАНЕТУ: ${currentPlanet.name}`);
        this.addLogMessage(`📖 ${currentPlanet.description}`);

        // Добавляем планету в посещенные
        if (!this.gameState.visitedPlanets.includes(currentPlanet.id)) {
            this.gameState.visitedPlanets.push(currentPlanet.id);
        }

        // Показываем экран задания
        setTimeout(() => {
            this.showMissionScreen(currentPlanet);
        }, 1000);
    }

    showMissionScreen(planet) {
        const mission = GameUtils.generateMission(planet.type, this.player.profession);
        this.gameState.currentMission = mission;
        
        console.log('📋 Показ экрана задания:', mission);
        
        document.getElementById('missionPlanetIcon').textContent = planet.icon;
        document.getElementById('missionPlanetName').textContent = planet.name;
        document.getElementById('missionPlanetType').textContent = planet.description;
        
        document.getElementById('missionTypeBadge').textContent = mission.name;
        document.getElementById('missionTypeBadge').className = `mission-type-badge ${mission.color}`;
        
        document.getElementById('missionText').textContent = mission.text;
        document.getElementById('missionProfession').textContent = this.player.profession.fullName;

        // Сброс таймера и поля ввода
        document.getElementById('missionTimer').textContent = GameUtils.formatTime(mission.time);
        document.getElementById('solutionInput').style.display = 'none';
        document.getElementById('solutionText').value = '';

        // Останавливаем предыдущий таймер если был
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.startMissionTimer(mission.time);
        this.showScreen('missionScreen');
        
        this.addLogMessage(`📋 Получено задание: ${mission.name}`);
    }

    startMissionTimer(seconds) {
        this.timerSeconds = seconds;
        const totalSeconds = seconds;
        const timerFill = document.getElementById('timerFill');
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            document.getElementById('missionTimer').textContent = GameUtils.formatTime(this.timerSeconds);
            
            // Обновляем прогресс-бар
            if (timerFill) {
                const progress = (this.timerSeconds / totalSeconds) * 100;
                timerFill.style.width = `${progress}%`;
            }
            
            if (this.timerSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.timeOutMission();
            }
        }, 1000);
    }

    timeOutMission() {
        this.addLogMessage('⏰ Время вышло! Задание не выполнено.');
        GameUtils.showNotification('Время вышло! Попробуйте в следующий раз.', 'error');
        this.showScreen('gameScreen');
    }

    showSolutionInput(isCreative = false) {
        this.isCreativeSolution = isCreative;
        const solutionInput = document.getElementById('solutionInput');
        const solutionType = document.getElementById('solutionType');
        
        solutionInput.style.display = 'block';
        solutionType.textContent = isCreative ? '✨ Креативное решение' : '✅ Стандартное решение';
        
        if (isCreative) {
            this.addLogMessage('✨ Выбран режим креативного решения!');
            GameUtils.showNotification('Креативное решение! Возможность получить больше звезд!', 'success');
        }
    }

    hideSolutionInput() {
        document.getElementById('solutionInput').style.display = 'none';
        document.getElementById('solutionText').value = '';
    }

    completeMission() {
        const solution = document.getElementById('solutionText').value.trim();
        
        if (!solution) {
            GameUtils.showNotification('Опишите ваше решение!', 'error');
            return;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const currentPlanet = this.planets[this.gameState.currentPosition];
        let starsEarned = 1;
        let message = '';

        if (this.isCreativeSolution) {
            starsEarned = 2;
            message = '🎉 БЛЕСТЯЩЕ! Креативное решение! +2 звезды';
            this.addLogMessage('✨ Креативное решение получило высшую оценку!');
        } else {
            message = '✅ Задание успешно выполнено! +1 звезда';
            this.addLogMessage('✅ Задание выполнено на хорошем уровне.');
        }

        // Бонусы за типы планет
        if (currentPlanet.type === 'red') {
            starsEarned += 1;
            message += ' + 💬 бонус за убедительность';
            this.addLogMessage('💬 Убедительное доказательство полезности профессии!');
        }
        
        if (currentPlanet.type === 'green') {
            starsEarned += 1;
            message += ' + 🤝 бонус за помощь';
            this.addLogMessage('🤝 Отличная работа в команде!');
        }

        // Особые события на желтых планетах
        if (currentPlanet.type === 'yellow' && this.gameState.currentMission.stars > 0) {
            starsEarned = this.gameState.currentMission.stars;
            message = `⭐ ${this.gameState.currentMission.effect}`;
        }

        this.gameState.stars += starsEarned;

        this.addLogMessage(message);
        this.addLogMessage(`📊 Всего звезд: ${this.gameState.stars}/10`);

        // Обновляем прогресс-кольцо
        this.updateProgressRing();

        GameUtils.showNotification(`Получено ${starsEarned} ⭐! Всего: ${this.gameState.stars}/10`, 'success');

        // Проверка победы
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1500);
        } else {
            setTimeout(() => this.showScreen('gameScreen'), 1000);
        }
    }

    updateProgressRing() {
        const progressCircle = document.getElementById('progressCircle');
        if (progressCircle) {
            const circumference = 125.6; // 2 * π * r
            const progress = (this.gameState.stars / 10) * circumference;
            progressCircle.style.strokeDashoffset = circumference - progress;
        }
    }

    reachFinalPlanet() {
        this.addLogMessage('🎯 ВЫ ДОСТИГЛИ ФИНАЛЬНОЙ ПЛАНЕТЫ!');
        
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 2000);
        } else {
            this.addLogMessage('❌ Нужно больше звезд для победы! Продолжайте выполнять задания.');
            GameUtils.showNotification('Соберите больше звезд для достижения Планеты Профессий!', 'info');
        }
    }

    showVictoryScreen() {
        const timePlayed = Math.floor((new Date() - this.gameState.startTime) / 1000);
        const minutes = Math.floor(timePlayed / 60);
        const seconds = timePlayed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('victoryProfession').textContent = this.player.profession.fullName;
        document.getElementById('victoryStars').textContent = this.gameState.stars;
        document.getElementById('victoryTime').textContent = timeString;
        
        this.showScreen('victoryScreen');
        this.addLogMessage('🎉 КОСМИЧЕСКАЯ ПОБЕДА! Вы достигли Планеты Профессий!');
        
        GameUtils.showNotification('Поздравляем с победой! Вы стали настоящим космическим специалистом!', 'success');
    }

    updateGameDisplay() {
        if (this.player) {
            document.getElementById('currentPlayerName').textContent = this.player.name;
            document.getElementById('currentProfession').textContent = this.player.profession.fullName;
            document.getElementById('starsCount').textContent = this.gameState.stars;
            
            // Обновляем прогресс-кольцо
            this.updateProgressRing();
        }
    }

    addLogMessage(message) {
        const logContainer = document.getElementById('logMessages');
        if (!logContainer) {
            console.error('❌ Контейнер лога не найден!');
            return;
        }
        
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
        
        console.log('📝 Лог добавлен:', message);
    }

    clearLog() {
        const logContainer = document.getElementById('logMessages');
        if (logContainer) {
            logContainer.innerHTML = '';
            this.addLogMessage('🗑️ Журнал очищен. Продолжаем путешествие!');
        }
    }

    showScreen(screenName) {
        console.log('🔄 Переход на экран:', screenName);
        
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('✅ Экран показан:', screenName);
        } else {
            console.error('❌ Экран не найден:', screenName);
        }

        // Обновляем позицию игрока при переходе на игровой экран
        if (screenName === 'gameScreen') {
            setTimeout(() => {
                this.updatePlayerPosition();
            }, 200);
        }
    }

    restartGame() {
        console.log('🔄 Перезапуск игры...');
        
        this.player = null;
        this.gameState = {
            currentPosition: -1,
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null,
            currentMission: null
        };

        // Очищаем форму
        document.getElementById('playerName').value = '';
        document.getElementById('mainSkill').value = '';
        document.getElementById('interestArea').value = '';
        
        const resultDiv = document.getElementById('professionResult');
        if (resultDiv) {
            resultDiv.style.display = 'none';
        }
        
        document.getElementById('startGame').disabled = true;
        
        const logContainer = document.getElementById('logMessages');
        if (logContainer) {
            logContainer.innerHTML = '';
        }

        // Останавливаем таймер если активен
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.showScreen('characterScreen');
        GameUtils.showNotification('Игра перезапущена! Создайте нового космического специалиста.', 'info');
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запуск космической игры...');
    window.game = new CosmicProfessionGame();
});
