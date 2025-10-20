// Основной игровой класс - полная версия
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
            currentMission: null,
            crystals: 0,
            energy: 100,
            multiplayer: {
                sessionId: null,
                isHost: false,
                players: []
            }
        };
        this.planets = [];
        this.isCreativeSolution = false;
        this.timerInterval = null;
        this.playerLevel = 1;
        this.playerXP = 0;
        this.inventory = [];
        this.skills = {};
        this.achievements = [];
        this.gameMode = 'solo'; // solo, multiplayer, creative
        this.guild = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация улучшенной космической игры...');
        this.initTelegram();
        this.createGamePlanets();
        this.bindEvents();
        this.initEnhancedSystems();
        this.startLoadingAnimation();
    }

    initTelegram() {
        if (window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            console.log('📱 Telegram WebApp инициализирован');
            
            // Устанавливаем тему Telegram
            this.setTelegramTheme();
        }
    }

    setTelegramTheme() {
        if (window.Telegram.WebApp) {
            const theme = Telegram.WebApp.colorScheme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // Устанавливаем цвет акцента из Telegram
            const accentColor = Telegram.WebApp.themeParams.accent_color;
            if (accentColor) {
                document.documentElement.style.setProperty('--accent-color', `#${accentColor.toString(16)}`);
            }
        }
    }

    initEnhancedSystems() {
        // Инициализация базы данных
        if (window.gameDatabase) {
            this.database = window.gameDatabase;
            console.log('💾 Система базы данных инициализирована');
        }

        // Инициализация системы достижений
        if (window.achievementSystem) {
            this.achievementSystem = window.achievementSystem;
            console.log('🏆 Система достижений инициализирована');
        }

        // Инициализация мультиплеера
        if (window.multiplayerSystem) {
            this.multiplayerSystem = window.multiplayerSystem;
            console.log('👥 Система мультиплеера инициализирована');
        }

        // Загрузка сохраненной игры
        this.loadSavedGame();
    }

    async loadSavedGame() {
        if (this.database) {
            try {
                const telegramId = this.getTelegramId();
                const savedData = await this.database.loadPlayerData(telegramId);
                
                if (savedData) {
                    this.loadPlayerProgress(savedData);
                    console.log('🎮 Загружен прогресс игрока:', savedData.name);
                } else {
                    console.log('🎮 Новый игрок, начинаем с начала');
                }
            } catch (error) {
                console.error('❌ Ошибка загрузки сохранения:', error);
            }
        }
    }

    loadPlayerProgress(savedData) {
        // Загружаем основные данные игрока
        if (savedData.name) {
            document.getElementById('playerName').value = savedData.name;
        }
        
        // Загружаем статистику
        this.playerLevel = savedData.level || 1;
        this.playerXP = savedData.xp || 0;
        this.gameState.stars = savedData.totalStars || 0;
        
        // Обновляем UI статистики
        this.updatePlayerStatsPreview();
    }

    getTelegramId() {
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
            return Telegram.WebApp.initDataUnsafe.user.id.toString();
        }
        return 'local_player_' + Math.random().toString(36).substr(2, 9);
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

        // Выбор режима игры
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectGameMode(card.dataset.mode);
            });
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

        // Вкладки игрового интерфейса
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchGameTab(e.target.dataset.tab);
            });
        });

        // Мультиплеер вкладки
        document.querySelectorAll('.mp-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.closest('.mp-tab').dataset.mptab;
                this.switchMultiplayerTab(tabName);
            });
        });

        // Очистка лога
        document.getElementById('clearLog').addEventListener('click', () => {
            this.clearLog();
        });

        // Перезапуск игры
        document.getElementById('restartGame').addEventListener('click', () => {
            this.restartGame();
        });

        // Меню игры
        document.getElementById('gameMenuBtn').addEventListener('click', () => {
            this.showGameMenu();
        });

        // Плавающие labels
        const floatingInput = document.getElementById('playerName');
        if (floatingInput) {
            floatingInput.addEventListener('input', this.handleFloatingLabel.bind(this));
            floatingInput.addEventListener('focus', this.handleFloatingLabel.bind(this));
            floatingInput.addEventListener('blur', this.handleFloatingLabel.bind(this));
        }

        // Динамическое обновление профессии
        document.getElementById('mainSkill').addEventListener('change', () => {
            this.updateProfessionPreview();
        });

        document.getElementById('interestArea').addEventListener('change', () => {
            this.updateProfessionPreview();
        });

        console.log('✅ Все события успешно привязаны');
    }

    handleFloatingLabel(event) {
        const input = event.target;
        const label = input.nextElementSibling;
        if (input.value && input.value.trim() !== '' || event.type === 'focus') {
            label.classList.add('filled');
        } else if (event.type === 'blur' && !input.value.trim()) {
            label.classList.remove('filled');
        }
    }

    startLoadingAnimation() {
        let progress = 0;
        const progressFill = document.getElementById('loadingProgress');
        const progressText = document.querySelector('.progress-text');
        
        const tips = [
            "💡 Объединяйте необычные навыки для создания уникальных профессий!",
            "🌌 Исследуйте все планеты чтобы открыть особые достижения",
            "👥 В мультиплеере можно помогать другим игрокам",
            "🎯 Креативные решения приносят больше звезд",
            "⚡ Используйте энергию wisely для особых действий"
        ];
        
        const tipElement = document.querySelector('.loading-tips .tip');
        
        const interval = setInterval(() => {
            progress += 2;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            // Меняем подсказки каждые 20%
            if (progress % 20 === 0) {
                const randomTip = tips[Math.floor(Math.random() * tips.length)];
                if (tipElement) {
                    tipElement.textContent = randomTip;
                }
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showScreen('modeScreen');
                    this.updatePlayerStatsPreview();
                }, 500);
            }
        }, 40);
    }

    updatePlayerStatsPreview() {
        // В реальной игре здесь будут данные из базы
        document.getElementById('totalGames').textContent = '0';
        document.getElementById('totalStars').textContent = this.gameState.stars.toString();
        document.getElementById('achievementsCount').textContent = '0';
        document.getElementById('uniqueProfessions').textContent = '0';
    }

    selectGameMode(mode) {
        this.gameMode = mode;
        
        // Обновляем UI выбранного режима
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('selected');
        
        console.log(`🎮 Выбран режим: ${mode}`);
        
        // Показываем экран создания персонажа
        setTimeout(() => {
            this.showScreen('characterScreen');
        }, 500);
    }

    updateProfessionPreview() {
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;
        
        if (skill && interest) {
            const profession = this.generateEnhancedProfession(skill, interest);
            
            // Обновляем превью
            document.getElementById('previewProfessionName').textContent = profession.fullName;
            
            // Обновляем статистики
            this.updateStatBars(profession.stats);
        }
    }

    updateStatBars(stats) {
        Object.keys(stats).forEach(stat => {
            const fillElement = document.querySelector(`[data-stat="${stat}"]`);
            if (fillElement) {
                fillElement.style.width = `${stats[stat]}%`;
            }
        });
    }

    generateEnhancedProfession(skill, interest, specialization = null) {
        const baseProfession = GameUtils.generateProfession(skill, interest);
        
        // Добавляем расширенные характеристики
        const stats = {
            creativity: this.calculateStat('creativity', skill, interest),
            technology: this.calculateStat('technology', skill, interest),
            communication: this.calculateStat('communication', skill, interest),
            research: this.calculateStat('research', skill, interest)
        };

        // Генерируем уникальные способности
        const abilities = this.generateAbilities(skill, interest);

        return {
            ...baseProfession,
            stats: stats,
            abilities: abilities,
            level: 1,
            xp: 0,
            specialization: specialization
        };
    }

    calculateStat(stat, skill, interest) {
        const skillModifiers = {
            'рисование': { creativity: 80, technology: 20, communication: 40, research: 30 },
            'программирование': { creativity: 40, technology: 90, communication: 30, research: 60 },
            'помощь другим': { creativity: 30, technology: 20, communication: 85, research: 25 },
            'исследования': { creativity: 35, technology: 40, communication: 30, research: 90 },
            'творчество': { creativity: 85, technology: 25, communication: 45, research: 35 },
            'организация': { creativity: 30, technology: 35, communication: 75, research: 40 }
        };

        const interestModifiers = {
            'животные': { creativity: 20, technology: 10, communication: 60, research: 50 },
            'технологии': { creativity: 30, technology: 80, communication: 20, research: 60 },
            'искусство': { creativity: 85, technology: 15, communication: 40, research: 20 },
            'природа': { creativity: 45, technology: 20, communication: 30, research: 65 },
            'космос': { creativity: 35, technology: 50, communication: 25, research: 70 },
            'музыка': { creativity: 75, technology: 25, communication: 55, research: 15 }
        };

        const skillStats = skillModifiers[skill] || { creativity: 50, technology: 50, communication: 50, research: 50 };
        const interestStats = interestModifiers[interest] || { creativity: 50, technology: 50, communication: 50, research: 50 };
        
        // Усредняем показатели навыка и интереса
        return Math.round((skillStats[stat] + interestStats[stat]) / 2);
    }

    generateAbilities(skill, interest) {
        const abilities = [];
        
        // Базовая способность для всех профессий
        abilities.push({
            id: 'cosmic_intuition',
            name: 'Космическая интуиция',
            description: 'Позволяет находить нестандартные решения в сложных ситуациях',
            effect: 'creative_bonus',
            value: 15,
            cooldown: 3,
            icon: '💫'
        });

        // Специальные способности в зависимости от комбинации
        const combination = `${skill}_${interest}`;
        
        const specialAbilities = {
            'рисование_технологии': {
                name: 'Голографический дизайн',
                description: 'Создание 3D моделей и проекций в космическом пространстве',
                effect: 'tech_boost',
                value: 25,
                icon: '👨‍🎨'
            },
            'программирование_искусство': {
                name: 'Алгоритмическое творчество',
                description: 'Создание произведений искусства с помощью кода',
                effect: 'creative_tech',
                value: 20,
                icon: '🎨'
            },
            'помощь другим_животные': {
                name: 'Зоокоммуникация',
                description: 'Понимание и взаимодействие с космическими существами',
                effect: 'animal_bond',
                value: 30,
                icon: '🐾'
            },
            'исследования_космос': {
                name: 'Астрологический анализ',
                description: 'Глубокое понимание космических явлений и законов',
                effect: 'research_boost',
                value: 35,
                icon: '🔭'
            }
        };

        if (specialAbilities[combination]) {
            abilities.push({
                id: combination,
                ...specialAbilities[combination]
            });
        }

        return abilities;
    }

    generatePlayerProfession() {
        const name = document.getElementById('playerName').value.trim();
        const skill = document.getElementById('mainSkill').value;
        const interest = document.getElementById('interestArea').value;

        console.log('📝 Данные формы:', { name, skill, interest });

        if (!name) {
            this.showNotification('Введите имя космонавта!', 'error');
            return;
        }

        if (!skill) {
            this.showNotification('Выберите главный навык!', 'error');
            return;
        }

        if (!interest) {
            this.showNotification('Выберите сферу интересов!', 'error');
            return;
        }

        // Генерация улучшенной профессии
        const profession = this.generateEnhancedProfession(skill, interest);
        
        this.player = {
            name: name,
            profession: profession,
            skill: skill,
            interest: interest,
            telegramId: this.getTelegramId(),
            created: new Date().toISOString()
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

        this.showNotification(`Профессия "${profession.fullName}" создана!`, 'success');
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
            'музика': '🎵 Музыкальность'
        };
        return names[interest] || interest;
    }

    startGame() {
        if (!this.player) {
            this.showNotification('Сначала создайте персонажа!', 'error');
            return;
        }

        console.log('🎮 Начало игры для:', this.player.name);
        
        this.gameState.startTime = new Date();
        this.gameState.currentPosition = -1;
        
        // Инициализация мультиплеера если выбран этот режим
        if (this.gameMode === 'multiplayer') {
            this.initializeMultiplayer();
        }

        this.updateGameDisplay();
        this.showScreen('gameScreen');
        
        // Даем время для отрисовки DOM
        setTimeout(() => {
            this.renderGameMap();
        }, 100);
        
        this.addLogMessage(`🚀 КОСМИЧЕСКИЙ СТАРТ! Корабль "${this.player.name}" начал путешествие!`);
        this.addLogMessage(`🎯 Ваша миссия: стать первым ${this.player.profession.fullName} во вселенной!`);
        this.addLogMessage(`🌌 Режим игры: ${this.getGameModeText()}`);
        this.addLogMessage(`⭐ Соберите 10 звезд полезности, чтобы достичь цели.`);
        
        // Сохраняем начало игры
        this.saveGameProgress();
        
        this.showNotification('Путешествие началось! Бросьте кубик для первого хода.', 'success');
    }

    getGameModeText() {
        const modes = {
            'solo': 'Одиночное путешествие',
            'multiplayer': 'Мультиплеер',
            'creative': 'Творческий режим'
        };
        return modes[this.gameMode] || 'Одиночная игра';
    }

    initializeMultiplayer() {
        if (this.multiplayerSystem) {
            // Здесь будет инициализация мультиплеер сессии
            console.log('👥 Инициализация мультиплеера...');
        }
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
            planetElement.setAttribute('data-planet-id', planet.id);
            
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
        // Проверяем энергию
        if (this.gameState.energy < 10) {
            this.showNotification('Недостаточно энергии! Подождите восстановления.', 'error');
            return;
        }

        const diceBtn = document.getElementById('rollDice');
        diceBtn.disabled = true;

        console.log('🎲 Бросок космического кубика...');

        // Тратим энергию
        this.gameState.energy -= 10;
        this.updateGameDisplay();

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
        
        // Восстановление энергии
        this.startEnergyRecovery();
    }

    startEnergyRecovery() {
        // Энергия восстанавливается со временем
        const recoveryInterval = setInterval(() => {
            if (this.gameState.energy < 100) {
                this.gameState.energy += 5;
                if (this.gameState.energy > 100) this.gameState.energy = 100;
                this.updateGameDisplay();
            } else {
                clearInterval(recoveryInterval);
            }
        }, 30000); // +5 энергии каждые 30 секунд
    }

    arriveAtPlanet() {
        const currentPlanet = this.planets[this.gameState.currentPosition];
        
        console.log('🪐 Прибытие на планету:', currentPlanet);
        
        this.addLogMessage(`🪐 ПРИБЫТИЕ НА ПЛАНЕТУ: ${currentPlanet.name}`);
        this.addLogMessage(`📖 ${currentPlanet.description}`);

        // Добавляем планету в посещенные
        if (!this.gameState.visitedPlanets.includes(currentPlanet.id)) {
            this.gameState.visitedPlanets.push(currentPlanet.id);
            
            // Награда за открытие новой планеты
            this.gameState.crystals += 10;
            this.addLogMessage(`💎 Найдено 10 космических кристаллов!`);
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
        
        document.getElementById('missionTypeBadge').innerHTML = `
            <span id="missionTypeIcon">${mission.icon || '🌌'}</span>
            <span id="missionTypeText">${mission.name}</span>
        `;
        document.getElementById('missionTypeBadge').className = `mission-type-badge ${mission.color}`;
        
        document.getElementById('missionText').textContent = mission.text;
        document.getElementById('missionProfession').textContent = this.player.profession.fullName;

        // Сброс таймера и поля ввода
        document.getElementById('missionTimer').textContent = GameUtils.formatTime(mission.time);
        document.getElementById('solutionInput').style.display = 'none';
        document.getElementById('solutionText').value = '';
        document.getElementById('timerFill').style.width = '100%';

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
                
                // Меняем цвет при малом времени
                if (this.timerSeconds <= 30) {
                    timerFill.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
                } else if (this.timerSeconds <= 60) {
                    timerFill.style.background = 'linear-gradient(135deg, #ffd93d 0%, #ff9a3d 100%)';
                }
            }
            
            if (this.timerSeconds <= 0) {
                clearInterval(this.timerInterval);
                this.timeOutMission();
            }
        }, 1000);
    }

    timeOutMission() {
        this.addLogMessage('⏰ Время вышло! Задание не выполнено.');
        this.showNotification('Время вышло! Попробуйте в следующий раз.', 'error');
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
            this.showNotification('Креативное решение! Возможность получить больше звезд!', 'success');
        }
    }

    hideSolutionInput() {
        document.getElementById('solutionInput').style.display = 'none';
        document.getElementById('solutionText').value = '';
    }

    async completeMission() {
        const solution = document.getElementById('solutionText').value.trim();
        
        if (!solution) {
            this.showNotification('Опишите ваше решение!', 'error');
            return;
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const currentPlanet = this.planets[this.gameState.currentPosition];
        let starsEarned = await this.calculateMissionReward(currentPlanet);
        
        // Добавляем опыт
        this.addXP(starsEarned * 10);

        this.gameState.stars += starsEarned;

        this.addLogMessage(`⭐ Получено звезд: ${starsEarned}`);
        this.addLogMessage(`📊 Всего звезд: ${this.gameState.stars}/10`);

        // Обновляем прогресс-кольцо
        this.updateProgressRing();

        this.showNotification(`Получено ${starsEarned} ⭐! Всего: ${this.gameState.stars}/10`, 'success');

        // Проверка достижений
        this.checkAchievements();

        // Сохраняем прогресс
        await this.saveGameProgress(starsEarned);

        // Проверка победы
        if (this.gameState.stars >= 10) {
            setTimeout(() => this.showVictoryScreen(), 1500);
        } else {
            setTimeout(() => this.showScreen('gameScreen'), 1000);
        }
    }

    async calculateMissionReward(planet) {
        let baseStars = this.isCreativeSolution ? 2 : 1;

        // Бонусы за характеристики профессии
        const creativityBonus = Math.floor(this.player.profession.stats.creativity / 25);
        baseStars += creativityBonus;

        // Бонусы за тип планеты
        if (planet.type === 'red') {
            baseStars += 1;
            this.addLogMessage('💬 Убедительное доказательство! +1 звезда');
        }
        
        if (planet.type === 'green') {
            baseStars += 1;
            this.addLogMessage('🤝 Отличная помощь! +1 звезда');
        }

        // Бонус за уровень игрока
        const levelBonus = Math.floor(this.playerLevel / 3);
        baseStars += levelBonus;

        // Случайный бонус (шанс 30%)
        if (Math.random() < 0.3) {
            baseStars += 1;
            this.addLogMessage('🎁 Удачный бонус! +1 звезда');
        }

        return Math.min(baseStars, 5); // Максимум 5 звезд за задание
    }

    addXP(amount) {
        this.playerXP += amount;
        
        const neededXP = this.getXPForLevel(this.playerLevel);
        if (this.playerXP >= neededXP) {
            this.levelUp();
        }

        this.updateGameDisplay();
    }

    getXPForLevel(level) {
        return level * 100; // Простая формула: 100 XP за уровень
    }

    levelUp() {
        this.playerLevel++;
        const oldXP = this.playerXP;
        this.playerXP = 0;

        this.addLogMessage(`🎉 Поздравляем! Вы достигли ${this.playerLevel} уровня!`);
        this.showLevelUpAnimation();
        
        // Награда за уровень
        this.gameState.crystals += this.playerLevel * 5;
        this.addLogMessage(`💎 Получено ${this.playerLevel * 5} космических кристаллов!`);

        // Разблокировка новых возможностей
        this.unlockLevelFeatures();
    }

    showLevelUpAnimation() {
        const animation = document.createElement('div');
        animation.className = 'level-up-animation';
        animation.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">📈</div>
                <div class="level-up-text">Уровень ${this.playerLevel}!</div>
                <div class="level-up-glow"></div>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            animation.classList.remove('show');
            setTimeout(() => animation.remove(), 500);
        }, 3000);
    }

    unlockLevelFeatures() {
        const unlocks = {
            2: '🎒 Открыта система инвентаря',
            3: '🔧 Доступны улучшения профессии',
            5: '👥 Открыт мультиплеер',
            8: '🚀 Доступны особые задания'
        };

        if (unlocks[this.playerLevel]) {
            this.addLogMessage(`🔓 ${unlocks[this.playerLevel]}`);
            this.showNotification(unlocks[this.playerLevel], 'success');
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
            this.showNotification('Соберите больше звезд для достижения Планеты Профессий!', 'info');
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
        
        // Показываем анимацию конфетти
        if (window.GameAnimations) {
            GameAnimations.createConfetti();
        }
        
        this.showScreen('victoryScreen');
        this.addLogMessage('🎉 КОСМИЧЕСКАЯ ПОБЕДА! Вы достигли Планеты Профессий!');
        
        // Сохраняем статистику победы
        this.saveVictoryStats();
        
        this.showNotification('Поздравляем с победой! Вы стали настоящим космическим специалистом!', 'success');
    }

    async saveVictoryStats() {
        if (this.database) {
            const playerData = {
                telegramId: this.getTelegramId(),
                name: this.player.name,
                totalGames: 1,
                totalStars: this.gameState.stars,
                level: this.playerLevel,
                currentProfession: this.player.profession,
                uniqueProfessions: [this.player.profession],
                victories: 1,
                totalPlayTime: Math.floor((new Date() - this.gameState.startTime) / 1000),
                lastPlayed: new Date().toISOString()
            };

            await this.database.savePlayerData(playerData);
        }
    }

    checkAchievements() {
        if (this.achievementSystem) {
            const playerData = {
                totalGames: 1,
                visitedPlanets: this.gameState.visitedPlanets,
                professionsCreated: 1,
                uniqueProfessions: 1,
                currentProfession: this.player.profession,
                totalStars: this.gameState.stars,
                level: this.playerLevel,
                // ... другие данные для проверки достижений
            };

            const newAchievements = this.achievementSystem.checkAchievements(playerData);
            if (newAchievements.length > 0) {
                console.log('🏆 Получены новые достижения:', newAchievements.length);
            }
        }
    }

    switchGameTab(tabName) {
        // Обновляем активные кнопки вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Показываем соответствующий контент
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Загружаем контент вкладки если нужно
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'inventory':
                this.loadInventoryTab();
                break;
            case 'skills':
                this.loadSkillsTab();
                break;
            case 'multiplayer':
                this.loadMultiplayerTab();
                break;
            case 'achievements':
                this.loadAchievementsTab();
                break;
        }
    }

    loadInventoryTab() {
        const inventoryContainer = document.getElementById('tab-inventory');
        if (!inventoryContainer) return;

        inventoryContainer.innerHTML = `
            <div class="inventory-header">
                <h3>🎒 Космический Инвентарь</h3>
                <div class="inventory-stats">
                    <span>💎 Кристаллы: ${this.gameState.crystals}</span>
                    <span>⚡ Энергия: ${this.gameState.energy}/100</span>
                </div>
            </div>
            <div class="inventory-grid">
                ${this.generateInventoryItems()}
            </div>
            <div class="inventory-shop">
                <h4>🛒 Космический Магазин</h4>
                <div class="shop-items">
                    <div class="shop-item">
                        <div class="item-icon">⚡</div>
                        <div class="item-info">
                            <div class="item-name">Энергетический концентрат</div>
                            <div class="item-description">+25 энергии</div>
                        </div>
                        <button class="btn btn-primary buy-btn" data-item="energy">💎 15</button>
                    </div>
                    <div class="shop-item">
                        <div class="item-icon">🎲</div>
                        <div class="item-info">
                            <div class="item-name">Удачный кубик</div>
                            <div class="item-description">Гарантирует выпадение 4-6</div>
                        </div>
                        <button class="btn btn-primary buy-btn" data-item="lucky_dice">💎 30</button>
                    </div>
                </div>
            </div>
        `;

        // Добавляем обработчики для кнопок покупки
        inventoryContainer.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.buyItem(e.target.dataset.item);
            });
        });
    }

    generateInventoryItems() {
        if (this.inventory.length === 0) {
            return `
                <div class="empty-inventory">
                    <div class="empty-icon">🎒</div>
                    <p>Инвентарь пуст</p>
                    <p class="empty-hint">Приобретайте предметы в магазине!</p>
                </div>
            `;
        }

        return this.inventory.map(item => `
            <div class="inventory-item ${item.isActive ? 'active' : ''}">
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-description">${item.description}</div>
                </div>
                <div class="item-actions">
                    ${item.isActive ? 
                        '<button class="btn btn-secondary deactivate-btn">Выкл</button>' : 
                        '<button class="btn btn-primary activate-btn">Вкл</button>'
                    }
                </div>
            </div>
        `).join('');
    }

    buyItem(itemId) {
        const prices = {
            'energy': 15,
            'lucky_dice': 30
        };

        const price = prices[itemId];
        if (!price) return;

        if (this.gameState.crystals >= price) {
            this.gameState.crystals -= price;
            
            const newItem = {
                id: itemId,
                name: this.getItemName(itemId),
                description: this.getItemDescription(itemId),
                icon: this.getItemIcon(itemId),
                isActive: false,
                purchased: new Date().toISOString()
            };

            this.inventory.push(newItem);
            this.updateGameDisplay();
            this.loadInventoryTab(); // Перезагружаем вкладку
            
            this.addLogMessage(`🛒 Куплен предмет: ${newItem.name}`);
            this.showNotification(`Предмет "${newItem.name}" добавлен в инвентарь!`, 'success');
        } else {
            this.showNotification('Недостаточно кристаллов!', 'error');
        }
    }

    getItemName(itemId) {
        const names = {
            'energy': 'Энергетический концентрат',
            'lucky_dice': 'Удачный кубик'
        };
        return names[itemId] || 'Предмет';
    }

    getItemDescription(itemId) {
        const descriptions = {
            'energy': 'Восстанавливает 25 единиц энергии',
            'lucky_dice': 'Следующий бросок кубика будет удачным'
        };
        return descriptions[itemId] || 'Описание предмета';
    }

    getItemIcon(itemId) {
        const icons = {
            'energy': '⚡',
            'lucky_dice': '🎲'
        };
        return icons[itemId] || '📦';
    }

    loadSkillsTab() {
        const skillsContainer = document.getElementById('tab-skills');
        if (!skillsContainer) return;

        skillsContainer.innerHTML = `
            <div class="skills-header">
                <h3>🎯 Навыки и Умения</h3>
                <div class="skills-progress">
                    <span>Уровень: ${this.playerLevel}</span>
                    <span>Опыт: ${this.playerXP}/${this.getXPForLevel(this.playerLevel)}</span>
                </div>
            </div>
            <div class="skills-tree">
                <div class="skill-category">
                    <h4>💫 Профессиональные навыки</h4>
                    ${this.generateProfessionSkills()}
                </div>
                <div class="skill-category">
                    <h4>🚀 Космические умения</h4>
                    ${this.generateCosmicSkills()}
                </div>
            </div>
        `;
    }

    generateProfessionSkills() {
        const skills = this.player.profession.abilities || [];
        return skills.map(ability => `
            <div class="skill-item unlocked">
                <div class="skill-icon">${ability.icon}</div>
                <div class="skill-info">
                    <div class="skill-name">${ability.name}</div>
                    <div class="skill-description">${ability.description}</div>
                </div>
                <div class="skill-level">Ур. 1</div>
            </div>
        `).join('');
    }

    generateCosmicSkills() {
        const cosmicSkills = [
            { name: 'Космическая навигация', description: 'Увеличивает дальность движения', level: 1, maxLevel: 5, icon: '🧭' },
            { name: 'Планетарная адаптация', description: 'Ускоряет выполнение заданий', level: 1, maxLevel: 3, icon: '🌍' },
            { name: 'Звездная интуиция', description: 'Повышает шанс бонусов', level: 1, maxLevel: 4, icon: '🔮' }
        ];

        return cosmicSkills.map(skill => `
            <div class="skill-item ${skill.level > 0 ? 'unlocked' : 'locked'}">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-description">${skill.description}</div>
                </div>
                <div class="skill-level">Ур. ${skill.level}/${skill.maxLevel}</div>
                ${skill.level < skill.maxLevel ? 
                    `<button class="btn btn-primary upgrade-btn" data-skill="${skill.name}">💎 50</button>` : 
                    '<div class="skill-max">Макс.</div>'
                }
            </div>
        `).join('');
    }

    loadMultiplayerTab() {
        const multiplayerContainer = document.getElementById('tab-multiplayer');
        if (!multiplayerContainer) return;

        multiplayerContainer.innerHTML = `
            <div class="multiplayer-lobby">
                <div class="mp-header">
                    <h3>👥 Космическое Сотрудничество</h3>
                    <button class="btn btn-primary" onclick="game.showScreen('multiplayerScreen')">
                        Открыть мультиплеер
                    </button>
                </div>
                <div class="mp-status">
                    <p>Режим: ${this.getGameModeText()}</p>
                    <p>Для игры с друзьями перейдите в раздел мультиплеера</p>
                </div>
            </div>
        `;
    }

    loadAchievementsTab() {
        const achievementsContainer = document.getElementById('tab-achievements');
        if (!achievementsContainer) return;

        achievementsContainer.innerHTML = `
            <div class="achievements-preview">
                <h3>🏆 Достижения</h3>
                <p>Откройте полный список достижений в специальном разделе</p>
                <button class="btn btn-primary" onclick="game.showScreen('achievementsScreen')">
                    Показать все достижения
                </button>
            </div>
        `;
    }

    switchMultiplayerTab(tabName) {
        if (this.multiplayerSystem) {
            this.multiplayerSystem.switchMultiplayerTab(tabName);
        }
    }

    showGameMenu() {
        const menuHTML = `
            <div class="game-menu">
                <div class="menu-header">
                    <h3>⚙️ Меню игры</h3>
                </div>
                <div class="menu-items">
                    <button class="menu-item" onclick="game.saveGameProgress()">
                        <span class="menu-icon">💾</span>
                        <span>Сохранить игру</span>
                    </button>
                    <button class="menu-item" onclick="game.showScreen('achievementsScreen')">
                        <span class="menu-icon">🏆</span>
                        <span>Достижения</span>
                    </button>
                    <button class="menu-item" onclick="game.showScreen('multiplayerScreen')">
                        <span class="menu-icon">👥</span>
                        <span>Мультиплеер</span>
                    </button>
                    <button class="menu-item" onclick="game.showSettings()">
                        <span class="menu-icon">⚙️</span>
                        <span>Настройки</span>
                    </button>
                    <button class="menu-item" onclick="game.restartGame()">
                        <span class="menu-icon">🔄</span>
                        <span>Начать заново</span>
                    </button>
                </div>
                <div class="menu-footer">
                    <button class="btn btn-secondary" onclick="game.hideGameMenu()">Закрыть</button>
                </div>
            </div>
        `;

        this.showModal(menuHTML);
    }

    hideGameMenu() {
        this.hideModal();
    }

    showSettings() {
        const settingsHTML = `
            <div class="settings-menu">
                <div class="menu-header">
                    <h3>⚙️ Настройки</h3>
                </div>
                <div class="settings-items">
                    <div class="setting-item">
                        <label>Звуковые эффекты</label>
                        <input type="checkbox" checked>
                    </div>
                    <div class="setting-item">
                        <label>Анимации</label>
                        <input type="checkbox" checked>
                    </div>
                    <div class="setting-item">
                        <label>Уведомления</label>
                        <input type="checkbox" checked>
                    </div>
                </div>
                <div class="menu-footer">
                    <button class="btn btn-primary" onclick="game.hideModal()">Сохранить</button>
                    <button class="btn btn-secondary" onclick="game.hideModal()">Отмена</button>
                </div>
            </div>
        `;

        this.showModal(settingsHTML);
    }

    showModal(content) {
        const overlay = document.getElementById('modalOverlay');
        const modalContent = document.querySelector('.modal-content');
        
        if (overlay && modalContent) {
            modalContent.innerHTML = content;
            overlay.style.display = 'flex';
            
            // Анимация появления
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }
    }

    hideModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    updateGameDisplay() {
        if (this.player) {
            document.getElementById('currentPlayerName').textContent = this.player.name;
            document.getElementById('currentProfession').textContent = this.player.profession.fullName;
            document.getElementById('starsCount').textContent = this.gameState.stars;
            document.getElementById('playerLevel').textContent = this.playerLevel;
            document.getElementById('crystalsCount').textContent = this.gameState.crystals;
            document.getElementById('energyCount').textContent = this.gameState.energy;
            
            // Обновляем прогресс-кольцо
            this.updateProgressRing();

            // Обновляем текст режима игры
            const modeElement = document.getElementById('gameModeText');
            if (modeElement) {
                modeElement.textContent = this.getGameModeText();
            }
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
        messageElement.innerHTML = `
            <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
            <span class="log-text">${message}</span>
        `;
        
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

    async saveGameProgress(starsEarned = 0) {
        const saveData = {
            playerId: this.getTelegramId(),
            gameState: this.gameState,
            player: this.player,
            inventory: this.inventory,
            skills: this.skills,
            level: this.playerLevel,
            xp: this.playerXP,
            timestamp: new Date().toISOString(),
            starsEarned: starsEarned
        };

        if (this.database) {
            try {
                await this.database.saveGame(saveData);
                
                // Также обновляем общую статистику игрока
                await this.updatePlayerStats();
                
                this.showNotification('Игра сохранена!', 'success');
            } catch (error) {
                console.error('❌ Ошибка сохранения:', error);
                this.showNotification('Ошибка сохранения игры', 'error');
            }
        } else {
            // Резервное сохранение в localStorage
            localStorage.setItem('cosmic_game_save', JSON.stringify(saveData));
            this.showNotification('Игра сохранена локально', 'info');
        }
    }

    async updatePlayerStats() {
        const playerData = {
            telegramId: this.getTelegramId(),
            name: this.player.name,
            totalGames: 1,
            totalStars: this.gameState.stars,
            level: this.playerLevel,
            currentProfession: this.player.profession,
            uniqueProfessions: [this.player.profession],
            lastPlayed: new Date().toISOString()
        };

        if (this.database) {
            await this.database.savePlayerData(playerData);
        }
    }

    showScreen(screenName) {
        console.log('🔄 Переход на экран:', screenName);
        
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Скрываем модальные окна
        this.hideModal();

        // Показываем нужный экран
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('✅ Экран показан:', screenName);
        } else {
            console.error('❌ Экран не найден:', screenName);
        }

        // Специальные действия при переключении экранов
        switch (screenName) {
            case 'gameScreen':
                setTimeout(() => {
                    this.updatePlayerPosition();
                    this.loadTabContent('map'); // Загружаем вкладку карты по умолчанию
                }, 200);
                break;
            case 'multiplayerScreen':
                if (this.multiplayerSystem) {
                    this.multiplayerSystem.updateMultiplayerContent('lobby');
                }
                break;
            case 'achievementsScreen':
                this.loadAchievementsScreen();
                break;
        }
    }

    loadAchievementsScreen() {
        if (this.achievementSystem) {
            const stats = this.achievementSystem.getAchievementsStats();
            document.getElementById('achievementsCompleted').textContent = stats.unlocked;
            
            const progress = document.getElementById('achievementsProgress');
            if (progress) {
                progress.style.width = `${stats.completion}%`;
            }
        }
    }

    showNotification(message, type = 'info') {
        if (window.GameUtils && GameUtils.showNotification) {
            GameUtils.showNotification(message, type);
        } else {
            // Простая реализация уведомления
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    restartGame() {
        console.log('🔄 Перезапуск игры...');
        
        const confirmRestart = confirm('Вы уверены, что хотите начать новую игру? Текущий прогресс будет сохранен.');
        if (!confirmRestart) return;

        // Сохраняем текущую игру перед перезапуском
        this.saveGameProgress();

        // Сбрасываем состояние игры
        this.player = null;
        this.gameState = {
            currentPosition: -1,
            stars: 0,
            visitedPlanets: [],
            gameLog: [],
            startTime: null,
            currentMission: null,
            crystals: 0,
            energy: 100,
            multiplayer: {
                sessionId: null,
                isHost: false,
                players: []
            }
        };
        
        this.playerLevel = 1;
        this.playerXP = 0;
        this.inventory = [];
        this.isCreativeSolution = false;

        // Останавливаем таймер если активен
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

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

        // Показываем экран выбора режима
        this.showScreen('modeScreen');
        this.showNotification('Новая игра начата! Создайте нового космического специалиста.', 'info');
    }
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запуск улучшенной космической игры...');
    window.game = new CosmicProfessionGame();
});

// Вспомогательные CSS анимации
const enhancedStyles = `
@keyframes levelUp {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
    100% { transform: scale(1) rotate(360deg); opacity: 1; }
}

.level-up-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.level-up-animation.show {
    opacity: 1;
}

.level-up-content {
    background: linear-gradient(135deg, rgba(255, 217, 61, 0.9) 0%, rgba(255, 154, 61, 0.9) 100%);
    border-radius: 20px;
    padding: 30px 40px;
    text-align: center;
    color: #333;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    animation: levelUp 1s ease-out;
}

.level-up-icon {
    font-size: 3em;
    margin-bottom: 10px;
}

.level-up-text {
    font-size: 1.5em;
    font-family: 'Orbitron', sans-serif;
}

.level-up-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    animation: rotate 3s linear infinite;
}

/* Стили для модальных окон */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-overlay.show {
    opacity: 1;
}

.modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    padding: 0;
    max-width: 90%;
    max-height: 80%;
    overflow: auto;
    border: 2px solid rgba(102, 126, 234, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal-overlay.show .modal-content {
    transform: scale(1);
}

.game-menu, .settings-menu {
    padding: 20px;
}

.menu-header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    text-align: left;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(5px);
}

.menu-icon {
    font-size: 1.2em;
    width: 30px;
    text-align: center;
}

.menu-footer {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.settings-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.setting-item label {
    font-weight: 600;
}

/* Стили для инвентаря */
.inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.inventory-stats {
    display: flex;
    gap: 20px;
    font-weight: bold;
}

.inventory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.inventory-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    transition: all 0.3s ease;
}

.inventory-item.active {
    border-color: rgba(86, 171, 47, 0.5);
    background: rgba(86, 171, 47, 0.1);
}

.inventory-item:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
}

.item-icon {
    font-size: 1.5em;
}

.item-info {
    flex: 1;
}

.item-name {
    font-weight: bold;
    margin-bottom: 2px;
}

.item-description {
    font-size: 0.8em;
    opacity: 0.8;
}

.empty-inventory {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    opacity: 0.7;
}

.empty-icon {
    font-size: 3em;
    margin-bottom: 10px;
    opacity: 0.5;
}

.empty-hint {
    font-size: 0.9em;
    margin-top: 5px;
}

.inventory-shop {
    border-top: 2px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
}

.shop-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 15px;
}

.shop-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.shop-item:hover {
    border-color: rgba(255, 217, 61, 0.5);
}

/* Стили для навыков */
.skills-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.skills-progress {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
    opacity: 0.8;
}

.skills-tree {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.skill-category h4 {
    margin-bottom: 15px;
    color: #ffd93d;
    font-family: 'Orbitron', sans-serif;
}

.skill-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.skill-item.unlocked {
    border-color: rgba(86, 171, 47, 0.3);
}

.skill-item.locked {
    opacity: 0.6;
    filter: grayscale(0.8);
}

.skill-item:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateX(5px);
}

.skill-icon {
    font-size: 1.5em;
    width: 40px;
    text-align: center;
}

.skill-info {
    flex: 1;
}

.skill-name {
    font-weight: bold;
    margin-bottom: 2px;
}

.skill-description {
    font-size: 0.8em;
    opacity: 0.8;
}

.skill-level {
    font-size: 0.8em;
    opacity: 0.7;
    min-width: 60px;
    text-align: center;
}

.skill-max {
    font-size: 0.7em;
    color: #56ab2f;
    font-weight: bold;
    min-width: 60px;
    text-align: center;
}

.upgrade-btn {
    font-size: 0.8em;
    padding: 5px 10px;
}

/* Адаптивность */
@media (max-width: 768px) {
    .inventory-grid {
        grid-template-columns: 1fr;
    }
    
    .skills-header {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
    
    .menu-item {
        padding: 12px;
    }
    
    .skill-item {
        flex-wrap: wrap;
    }
    
    .game-header {
        flex-direction: column;
        gap: 15px;
    }
    
    .header-left, .header-center, .header-right {
        width: 100%;
        justify-content: center;
    }
}
`;

// Добавляем стили в документ
const enhancedStyleSheet = document.createElement('style');
enhancedStyleSheet.textContent = enhancedStyles;
document.head.appendChild(enhancedStyleSheet);
