// Основной игровой код для "ПУТЕШЕСТВИЕ К ПЛАНЕТЕ ПРОФЕССИЙ"

class SpaceProfessionGame {
    constructor() {
        this.player = {
            name: '',
            profession: '',
            skill: '',
            position: 0,
            stars: 0
        };
        
        this.gameBoard = generateGameBoard();
        this.currentTask = null;
        this.timer = null;
        this.timeLeft = 120; // 2 минуты на задание
        
        this.initializeEventListeners();
        this.renderGameBoard();
    }
    
    initializeEventListeners() {
        // Кнопка начала игры
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        // Кнопка броска кубика
        document.getElementById('roll-dice').addEventListener('click', () => {
            this.rollDice();
        });
        
        // Кнопка "Играть снова"
        document.getElementById('play-again').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Обработчики для кнопок заданий
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('complete-task')) {
                this.completeTask(parseInt(e.target.dataset.stars));
            } else if (e.target.classList.contains('fail-task')) {
                this.failTask();
            }
        });
    }
    
    startGame() {
        const name = document.getElementById('player-name').value.trim();
        const profession = document.getElementById('profession-name').value.trim();
        const skill = document.getElementById('main-skill').value.trim();
        
        if (!name || !profession || !skill) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        this.player = {
            name,
            profession,
            skill,
            position: 0,
            stars: 0
        };
        
        // Переключаем экран на игровое поле
        document.getElementById('game-setup').classList.remove('active');
        document.getElementById('game-board').classList.add('active');
        
        // Обновляем информацию об игроке
        this.updatePlayerInfo();
        this.renderGameBoard();
    }
    
    updatePlayerInfo() {
        document.getElementById('current-player').textContent = 
            `Игрок: ${this.player.name} (${this.player.profession})`;
        document.getElementById('stars-earned').textContent = this.player.stars;
    }
    
    renderGameBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        this.gameBoard.forEach((planet, index) => {
            const planetElement = document.createElement('div');
            planetElement.className = `planet ${planet.type}`;
            planetElement.innerHTML = `
                <div class="planet-number">${planet.number}</div>
                <div class="planet-type">${planet.name}</div>
                ${index === this.player.position ? '<div class="player-marker">🚀</div>' : ''}
            `;
            
            boardElement.appendChild(planetElement);
        });
    }
    
    rollDice() {
        // Отключаем кнопку на время броска
        const rollButton = document.getElementById('roll-dice');
        rollButton.disabled = true;
        
        // Анимация броска кубика
        const diceElement = document.getElementById('dice');
        let rolls = 0;
        const rollInterval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = randomValue;
            diceElement.style.animation = 'diceRoll 0.3s ease-out';
            
            rolls++;
            if (rolls >= 10) {
                clearInterval(rollInterval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                diceElement.textContent = finalValue;
                
                // Завершаем бросок
                setTimeout(() => {
                    this.movePlayer(finalValue);
                    rollButton.disabled = false;
                }, 500);
            }
            
            setTimeout(() => {
                diceElement.style.animation = '';
            }, 300);
        }, 100);
    }
    
    movePlayer(steps) {
        const oldPosition = this.player.position;
        const newPosition = Math.min(oldPosition + steps, this.gameBoard.length - 1);
        
        this.player.position = newPosition;
        
        // Показываем сообщение о перемещении
        document.getElementById('move-message').textContent = 
            `Вы переместились на ${steps} шагов! Теперь вы на ${this.gameBoard[newPosition].name}`;
        
        this.renderGameBoard();
        
        // Если игрок достиг финиша с достаточным количеством звезд
        if (newPosition === this.gameBoard.length - 1 && this.player.stars >= 10) {
            this.showVictoryScreen();
            return;
        }
        
        // Показываем задание для текущей планеты
        setTimeout(() => {
            this.showPlanetTask();
        }, 1500);
    }
    
    showPlanetTask() {
        const currentPlanet = this.gameBoard[this.player.position];
        const taskElement = document.getElementById('current-task');
        
        // Скрываем предыдущее задание
        taskElement.style.display = 'none';
        
        setTimeout(() => {
            let taskHTML = '';
            
            if (currentPlanet.type === 'start') {
                taskHTML = `
                    <div class="task-content">
                        <h3 class="task-title">🚀 Начало путешествия!</h3>
                        <p class="task-description">Ваше космическое путешествие начинается! Приготовьтесь к удивительным приключениям на Планете Профессий!</p>
                    </div>
                `;
            } else if (currentPlanet.type === 'finish') {
                if (this.player.stars >= 10) {
                    this.showVictoryScreen();
                    return;
                } else {
                    taskHTML = `
                        <div class="task-content">
                            <h3 class="task-title">🎯 Почти у цели!</h3>
                            <p class="task-description">Вы достигли Планеты Профессий, но вам нужно собрать еще ${10 - this.player.stars} звезд, чтобы выиграть!</p>
                            <div class="task-actions">
                                <button class="btn-secondary" onclick="game.continueFromFinish()">Продолжить сбор звезд</button>
                            </div>
                        </div>
                    `;
                }
            } else {
                switch (currentPlanet.type) {
                    case 'blue':
                        taskHTML = this.generateBluePlanetTask();
                        break;
                    case 'red':
                        taskHTML = this.generateRedPlanetTask();
                        break;
                    case 'green':
                        taskHTML = this.generateGreenPlanetTask();
                        break;
                    case 'yellow':
                        taskHTML = this.generateYellowPlanetTask();
                        break;
                }
            }
            
            taskElement.innerHTML = taskHTML;
            taskElement.style.display = 'block';
            
            // Запускаем таймер для синих планет
            if (currentPlanet.type === 'blue') {
                this.startTaskTimer();
            }
        }, 500);
    }
    
    generateBluePlanetTask() {
        const problem = getRandomProblem();
        return `
            <div class="task-content">
                <h3 class="task-title">🔵 Космическая задача</h3>
                <p class="task-description"><strong>Проблема:</strong> ${problem}</p>
                <p class="task-description"><strong>Ваша профессия:</strong> ${this.player.profession}</p>
                <p class="task-description"><strong>Задание:</strong> Придумай, как твоя профессия может помочь! Опиши или нарисуй решение.</p>
                <div class="task-timer" id="task-timer">⏱️ Осталось времени: 2:00</div>
                <div class="task-actions">
                    <button class="btn-primary complete-task" data-stars="1">Простое решение (+1⭐)</button>
                    <button class="btn-primary complete-task" data-stars="2">Оригинальное решение (+2⭐)</button>
                    <button class="btn-secondary fail-task">Не могу решить</button>
                </div>
            </div>
        `;
    }
    
    generateRedPlanetTask() {
        return `
            <div class="task-content">
                <h3 class="task-title">🔴 Доказательство полезности</h3>
                <p class="task-description"><strong>Ваша профессия:</strong> ${this.player.profession}</p>
                <p class="task-description"><strong>Задание:</strong> Убеди других игроков, что твоя профессия полезна для космонавтов!</p>
                <p class="task-description">Приготовь 3 убедительных доказательства:</p>
                <ol style="text-align: left; margin: 15px 0;">
                    <li>Как твоя профессия помогает в космосе?</li>
                    <li>Какие проблемы она решает?</li>
                    <li>Почему без нее не обойтись?</li>
                </ol>
                <div class="task-actions">
                    <button class="btn-primary complete-task" data-stars="3">Убедил всех! (+3⭐)</button>
                    <button class="btn-primary complete-task" data-stars="2">Убедил частично (+2⭐)</button>
                    <button class="btn-secondary fail-task">Нужно больше аргументов</button>
                </div>
            </div>
        `;
    }
    
    generateGreenPlanetTask() {
        return `
            <div class="task-content">
                <h3 class="task-title">🟢 Помощь другим</h3>
                <p class="task-description"><strong>Ваша профессия:</strong> ${this.player.profession}</p>
                <p class="task-description"><strong>Задание:</strong> Помоги другому игроку с его заданием!</p>
                <p class="task-description">Вы можете:</p>
                <ul style="text-align: left; margin: 15px 0;">
                    <li>Подсказать идею для его задания</li>
                    <li>Помочь нарисовать или оформить решение</li>
                    <li>Поддержать советом или ободрением</li>
                </ul>
                <div class="task-actions">
                    <button class="btn-primary complete-task" data-stars="1">Помог успешно! (+1⭐)</button>
                    <button class="btn-secondary fail-task">Не смог помочь</button>
                </div>
            </div>
        `;
    }
    
    generateYellowPlanetTask() {
        const event = getRandomEvent();
        return `
            <div class="task-content">
                <h3 class="task-title">🟡 Космическое событие</h3>
                <p class="task-description"><strong>Событие:</strong> ${event.title}</p>
                <p class="task-description">${event.description}</p>
                <div class="task-actions">
                    <button class="btn-primary complete-task" data-stars="1">Принять событие</button>
                </div>
            </div>
        `;
    }
    
    startTaskTimer() {
        this.timeLeft = 120; // 2 минуты
        const timerElement = document.getElementById('task-timer');
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            
            if (timerElement) {
                timerElement.textContent = `⏱️ Осталось времени: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                if (timerElement) {
                    timerElement.textContent = '⏰ Время вышло!';
                }
                // Автоматически завершаем задание с 0 звезд
                setTimeout(() => this.failTask(), 1000);
            }
        }, 1000);
    }
    
    completeTask(stars) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.player.stars += stars;
        this.updatePlayerInfo();
        
        // Показываем сообщение о награде
        const taskElement = document.getElementById('current-task');
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">🎉 Отлично!</h3>
                <p class="task-description">Вы получили ${stars} ⭐ за выполнение задания!</p>
                <p class="task-description">Теперь у вас ${this.player.stars} из 10 необходимых звезд.</p>
                ${this.player.stars >= 10 ? '<p class="task-description" style="color: #ffcc5c; font-weight: bold;">🎯 Вы собрали достаточно звезд! Достигайте Планеты Профессий чтобы победить!</p>' : ''}
            </div>
        `;
        
        // Проверяем победу, если игрок на финише
        if (this.player.position === this.gameBoard.length - 1 && this.player.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 2000);
        }
    }
    
    failTask() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const taskElement = document.getElementById('current-task');
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">😔 Не удалось выполнить задание</h3>
                <p class="task-description">Не расстраивайтесь! В космосе бывают разные трудности.</p>
                <p class="task-description">Попробуйте в следующий раз!</p>
            </div>
        `;
    }
    
    continueFromFinish() {
        // Возвращаем игрока на несколько шагов назад, если он на финише без достаточного количества звезд
        this.player.position = Math.max(0, this.player.position - 3);
        this.renderGameBoard();
        document.getElementById('current-task').style.display = 'none';
    }
    
    showVictoryScreen() {
        document.getElementById('game-board').classList.remove('active');
        document.getElementById('victory-screen').classList.add('active');
        
        document.getElementById('winner-name').textContent = this.player.name;
        document.getElementById('winner-profession').textContent = this.player.profession;
        document.getElementById('winner-skill').textContent = this.player.skill;
        document.getElementById('winner-stars').textContent = this.player.stars;
    }
    
    restartGame() {
        document.getElementById('victory-screen').classList.remove('active');
        document.getElementById('game-setup').classList.add('active');
        
        // Сбрасываем поля ввода
        document.getElementById('player-name').value = '';
        document.getElementById('profession-name').value = '';
        document.getElementById('main-skill').value = '';
        
        // Генерируем новое игровое поле
        this.gameBoard = generateGameBoard();
    }
}

// Инициализация игры при загрузке страницы
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new SpaceProfessionGame();
});
