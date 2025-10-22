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
        this.initializeTelegramWebApp();
        this.generateGameBoard();
        this.setupEventListeners();
        this.showLoadingScreen();
    }

    // Инициализация Telegram Web App
    initializeTelegramWebApp() {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            const user = Telegram.WebApp.initDataUnsafe?.user;
            if (user) {
                this.player.name = user.first_name || 'Космонавт';
                this.player.avatar = this.getAvatarEmoji(user.id);
            }
        }
    }

    getAvatarEmoji(userId) {
        const emojis = ['🚀', '👨‍🚀', '👩‍🚀', '🛸', '⭐', '🌌', '🪐', '☄️'];
        return emojis[userId % emojis.length] || '🚀';
    }

    // Генерация игрового поля
    generateGameBoard() {
        this.gameBoard = generateGameBoard(15);
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопка броска кубика
        document.getElementById('rollDiceBtn').addEventListener('click', () => this.rollDice());
        
        // Кнопки заданий
        document.getElementById('completeTaskBtn').addEventListener('click', () => this.completeTask());
        document.getElementById('helpOtherBtn').addEventListener('click', () => this.helpOtherPlayer());
        document.getElementById('closeTaskBtn').addEventListener('click', () => this.closeTaskScreen());
        
        // Кнопки доказательства
        document.querySelectorAll('.convince-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.convinceAlien(parseInt(e.target.dataset.count)));
        });
        
        // Кнопка перезапуска
        document.getElementById('restartGameBtn').addEventListener('click', () => this.restartGame());
    }

    // Показать экран загрузки
    showLoadingScreen() {
        this.showScreen('loadingScreen');
        
        // Имитация загрузки
        setTimeout(() => {
            this.setupPlayerProfession();
            this.showMainScreen();
        }, 3000);
    }

    // Настройка профессии игрока
    setupPlayerProfession() {
        const randomSkill = GAME_DATA.skills[Math.floor(Math.random() * GAME_DATA.skills.length)];
        const randomInterest = GAME_DATA.interests[Math.floor(Math.random() * GAME_DATA.interests.length)];
        
        this.player.skill = randomSkill;
        this.player.interest = randomInterest;
        this.player.profession = generateProfession(randomSkill, randomInterest);
        
        // Обновление интерфейса
        document.getElementById('playerName').textContent = this.player.name;
        document.getElementById('professionTitle').textContent = this.player.profession;
        document.getElementById('professionDescription').textContent = `Навык: ${randomSkill} | Интерес: ${randomInterest}`;
        document.getElementById('playerAvatar').textContent = this.player.avatar;
    }

    // Показать главный экран
    showMainScreen() {
        this.showScreen('mainScreen');
        this.renderGameBoard();
        this.updatePlayerStats();
    }

    // Рендер игрового поля
    renderGameBoard() {
        const planetPath = document.querySelector('.planet-path');
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
    }

    // Обновление позиции игрока
    updatePlayerPosition() {
        const playerRocket = document.getElementById('playerRocket');
        const currentPlanet = this.gameBoard[this.player.position];
        
        if (currentPlanet) {
            const left = `${(currentPlanet.position / (this.gameBoard.length - 1)) * 90 + 5}%`;
            playerRocket.style.left = left;
            playerRocket.style.top = '30%';
        }
    }

    // Бросок кубика
    async rollDice() {
        if (this.isDiceRolling) return;
        
        this.isDiceRolling = true;
        const diceBtn = document.getElementById('rollDiceBtn');
        const diceResult = document.getElementById('diceResult');
        
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
        const newPosition = Math.min(this.player.position + steps, this.gameBoard.length - 1);
        this.player.position = newPosition;
        
        this.updatePlayerPosition();
        
        // Проверка достижения конечной планеты
        if (this.gameBoard[newPosition].isWin) {
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
        }
    }

    // Показать экран задания
    showTaskScreen(planet) {
        const problem = getRandomProblem();
        
        document.getElementById('taskPlanetColor').style.background = planet.color;
        document.getElementById('taskPlanetName').textContent = planet.name;
        document.getElementById('taskTitle').textContent = 'Космическая задача';
        document.getElementById('taskDescription').textContent = `${problem}\n\nТвоя профессия: ${this.player.profession}\n\nЗадание: Придумай, как твоя профессия может помочь!`;
        
        // Настройка таймера
        this.startTimer();
        
        this.showScreen('taskScreen');
    }

    // Показать экран доказательства
    showProofScreen() {
        document.getElementById('proofStatement').textContent = getRandomProofTemplate(this.player.profession);
        document.getElementById('convincedCount').textContent = '0';
        document.getElementById('proofText').value = '';
        
        this.showScreen('proofScreen');
    }

    // Показать экран помощи
    showHelpScreen() {
        const helpMessage = getRandomHelpMessage();
        
        document.getElementById('taskPlanetColor').style.background = GAME_DATA.planetTypes.green.color;
        document.getElementById('taskPlanetName').textContent = 'Помощь другим';
        document.getElementById('taskTitle').textContent = 'Помощь товарищу';
        document.getElementById('taskDescription').textContent = helpMessage;
        
        this.showScreen('taskScreen');
    }

    // Показать экран события
    showEventScreen() {
        const event = getRandomEvent();
        
        document.getElementById('taskPlanetColor').style.background = GAME_DATA.planetTypes.yellow.color;
        document.getElementById('taskPlanetName').textContent = 'Космическое событие';
        document.getElementById('taskTitle').textContent = event.title;
        document.getElementById('taskDescription').textContent = event.description;
        
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
        this.stopTimer();
        this.addStars(1);
        
        this.showMainScreen();
        
        setTimeout(() => {
            alert('Молодец! Ты получил 1 ⭐ за помощь товарищу!');
        }, 500);
    }

    // Убеждение инопланетянина
    convinceAlien(count) {
        const convincedCount = parseInt(document.getElementById('convincedCount').textContent);
        const newCount = convincedCount + 1;
        
        document.getElementById('convincedCount').textContent = newCount;
        
        // Анимация убеждения
        const aliens = document.querySelectorAll('.convince-btn');
        aliens[count - 1].style.background = 'linear-gradient(45deg, #66bb6a, #4caf50)';
        aliens[count - 1].disabled = true;
        
        if (newCount === 3) {
            this.addStars(3);
            setTimeout(() => {
                this.showMainScreen();
                alert('Превосходно! Ты убедил всех и получил 3 ⭐!');
            }, 1000);
        }
    }

    // Закрытие экрана задания
    closeTaskScreen() {
        this.stopTimer();
        this.showMainScreen();
    }

    // Таймер для заданий
    startTimer() {
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
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('timerText').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Обновление заполнения таймера
        const timerFill = document.querySelector('.timer-fill');
        const progress = ((120 - this.timeLeft) / 120) * 100;
        timerFill.style.background = `conic-gradient(#4caf50 ${progress}%, transparent 0%)`;
    }

    // Добавление звезд
    addStars(count) {
        this.player.stars += count;
        this.updatePlayerStats();
        
        // Проверка победы
        if (this.player.stars >= 10 && this.player.position === this.gameBoard.length - 1) {
            this.showWinScreen();
        }
    }

    // Обновление статистики игрока
    updatePlayerStats() {
        document.getElementById('starsCount').textContent = this.player.stars;
    }

    // Показать экран победы
    showWinScreen() {
        document.getElementById('finalStars').textContent = this.player.stars;
        document.getElementById('winProfession').textContent = this.player.profession;
        this.showScreen('winScreen');
        
        // Отправка данных в Telegram
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
    }

    // Перезапуск игры
    restartGame() {
        this.player.stars = 0;
        this.player.position = 0;
        this.generateGameBoard();
        this.setupPlayerProfession();
        this.showMainScreen();
    }

    // Утилита для переключения экранов
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.spaceGame = new SpaceProfessionGame();
});

// Утилиты для анимаций
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
