// Основной класс игры
class SpaceProfessionGame {
    constructor() {
        this.player = {
            name: 'Космонавт',
            profession: '',
            skill: '',
            interest: '',
            stars: 0,
            position: 0,
            avatar: '🚀'
        };
        
        this.gameBoard = [];
        this.currentScreen = 'loading';
        this.isDiceRolling = false;
        this.timerInterval = null;
        this.timeLeft = 120;
        
        this.init();
    }

    init() {
        console.log('Инициализация игры...');
        this.initializeTelegramWebApp();
        this.generateGameBoard();
        this.setupEventListeners();
        this.showLoadingScreen();
    }

    // Инициализация Telegram Web App
    initializeTelegramWebApp() {
        console.log('Инициализация Telegram Web App...');
        try {
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                
                const user = Telegram.WebApp.initDataUnsafe?.user;
                if (user) {
                    this.player.name = user.first_name || 'Космонавт';
                    this.player.avatar = this.getAvatarEmoji(user.id);
                    console.log('Пользователь Telegram:', this.player.name);
                } else {
                    console.log('Данные пользователя Telegram не доступны, используем стандартные');
                }
            } else {
                console.log('Telegram Web App не обнаружен, работаем в браузере');
                // Тестовые данные для браузера
                this.player.name = 'Тестовый Космонавт';
                this.player.avatar = '👨‍🚀';
            }
        } catch (error) {
            console.error('Ошибка инициализации Telegram:', error);
            this.player.name = 'Космонавт';
            this.player.avatar = '🚀';
        }
    }

    getAvatarEmoji(userId) {
        const emojis = ['🚀', '👨‍🚀', '👩‍🚀', '🛸', '⭐', '🌌', '🪐', '☄️'];
        return emojis[Math.abs(userId) % emojis.length] || '🚀';
    }

    // Генерация игрового поля
    generateGameBoard() {
        console.log('Генерация игрового поля...');
        this.gameBoard = generateGameBoard(15);
        console.log('Игровое поле создано:', this.gameBoard.length, 'планет');
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        console.log('Настройка обработчиков событий...');
        
        // Кнопка броска кубика
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        if (rollDiceBtn) {
            rollDiceBtn.addEventListener('click', () => this.rollDice());
            console.log('Кнопка кубика настроена');
        }

        // Кнопки заданий
        const completeTaskBtn = document.getElementById('completeTaskBtn');
        const helpOtherBtn = document.getElementById('helpOtherBtn');
        const closeTaskBtn = document.getElementById('closeTaskBtn');
        
        if (completeTaskBtn) completeTaskBtn.addEventListener('click', () => this.completeTask());
        if (helpOtherBtn) helpOtherBtn.addEventListener('click', () => this.helpOtherPlayer());
        if (closeTaskBtn) closeTaskBtn.addEventListener('click', () => this.closeTaskScreen());

        // Кнопки доказательства
        const convinceButtons = document.querySelectorAll('.convince-btn');
        convinceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.convinceAlien(parseInt(e.target.dataset.count)));
        });

        // Кнопка перезапуска
        const restartBtn = document.getElementById('restartGameBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }

        console.log('Все обработчики событий настроены');
    }

    // Показать экран загрузки
    showLoadingScreen() {
        console.log('Показ экрана загрузки...');
        this.showScreen('loadingScreen');
        
        // Анимация загрузки
        const loadingProgress = document.querySelector('.loading-progress');
        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }

        // Имитация загрузки с меньшей задержкой
        setTimeout(() => {
            console.log('Загрузка завершена, переход к настройке профессии');
            this.setupPlayerProfession();
            this.showMainScreen();
        }, 2000); // Уменьшил время загрузки
    }

    // Настройка профессии игрока
    setupPlayerProfession() {
        console.log('Настройка профессии игрока...');
        
        const randomSkill = GAME_DATA.skills[Math.floor(Math.random() * GAME_DATA.skills.length)];
        const randomInterest = GAME_DATA.interests[Math.floor(Math.random() * GAME_DATA.interests.length)];
        
        this.player.skill = randomSkill;
        this.player.interest = randomInterest;
        this.player.profession = generateProfession(randomSkill, randomInterest);
        
        console.log('Профессия создана:', {
            profession: this.player.profession,
            skill: randomSkill,
            interest: randomInterest
        });

        // Обновление интерфейса
        this.updatePlayerInfo();
    }

    // Обновление информации о игроке
    updatePlayerInfo() {
        const playerName = document.getElementById('playerName');
        const professionTitle = document.getElementById('professionTitle');
        const professionDescription = document.getElementById('professionDescription');
        const playerAvatar = document.getElementById('playerAvatar');

        if (playerName) playerName.textContent = this.player.name;
        if (professionTitle) professionTitle.textContent = this.player.profession;
        if (professionDescription) {
            professionDescription.textContent = `Навык: ${this.player.skill} | Интерес: ${this.player.interest}`;
        }
        if (playerAvatar) playerAvatar.textContent = this.player.avatar;
    }

    // Показать главный экран
    showMainScreen() {
        console.log('Переход на главный экран...');
        this.showScreen('mainScreen');
        this.renderGameBoard();
        this.updatePlayerStats();
        console.log('Главный экран отображен');
    }

    // Рендер игрового поля
    renderGameBoard() {
        console.log('Рендер игрового поля...');
        const planetPath = document.querySelector('.planet-path');
        if (!planetPath) {
            console.error('Элемент .planet-path не найден!');
            return;
        }

        planetPath.innerHTML = '';
        
        this.gameBoard.forEach(planet => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.style.left = `${(planet.position / (this.gameBoard.length - 1)) * 90 + 5}%`;
            planetElement.style.top = '50%';
            planetElement.style.transform = 'translate(-50%, -50%)';
            planetElement.innerHTML = planet.icon;
            planetElement.title = `${planet.name}\n${planet.description || ''}`;
            
            planetPath.appendChild(planetElement);
        });
        
        this.updatePlayerPosition();
        console.log('Игровое поле отрендерено');
    }

    // Обновление позиции игрока
    updatePlayerPosition() {
        const playerRocket = document.getElementById('playerRocket');
        if (!playerRocket) {
            console.error('Элемент playerRocket не найден!');
            return;
        }

        const currentPlanet = this.gameBoard[this.player.position];
        
        if (currentPlanet) {
            const left = `${(currentPlanet.position / (this.gameBoard.length - 1)) * 90 + 5}%`;
            playerRocket.style.left = left;
            playerRocket.style.top = '30%';
            console.log('Позиция игрока обновлена:', this.player.position);
        }
    }

    // Бросок кубика
    async rollDice() {
        if (this.isDiceRolling) return;
        
        console.log('Бросок кубика...');
        this.isDiceRolling = true;
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
        if (!diceBtn || !diceResult) {
            console.error('Элементы кубика не найдены!');
            this.isDiceRolling = false;
            return;
        }

        diceBtn.disabled = true;
        
        // Анимация броска
        for (let i = 0; i < 10; i++) {
            const randomNum = Math.floor(Math.random() * 6) + 1;
            diceResult.textContent = randomNum;
            await this.sleep(100);
        }
        
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = finalRoll;
        diceResult.classList.add('fade-in-up');
        
        console.log('Выпало число:', finalRoll);
        
        setTimeout(() => {
            this.movePlayer(finalRoll);
            diceResult.classList.remove('fade-in-up');
            diceBtn.disabled = false;
            this.isDiceRolling = false;
        }, 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Движение игрока
    movePlayer(steps) {
        console.log('Движение игрока на', steps, 'шагов');
        const newPosition = Math.min(this.player.position + steps, this.gameBoard.length - 1);
        this.player.position = newPosition;
        
        this.updatePlayerPosition();
        
        // Проверка достижения конечной планеты
        if (this.gameBoard[newPosition].isWin) {
            console.log('Игрок достиг финальной планеты');
            if (this.player.stars >= 10) {
                this.showWinScreen();
            } else {
                setTimeout(() => {
                    alert('Нужно собрать 10 звезд, чтобы достичь Планеты Профессий!');
                }, 500);
            }
            return;
        }
        
        // Активация задания планеты
        setTimeout(() => {
            this.activatePlanet(this.gameBoard[newPosition]);
        }, 1000);
    }

    // Активация планеты
    activatePlanet(planet) {
        console.log('Активация планеты:', planet.type, planet.name);
        
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
                console.log('Неизвестный тип планеты:', planet.type);
                this.showMainScreen();
        }
    }

    // Показать экран задания
    showTaskScreen(planet) {
        console.log('Показ экрана задания для планеты:', planet.name);
        
        const problem = getRandomProblem();
        const taskPlanetColor = document.getElementById('taskPlanetColor');
        const taskPlanetName = document.getElementById('taskPlanetName');
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');

        if (taskPlanetColor) taskPlanetColor.style.background = planet.color;
        if (taskPlanetName) taskPlanetName.textContent = planet.name;
        if (taskTitle) taskTitle.textContent = 'Космическая задача';
        if (taskDescription) {
            taskDescription.textContent = `${problem}\n\nТвоя профессия: ${this.player.profession}\n\nЗадание: Придумай, как твоя профессия может помочь!`;
        }
        
        // Настройка таймера
        this.startTimer();
        
        this.showScreen('taskScreen');
    }

    // Показать экран доказательства
    showProofScreen() {
        console.log('Показ экрана доказательства');
        
        const proofStatement = document.getElementById('proofStatement');
        const convincedCount = document.getElementById('convincedCount');
        const proofText = document.getElementById('proofText');

        if (proofStatement) proofStatement.textContent = getRandomProofTemplate(this.player.profession);
        if (convincedCount) convincedCount.textContent = '0';
        if (proofText) proofText.value = '';
        
        // Сброс кнопок убеждения
        document.querySelectorAll('.convince-btn').forEach(btn => {
            btn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            btn.disabled = false;
        });
        
        this.showScreen('proofScreen');
    }

    // Показать экран помощи
    showHelpScreen() {
        console.log('Показ экрана помощи');
        
        const helpMessage = getRandomHelpMessage();
        const taskPlanetColor = document.getElementById('taskPlanetColor');
        const taskPlanetName = document.getElementById('taskPlanetName');
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');

        if (taskPlanetColor) taskPlanetColor.style.background = GAME_DATA.planetTypes.green.color;
        if (taskPlanetName) taskPlanetName.textContent = 'Помощь другим';
        if (taskTitle) taskTitle.textContent = 'Помощь товарищу';
        if (taskDescription) taskDescription.textContent = helpMessage;
        
        this.showScreen('taskScreen');
    }

    // Показать экран события
    showEventScreen() {
        console.log('Показ экрана события');
        
        const event = getRandomEvent();
        const taskPlanetColor = document.getElementById('taskPlanetColor');
        const taskPlanetName = document.getElementById('taskPlanetName');
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');

        if (taskPlanetColor) taskPlanetColor.style.background = GAME_DATA.planetTypes.yellow.color;
        if (taskPlanetName) taskPlanetName.textContent = 'Космическое событие';
        if (taskTitle) taskTitle.textContent = event.title;
        if (taskDescription) taskDescription.textContent = event.description;
        
        // Обработка эффектов события
        if (event.type === 'positive') {
            if (event.effect.includes('+1 звезда')) {
                this.addStars(1);
            } else if (event.effect.includes('+2 звезды')) {
                this.addStars(2);
            }
        }
        
        this.showScreen('taskScreen');
    }

    // Завершение задания
    completeTask() {
        console.log('Задание завершено');
        this.stopTimer();
        
        // Награда за выполнение задания
        const starsEarned = Math.floor(Math.random() * 2) + 1; // 1-2 звезды
        this.addStars(starsEarned);
        
        this.showMainScreen();
        
        // Показ сообщения о награде
        setTimeout(() => {
            alert(`Отлично! Ты получил ${starsEarned} ⭐ за решение задачи!`);
        }, 500);
    }

    // Помощь другому игроку
    helpOtherPlayer() {
        console.log('Помощь другому игроку');
        this.stopTimer();
        this.addStars(1);
        
        this.showMainScreen();
        
        setTimeout(() => {
            alert('Молодец! Ты получил 1 ⭐ за помощь товарищу!');
        }, 500);
    }

    // Убеждение инопланетянина
    convinceAlien(count) {
        console.log('Убеждение инопланетянина №', count);
        
        const convincedCountElement = document.getElementById('convincedCount');
        if (!convincedCountElement) return;
        
        const convincedCount = parseInt(convincedCountElement.textContent);
        const newCount = convincedCount + 1;
        
        convincedCountElement.textContent = newCount;
        
        // Анимация убеждения
        const aliens = document.querySelectorAll('.convince-btn');
        if (aliens[count - 1]) {
            aliens[count - 1].style.background = 'linear-gradient(45deg, #66bb6a, #4caf50)';
            aliens[count - 1].disabled = true;
        }
        
        if (newCount === 3) {
            console.log('Все инопланетяне убеждены!');
            this.addStars(3);
            setTimeout(() => {
                this.showMainScreen();
                alert('Превосходно! Ты убедил всех и получил 3 ⭐!');
            }, 1000);
        }
    }

    // Закрытие экрана задания
    closeTaskScreen() {
        console.log('Закрытие экрана задания');
        this.stopTimer();
        this.showMainScreen();
    }

    // Таймер для заданий
    startTimer() {
        console.log('Запуск таймера');
        this.timeLeft = 120;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                alert('Время вышло! Попробуй в следующий раз.');
                this.showMainScreen();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            console.log('Таймер остановлен');
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerText = document.getElementById('timerText');
        const timerFill = document.querySelector('.timer-fill');

        if (timerText) {
            timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Обновление заполнения таймера
        if (timerFill) {
            const progress = ((120 - this.timeLeft) / 120) * 100;
            timerFill.style.background = `conic-gradient(#4caf50 ${progress}%, transparent 0%)`;
        }
    }

    // Добавление звезд
    addStars(count) {
        console.log('Добавление звезд:', count);
        this.player.stars += count;
        this.updatePlayerStats();
        
        // Проверка победы
        if (this.player.stars >= 10 && this.player.position === this.gameBoard.length - 1) {
            this.showWinScreen();
        }
    }

    // Обновление статистики игрока
    updatePlayerStats() {
        const starsCount = document.getElementById('starsCount');
        if (starsCount) {
            starsCount.textContent = this.player.stars;
        }
        console.log('Звезды обновлены:', this.player.stars);
    }

    // Показать экран победы
    showWinScreen() {
        console.log('Показ экрана победы!');
        
        const finalStars = document.getElementById('finalStars');
        const winProfession = document.getElementById('winProfession');

        if (finalStars) finalStars.textContent = this.player.stars;
        if (winProfession) winProfession.textContent = this.player.profession;
        
        this.showScreen('winScreen');
        
        // Отправка данных в Telegram
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        
        console.log('Игра завершена! Поздравляем с победой!');
    }

    // Перезапуск игры
    restartGame() {
        console.log('Перезапуск игры...');
        this.player.stars = 0;
        this.player.position = 0;
        this.generateGameBoard();
        this.setupPlayerProfession();
        this.showMainScreen();
        console.log('Игра перезапущена');
    }

    // Утилита для переключения экранов
    showScreen(screenId) {
        console.log('Переключение на экран:', screenId);
        
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            console.log('Экран переключен успешно');
        } else {
            console.error('Экран не найден:', screenId);
        }
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация игры...');
    window.spaceGame = new SpaceProfessionGame();
});

// Глобальные функции для отладки
window.debugGame = () => {
    console.log('Состояние игры:', window.spaceGame);
    console.log('Игрок:', window.spaceGame.player);
    console.log('Игровое поле:', window.spaceGame.gameBoard);
};
