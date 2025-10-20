// Основной игровой класс - упрощенная рабочая версия
class CosmicProfessionGame {
    constructor() {
        this.currentScreen = 'loadingScreen';
        this.player = null;
        this.gameState = {
            currentPosition: -1,
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null,
            currentMission: null
        };
        this.planets = [];
        this.isCreativeSolution = false;
        this.timerInterval = null;
        
        console.log('🚀 Игра создана, начинаем инициализацию...');
        this.init();
    }

    init() {
        console.log('🔧 Инициализация игры...');
        
        // Сначала создаем планеты
        this.createGamePlanets();
        console.log('🪐 Планеты созданы:', this.planets.length);
        
        // Затем привязываем события
        this.bindEvents();
        console.log('🔗 События привязаны');
        
        // Инициализируем Telegram
        this.initTelegram();
        console.log('📱 Telegram инициализирован');
        
        // Запускаем загрузку
        this.startLoadingAnimation();
        console.log('🔄 Анимация загрузки запущена');
    }

    initTelegram() {
        if (window.Telegram && Telegram.WebApp) {
            try {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                console.log('✅ Telegram WebApp готов');
            } catch (error) {
                console.log('ℹ️ Telegram не доступен, продолжаем в браузере');
            }
        }
    }

    createGamePlanets() {
        // Простые данные для тестирования
        this.planets = [
            { id: 1, name: "Кристаллиус", type: "blue", icon: "💎", description: "Планета сверкающих кристаллов" },
            { id: 2, name: "Роботония", type: "red", icon: "🤖", description: "Мир роботов и технологий" },
            { id: 3, name: "Флора-7", type: "green", icon: "🌿", description: "Цветущая планета" },
            { id: 4, name: "Арт-Сфера", type: "blue", icon: "🎨", description: "Космическая галерея" },
            { id: 5, name: "ТехноМир", type: "yellow", icon: "⚡", description: "Центр технологий" }
        ];
    }

    bindEvents() {
        console.log('🎯 Начинаем привязку событий...');
        
        try {
            // Создание персонажа
            const generateBtn = document.getElementById('generateProfession');
            const startBtn = document.getElementById('startGame');
            const rollDiceBtn = document.getElementById('rollDice');

            if (generateBtn) {
                generateBtn.addEventListener('click', () => {
                    console.log('🎲 Кнопка генерации нажата');
                    this.generatePlayerProfession();
                });
            }

            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    console.log('🚀 Кнопка старта нажата');
                    this.startGame();
                });
            }

            if (rollDiceBtn) {
                rollDiceBtn.addEventListener('click', () => {
                    console.log('🎲 Кнопка кубика нажата');
                    this.rollDice();
                });
            }

            // Задания
            const completeMissionBtn = document.getElementById('completeMission');
            const creativeSolutionBtn = document.getElementById('creativeSolution');
            const submitSolutionBtn = document.getElementById('submitSolution');
            const cancelSolutionBtn = document.getElementById('cancelSolution');

            if (completeMissionBtn) {
                completeMissionBtn.addEventListener('click', () => {
                    this.showSolutionInput(false);
                });
            }

            if (creativeSolutionBtn) {
                creativeSolutionBtn.addEventListener('click', () => {
                    this.showSolutionInput(true);
                });
            }

            if (submitSolutionBtn) {
                submitSolutionBtn.addEventListener('click', () => {
                    this.completeMission();
                });
            }

            if (cancelSolutionBtn) {
                cancelSolutionBtn.addEventListener('click', () => {
                    this.hideSolutionInput();
                });
            }

            // Перезапуск игры
            const restartBtn = document.getElementById('restartGame');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    this.restartGame();
                });
            }

            console.log('✅ Все основные события привязаны');

        } catch (error) {
            console.error('❌ Ошибка при привязке событий:', error);
        }
    }

    startLoadingAnimation() {
        console.log('📊 Запуск анимации загрузки...');
        
        let progress = 0;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressFill || !progressText) {
            console.error('❌ Элементы прогресса не найдены!');
            this.showScreen('characterScreen');
            return;
        }

        const interval = setInterval(() => {
            progress += 2;
            
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${progress}%`;
            }
            
            console.log(`📊 Прогресс загрузки: ${progress}%`);
            
            if (progress >= 100) {
                clearInterval(interval);
                console.log('✅ Загрузка завершена!');
                setTimeout(() => {
                    this.showScreen('characterScreen');
                }, 500);
            }
        }, 40);
    }

    generatePlayerProfession() {
        console.log('👤 Генерация профессии...');
        
        const name = document.getElementById('playerName').value.trim();
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;

        console.log('📝 Данные формы:', { name, skill, interest });

        if (!name) {
            alert('Введите имя космонавта!');
            return;
        }

        if (!skill) {
            alert('Выберите главный навык!');
            return;
        }

        if (!interest) {
            alert('Выберите сферу интересов!');
            return;
        }

        // Простая генерация профессии
        const profession = {
            fullName: `${this.getRandomPrefix()} ${skill} ${interest}`,
            description: `Специалист в области ${skill} и ${interest}`,
            skill: skill,
            interest: interest
        };
        
        this.player = {
            name: name,
            profession: profession,
            skill: skill,
            interest: interest
        };

        console.log('🎓 Профессия создана:', profession);

        // Показываем результат
        const resultDiv = document.getElementById('professionResult');
        const professionName = document.getElementById('professionName');
        const professionDesc = document.getElementById('professionDescription');
        
        if (resultDiv && professionName && professionDesc) {
            professionName.textContent = profession.fullName;
            professionDesc.textContent = profession.description;
            resultDiv.style.display = 'block';
        }

        // Активируем кнопку старта
        const startBtn = document.getElementById('startGame');
        if (startBtn) {
            startBtn.disabled = false;
        }

        alert(`Профессия "${profession.fullName}" создана!`);
    }

    getRandomPrefix() {
        const prefixes = ['Космический', 'Звездный', 'Галактический', 'Орбитальный'];
        return prefixes[Math.floor(Math.random() * prefixes.length)];
    }

    startGame() {
        if (!this.player) {
            alert('Сначала создайте персонажа!');
            return;
        }

        console.log('🎮 Начало игры для:', this.player.name);
        
        this.gameState.startTime = new Date();
        this.gameState.currentPosition = -1;
        
        this.updateGameDisplay();
        this.showScreen('gameScreen');
        
        // Даем время для отрисовки DOM
        setTimeout(() => {
            this.renderGameMap();
        }, 100);
        
        this.addLogMessage(`🚀 КОСМИЧЕСКИЙ СТАРТ! Корабль "${this.player.name}" начал путешествие!`);
        this.addLogMessage(`🎯 Ваша миссия: стать первым ${this.player.profession.fullName} во вселенной!`);
        
        alert('Путешествие началось! Бросьте кубик для первого хода.');
    }

    renderGameMap() {
        const container = document.getElementById('planetsContainer');
        if (!container) {
            console.error('❌ Контейнер планет не найден!');
            return;
        }
        
        container.innerHTML = '';

        this.planets.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${planet.description}`;
            
            container.appendChild(planetElement);
        });

        console.log('🗺️ Карта создана, планет:', this.planets.length);
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const marker = document.getElementById('playerMarker');
        const planets = document.querySelectorAll('.planet');
        
        if (!marker) {
            console.error('❌ Маркер игрока не найден!');
            return;
        }
        
        if (this.gameState.currentPosition >= 0 && planets[this.gameState.currentPosition]) {
            const planetRect = planets[this.gameState.currentPosition].getBoundingClientRect();
            const containerRect = document.querySelector('.planets-container').getBoundingClientRect();
            
            const leftPosition = planetRect.left - containerRect.left + planetRect.width/2 - 20;
            const topPosition = planetRect.top - containerRect.top - 25;
            
            marker.style.left = `${leftPosition}px`;
            marker.style.top = `${topPosition}px`;
        } else {
            // Стартовая позиция
            marker.style.left = '20px';
            marker.style.top = '50%';
        }
    }

    rollDice() {
        console.log('🎲 Бросок кубика...');

        const diceBtn = document.getElementById('rollDice');
        if (diceBtn) {
            diceBtn.disabled = true;
        }

        // Анимация броска
        const diceResult = document.getElementById('diceResult');
        if (diceResult) {
            diceResult.textContent = '🎲';
            diceResult.style.animation = 'none';
            void diceResult.offsetWidth;
            diceResult.style.animation = 'diceRoll 0.8s ease-out';
        }

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            console.log('✅ Выпало:', roll);
            
            if (diceResult) {
                diceResult.textContent = this.getDiceEmoji(roll);
            }
            
            this.movePlayer(roll);
            
            if (diceBtn) {
                setTimeout(() => {
                    diceBtn.disabled = false;
                }, 1000);
            }
            
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

        if (newPosition > maxPosition) {
            this.gameState.currentPosition = maxPosition;
            this.addLogMessage('🎯 Достигнута конечная планета!');
            this.reachFinalPlanet();
        } else {
            this.gameState.currentPosition = newPosition;
            this.arriveAtPlanet();
        }

        this.renderGameMap();
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
        const mission = this.generateMission(planet.type);
        this.gameState.currentMission = mission;
        
        console.log('📋 Показ задания:', mission);
        
        // Обновляем UI задания
        const planetIcon = document.getElementById('missionPlanetIcon');
        const planetName = document.getElementById('missionPlanetName');
        const missionText = document.getElementById('missionText');
        const missionProfession = document.getElementById('missionProfession');
        const missionTimer = document.getElementById('missionTimer');

        if (planetIcon) planetIcon.textContent = planet.icon;
        if (planetName) planetName.textContent = planet.name;
        if (missionText) missionText.textContent = mission.text;
        if (missionProfession && this.player) {
            missionProfession.textContent = this.player.profession.fullName;
        }
        if (missionTimer) missionTimer.textContent = '02:00';

        // Сбрасываем поле ввода
        const solutionInput = document.getElementById('solutionInput');
        const solutionText = document.getElementById('solutionText');
        if (solutionInput) solutionInput.style.display = 'none';
        if (solutionText) solutionText.value = '';

        // Останавливаем предыдущий таймер
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.startMissionTimer(120); // 2 минуты
        this.showScreen('missionScreen');
        
        this.addLogMessage(`📋 Получено задание: ${mission.name}`);
    }

    generateMission(planetType) {
        const missions = {
            blue: [
                "Инопланетяне не понимают земное искусство! Создайте понятный для всех шедевр.",
                "Космические животные грустят в невесомости. Развеселите их!"
            ],
            red: [
                "Докажите, что ваша профессия необходима для межгалактических переговоров.",
                "Объясните, как ваша профессия поможет в колонизации новой планеты."
            ],
            green: [
                "Помогите другому исследователю с его заданием.",
                "Организуйте совместный проект с другими специалистами."
            ],
            yellow: [
                "Метеоритный дожь! Все получают бонус за смелость.",
                "Встреча с дружелюбными инопланетянами! Они делятся технологиями."
            ]
        };

        const missionList = missions[planetType] || missions.blue;
        const randomMission = missionList[Math.floor(Math.random() * missionList.length)];

        return {
            type: planetType,
            name: 'Космическая задача',
            text: randomMission,
            time: 120
        };
    }

    startMissionTimer(seconds) {
        this.timerSeconds = seconds;
        
        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            const timerElement = document.getElementById('missionTimer');
            if (timerElement) {
                const mins = Math.floor(this.timerSeconds / 60);
                const secs = this.timerSeconds % 60;
                timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            
            if (this.timerSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.timeOutMission();
            }
        }, 1000);
    }

    timeOutMission() {
        this.addLogMessage('⏰ Время вышло! Задание не выполнено.');
        alert('Время вышло! Попробуйте в следующий раз.');
        this.showScreen('gameScreen');
    }

    showSolutionInput(isCreative = false) {
        this.isCreativeSolution = isCreative;
        const solutionInput = document.getElementById('solutionInput');
        if (solutionInput) {
            solutionInput.style.display = 'block';
        }
        
        if (isCreative) {
            this.addLogMessage('✨ Выбран режим креативного решения!');
        }
    }

    hideSolutionInput() {
        const solutionInput = document.getElementById('solutionInput');
        const solutionText = document.getElementById('solutionText');
        if (solutionInput) solutionInput.style.display = 'none';
        if (solutionText) solutionText.value = '';
    }

    completeMission() {
        const solutionText = document.getElementById('solutionText');
        const solution = solutionText ? solutionText.value.trim() : '';

        if (!solution) {
            alert('Опишите ваше решение!');
            return;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        let starsEarned = this.isCreativeSolution ? 2 : 1;
        
        this.gameState.stars += starsEarned;

        this.addLogMessage(`✅ Задание выполнено! +${starsEarned} звезда`);
        this.addLogMessage(`📊 Всего звезд: ${this.gameState.stars}/10`);

        alert(`Получено ${starsEarned} ⭐! Всего: ${this.gameState.stars}/10`);

        // Проверка победы
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1500);
        } else {
            setTimeout(() => this.showScreen('gameScreen'), 1000);
        }
    }

    reachFinalPlanet() {
        this.addLogMessage('🎯 ВЫ ДОСТИГЛИ ФИНАЛЬНОЙ ПЛАНЕТЫ!');
        
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 2000);
        } else {
            this.addLogMessage('❌ Нужно больше звезд для победы!');
            alert('Соберите больше звезд для достижения Планеты Профессий!');
        }
    }

    showVictoryScreen() {
        const timePlayed = Math.floor((new Date() - this.gameState.startTime) / 1000);
        const minutes = Math.floor(timePlayed / 60);
        const seconds = timePlayed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const victoryProfession = document.getElementById('victoryProfession');
        const victoryStars = document.getElementById('victoryStars');
        const victoryTime = document.getElementById('victoryTime');
        
        if (victoryProfession && this.player) {
            victoryProfession.textContent = this.player.profession.fullName;
        }
        if (victoryStars) {
            victoryStars.textContent = this.gameState.stars;
        }
        if (victoryTime) {
            victoryTime.textContent = timeString;
        }
        
        this.showScreen('victoryScreen');
        this.addLogMessage('🎉 КОСМИЧЕСКАЯ ПОБЕДА! Вы достигли Планеты Профессий!');
        
        alert('Поздравляем с победой! Вы стали настоящим космическим специалистом!');
    }

    updateGameDisplay() {
        if (this.player) {
            const playerName = document.getElementById('currentPlayerName');
            const playerProfession = document.getElementById('currentProfession');
            const starsCount = document.getElementById('starsCount');
            
            if (playerName) playerName.textContent = this.player.name;
            if (playerProfession) playerProfession.textContent = this.player.profession.fullName;
            if (starsCount) starsCount.textContent = this.gameState.stars;
        }
    }

    addLogMessage(message) {
        const logContainer = document.getElementById('logMessages');
        if (!logContainer) {
            console.log('📝 Лог:', message);
            return;
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = 'log-message';
        messageElement.textContent = message;
        
        logContainer.appendChild(messageElement);
        logContainer.scrollTop = logContainer.scrollHeight;

        this.gameState.gameLog.push({
            time: new Date().toLocaleTimeString(),
            message: message
        });
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

        // Обновляем позицию игрока при переключении на игровой экран
        if (screenName === 'gameScreen') {
            setTimeout(() => {
                this.updatePlayerPosition();
            }, 200);
        }
    }

    restartGame() {
        console.log('🔄 Перезапуск игры...');
        
        if (!confirm('Вы уверены, что хотите начать новую игру?')) {
            return;
        }

        // Сбрасываем состояние
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
        const playerName = document.getElementById('playerName');
        const mainSkill = document.getElementById('mainSkill');
        const interestArea = document.getElementById('interestArea');
        const resultDiv = document.getElementById('professionResult');
        const startBtn = document.getElementById('startGame');
        const logContainer = document.getElementById('logMessages');

        if (playerName) playerName.value = '';
        if (mainSkill) mainSkill.value = '';
        if (interestArea) interestArea.value = '';
        if (resultDiv) resultDiv.style.display = 'none';
        if (startBtn) startBtn.disabled = true;
        if (logContainer) logContainer.innerHTML = '';

        // Останавливаем таймер
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Показываем экран создания персонажа
        this.showScreen('characterScreen');
        alert('Новая игра начата! Создайте нового космического специалиста.');
    }
}

// Запускаем игру когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM полностью загружен!');
    console.log('🎮 Запускаем космическую игру...');
    
    // Проверяем наличие необходимых элементов
    const requiredElements = [
        'loadingScreen', 'characterScreen', 'gameScreen', 
        'missionScreen', 'victoryScreen'
    ];
    
    let allElementsFound = true;
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error('❌ Не найден элемент:', id);
            allElementsFound = false;
        }
    });
    
    if (allElementsFound) {
        console.log('✅ Все необходимые элементы найдены');
        window.game = new CosmicProfessionGame();
    } else {
        console.error('❌ Не все элементы найдены, игра не может быть запущена');
        alert('Ошибка загрузки игры. Проверьте консоль для подробностей.');
    }
});

// Добавляем обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('🚨 Глобальная ошибка:', e.error);
    console.error('📝 В файле:', e.filename, 'строка:', e.lineno);
});

console.log('🔧 game.js загружен и готов к работе');
