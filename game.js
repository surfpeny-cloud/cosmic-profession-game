// Главный класс игры
class CosmicProfessionGame {
    constructor() {
        this.player = null;
        this.gameBoard = [];
        this.currentScreen = 'loading';
        this.isDiceRolling = false;
        this.timerInterval = null;
        this.timeLeft = GAME_CONFIG.timerDuration;
        this.convincedAliens = new Set();
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Инициализация космической игры...');
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
        this.gameBoard = generateGameBoard();
        
        // Инициализация игрока
        this.player = {
            name: 'Космический Исследователь',
            profession: '',
            skill: '',
            interest: '',
            stars: 0,
            position: 0,
            avatar: '👨‍🚀',
            hasVisited: new Set()
        };
        
        console.log('✅ Игра инициализирована');
    }

    initializeTelegramWebApp() {
        if (window.Telegram && Telegram.WebApp) {
            try {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                
                const user = Telegram.WebApp.initDataUnsafe?.user;
                if (user) {
                    this.player.name = user.first_name || 'Космонавт';
                    this.player.avatar = this.getAvatarEmoji(user.id);
                }
                
                console.log('✅ Telegram Web App инициализирован');
            } catch (error) {
                console.warn('⚠️ Telegram Web App не доступен, используем браузерный режим');
            }
        }
    }

    getAvatarEmoji(userId) {
        const emojis = ['🚀', '👨‍🚀', '👩‍🚀', '🛸', '⭐', '🌌', '🪐', '☄️'];
        return emojis[Math.abs(userId) % emojis.length] || '🚀';
    }

    setupEventListeners() {
        // Кнопка броска кубика
        this.safeAddEventListener('rollDiceBtn', 'click', () => this.rollDice());
        
        // Кнопки заданий
        this.safeAddEventListener('completeTaskBtn', 'click', () => this.completeTask());
        this.safeAddEventListener('helpOtherBtn', 'click', () => this.helpOtherPlayer());
        this.safeAddEventListener('closeTaskBtn', 'click', () => this.closeTaskScreen());
        
        // Кнопки убеждения
        document.querySelectorAll('.convince-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const alienNumber = parseInt(e.currentTarget.dataset.alien);
                this.convinceAlien(alienNumber);
            });
        });
        
        // Кнопка перезапуска
        this.safeAddEventListener('restartGameBtn', 'click', () => this.restartGame());
        
        // Обработка ввода доказательства
        this.safeAddEventListener('proofText', 'input', (e) => this.handleProofInput(e));
        
        console.log('✅ Обработчики событий установлены');
    }

    safeAddEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`⚠️ Элемент ${elementId} не найден`);
        }
    }

    showLoadingScreen() {
        this.showScreen('loadingScreen');
        
        // Имитация загрузки ресурсов
        setTimeout(() => {
            this.initializePlayerProfession();
            this.showMainScreen();
        }, 3000);
    }

    initializePlayerProfession() {
        const skill = getRandomSkill();
        const interest = getRandomInterest();
        
        this.player.skill = skill;
        this.player.interest = interest;
        this.player.profession = generateProfession(skill, interest);
        
        this.updatePlayerUI();
        console.log('🎯 Профессия создана:', this.player.profession);
    }

    updatePlayerUI() {
        this.updateElementText('playerName', this.player.name);
        this.updateElementText('playerAvatar', this.player.avatar);
        this.updateElementText('professionTitle', this.player.profession);
        this.updateElementText('professionDescription', 
            `Навык: ${this.player.skill} | Интерес: ${this.player.interest}`);
        this.updateElementText('skillTag', this.player.skill);
        this.updateElementText('interestTag', this.player.interest);
        this.updateElementText('starsCount', this.player.stars.toString());
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text;
    }

    showMainScreen() {
        this.showScreen('mainScreen');
        this.renderGameBoard();
        this.updatePlayerPosition();
        this.animateEntrance();
    }

    renderGameBoard() {
        const planetPath = document.getElementById('planetPath');
        if (!planetPath) return;

        planetPath.innerHTML = '';

        this.gameBoard.forEach(planet => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.style.left = `${(planet.position / (this.gameBoard.length - 1)) * 90 + 5}%`;
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${planet.description}`;
            
            // Анимация появления планет
            planetElement.style.opacity = '0';
            planetElement.style.transform = 'translateY(-50%) scale(0)';
            
            planetPath.appendChild(planetElement);

            // Последовательная анимация появления
            setTimeout(() => {
                planetElement.style.transition = 'all 0.5s ease';
                planetElement.style.opacity = '1';
                planetElement.style.transform = 'translateY(-50%) scale(1)';
            }, planet.position * 100);
        });
    }

    updatePlayerPosition() {
        const playerMarker = document.getElementById('playerMarker');
        if (!playerMarker || !this.gameBoard[this.player.position]) return;

        const newLeft = `${(this.player.position / (this.gameBoard.length - 1)) * 90 + 5}%`;
        playerMarker.style.left = newLeft;
    }

    animateEntrance() {
        const elements = document.querySelectorAll('.game-header, .game-area, .game-controls, .profession-panel');
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

    async rollDice() {
        if (this.isDiceRolling) return;
        
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

        console.log(`🎲 Выпало: ${finalRoll}`);

        setTimeout(() => {
            this.movePlayer(finalRoll);
            if (diceResult) diceResult.classList.remove('fade-in-up');
            if (diceBtn) diceBtn.disabled = false;
            this.isDiceRolling = false;
        }, 1000);
    }

    async movePlayer(steps) {
        const newPosition = Math.min(this.player.position + steps, this.gameBoard.length - 1);
        const distance = newPosition - this.player.position;
        
        // Анимация движения
        for (let i = 0; i <= distance; i++) {
            this.player.position = this.player.position + 1;
            this.updatePlayerPosition();
            await this.delay(300);
        }

        this.handlePlanetArrival();
    }

    handlePlanetArrival() {
        const currentPlanet = this.gameBoard[this.player.position];
        console.log(`🪐 Прибытие на: ${currentPlanet.name} (${currentPlanet.type})`);

        // Проверка победы
        if (currentPlanet.isWin) {
            if (this.player.stars >= GAME_CONFIG.totalStarsToWin) {
                this.showWinScreen();
            } else {
                this.showMessage(`Нужно собрать ${GAME_CONFIG.totalStarsToWin} звезд для достижения Планеты Профессий!`);
                setTimeout(() => this.showMainScreen(), 2000);
            }
            return;
        }

        // Активация планеты
        setTimeout(() => {
            this.activatePlanet(currentPlanet);
        }, 1000);
    }

    activatePlanet(planet) {
        this.player.hasVisited.add(planet.position);

        switch (planet.type) {
            case 'blue':
                this.showTaskScreen(planet);
                break;
            case 'red':
                this.showProofScreen();
                break;
            case 'green':
                this.showHelpScreen();
                break;
            case 'yellow':
                this.showEventScreen();
                break;
            default:
                this.showMainScreen();
        }
    }

    showTaskScreen(planet) {
        const problem = getRandomProblem();
        
        this.updateElementText('taskPlanetName', planet.name);
        this.updateElementText('taskPlanetType', PLANET_TYPES[planet.type].name);
        this.updateElementText('taskTitle', 'Космическая Задача');
        this.updateElementText('taskDescription', 
            `${problem}\n\n🎯 Твоя профессия: ${this.player.profession}\n\n💫 Задание: Придумай, как твоя профессия может помочь решить эту проблему!`);
        
        // Настройка планеты
        const planetIcon = document.getElementById('taskPlanetIcon');
        const planet3D = document.getElementById('taskPlanet3D');
        if (planetIcon) planetIcon.textContent = planet.icon;
        if (planet3D) planet3D.style.background = `linear-gradient(135deg, ${planet.color}, ${this.lightenColor(planet.color, 20)})`;

        this.startTimer();
        this.showScreen('taskScreen');
    }

    showProofScreen() {
        this.convincedAliens.clear();
        this.updateElementText('convincedCount', '0');
        this.updateElementText('proofStatement', 
            `Моя профессия "${this.player.profession}" полезна для космических путешественников, потому что...`);
        
        // Сброс кнопок убеждения
        document.querySelectorAll('.convince-button').forEach(btn => {
            btn.disabled = false;
            btn.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        });

        // Сброс текстового поля
        const proofText = document.getElementById('proofText');
        if (proofText) proofText.value = '';

        this.showScreen('proofScreen');
    }

    showHelpScreen() {
        const helpMessage = getRandomHelpMessage();
        
        this.updateElementText('taskPlanetName', 'Помощь Другим');
        this.updateElementText('taskPlanetType', PLANET_TYPES.green.name);
        this.updateElementText('taskTitle', 'Космическая Взаимопомощь');
        this.updateElementText('taskDescription', 
            `${helpMessage}\n\n✨ Помоги товарищу по космическому путешествию!`);

        // Настройка зеленой планеты
        const planetIcon = document.getElementById('taskPlanetIcon');
        const planet3D = document.getElementById('taskPlanet3D');
        if (planetIcon) planetIcon.textContent = '🟢';
        if (planet3D) planet3D.style.background = 'linear-gradient(135deg, #66bb6a, #4caf50)';

        this.showScreen('taskScreen');
    }

    showEventScreen() {
        const event = getRandomEvent();
        
        this.updateElementText('taskPlanetName', 'Космическое Событие');
        this.updateElementText('taskPlanetType', PLANET_TYPES.yellow.name);
        this.updateElementText('taskTitle', event.title);
        this.updateElementText('taskDescription', event.description);

        // Настройка желтой планеты
        const planetIcon = document.getElementById('taskPlanetIcon');
        const planet3D = document.getElementById('taskPlanet3D');
        if (planetIcon) planetIcon.textContent = '🟡';
        if (planet3D) planet3D.style.background = 'linear-gradient(135deg, #ffd54f, #ffc107)';

        // Обработка эффектов события
        if (event.effect.stars) {
            this.addStars(event.effect.stars);
        }

        this.showScreen('taskScreen');
    }

    completeTask() {
        this.stopTimer();
        
        const starsEarned = Math.random() > 0.3 ? 2 : 1; // 70% chance for 2 stars
        this.addStars(starsEarned);
        
        this.showMainScreen();
        
        setTimeout(() => {
            this.showMessage(`Отлично! Ты получил ${starsEarned} ⭐ за решение задачи!`);
        }, 500);
    }

    helpOtherPlayer() {
        this.stopTimer();
        this.addStars(1);
        
        this.showMainScreen();
        
        setTimeout(() => {
            this.showMessage('Молодец! Ты получил 1 ⭐ за помощь товарищу!');
        }, 500);
    }

    handleProofInput(event) {
        const text = event.target.value;
        const buttons = document.querySelectorAll('.convince-button');
        
        buttons.forEach(btn => {
            btn.disabled = text.length < GAME_CONFIG.minProofLength;
        });
    }

    convinceAlien(alienNumber) {
        if (this.convincedAliens.has(alienNumber)) return;

        const proofText = document.getElementById('proofText');
        if (!proofText || proofText.value.length < GAME_CONFIG.minProofLength) {
            this.showMessage('Нужно написать убедительное доказательство! (минимум 20 символов)');
            return;
        }

        this.convincedAliens.add(alienNumber);
        this.updateElementText('convincedCount', this.convincedAliens.size.toString());

        // Визуальное подтверждение убеждения
        const alienElement = document.querySelector(`.alien-${alienNumber}`);
        const buttonElement = document.querySelector(`[data-alien="${alienNumber}"]`);
        
        if (alienElement) {
            alienElement.style.animation = 'none';
            setTimeout(() => {
                alienElement.style.animation = 'alienFloat 3s ease-in-out infinite';
            }, 10);
        }

        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }

        // Вибрация (если доступно)
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
            Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }

        if (this.convincedAliens.size === 3) {
            this.addStars(3);
            setTimeout(() => {
                this.showMainScreen();
                this.showMessage('Превосходно! Ты убедил всех инопланетян и получил 3 ⭐!');
            }, 1500);
        }
    }

    closeTaskScreen() {
        this.stopTimer();
        this.showMainScreen();
    }

    startTimer() {
        this.timeLeft = GAME_CONFIG.timerDuration;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.showMessage('Время вышло! Возвращаемся на карту...');
                this.showMainScreen();
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
        if (progress) {
            const circumference = 283; // 2 * π * r
            const offset = circumference - (this.timeLeft / GAME_CONFIG.timerDuration) * circumference;
            progress.style.strokeDashoffset = offset;
        }
    }

    addStars(count) {
        this.player.stars += count;
        this.updateElementText('starsCount', this.player.stars.toString());
        
        // Анимация получения звезд
        this.animateStars(count);
        
        console.log(`⭐ Добавлено ${count} звезд. Всего: ${this.player.stars}`);
    }

    animateStars(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const starsDisplay = document.querySelector('.stars-display');
                if (starsDisplay) {
                    starsDisplay.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        starsDisplay.style.transform = 'scale(1)';
                    }, 300);
                }
            }, i * 200);
        }
    }

    showWinScreen() {
        this.updateElementText('finalStars', this.player.stars.toString());
        this.updateElementText('winProfession', this.player.profession);
        
        this.showScreen('winScreen');
        
        // Победоносная анимация
        this.celebrateVictory();
    }

    celebrateVictory() {
        // Вибрация победы
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) {
            Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }

        // Дополнительные анимации можно добавить здесь
        console.log('🎉 Победа! Игра завершена');
    }

    restartGame() {
        this.player.stars = 0;
        this.player.position = 0;
        this.player.hasVisited.clear();
        this.convincedAliens.clear();
        
        this.initializePlayerProfession();
        this.showMainScreen();
        
        this.showMessage('Новая космическая миссия началась! Удачи!');
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

    showMessage(message) {
        // Можно реализовать красивую систему уведомлений
        console.log(`💬 ${message}`);
        alert(message); // Временное решение
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
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
    console.log('🌌 Запуск космического приключения...');
    window.cosmicGame = new CosmicProfessionGame();
});

// Глобальные функции для отладки
window.debugGame = () => {
    console.log('Отладочная информация:', window.cosmicGame);
};

window.cheatStars = (count = 10) => {
    if (window.cosmicGame) {
        window.cosmicGame.addStars(count);
    }
};
