// СОЗДАЙТЕ НОВЫЙ ФАЙЛ data.js И СКОПИРУЙТЕ ВЕСЬ ЭТОТ КОД

// Данные для игры
const GameData = {
    // Навыки из "Цеха"
    skills: [
        "Рисование",
        "Конструирование",
        "Наблюдение",
        "Общение",
        "Решение задач",
        "Творчество",
        "Организация",
        "Исследование",
        "Помощь другим",
        "Изобретение",
        "Музыка",
        "Танцы",
        "Спорт",
        "Математика",
        "Чтение"
    ],

    // Интересы из "Окна в профессии"
    interests: [
        "Животные",
        "Технологии",
        "Искусство",
        "Космос",
        "Природа",
        "Музыка",
        "Спорт",
        "Кулинария",
        "Путешествия",
        "Наука",
        "Книги",
        "Фильмы",
        "Игры",
        "Растения",
        "Море"
    ],

    // Космические проблемы для заданий
    problems: [
        "Инопланетяне не понимают земное искусство!",
        "Космические животные грустят в невесомости",
        "Роботы на станции постоянно ссорятся",
        "Закончились краски для космических картин",
        "Нужно развеселить команду после долгого полета",
        "Сломался главный компьютер станции",
        "Потерялась важная космическая карта",
        "На планете пропала гравитация",
        "Инопланетные растения перестали расти",
        "Космический корабль потерял связь с Землей",
        "На станции закончились запасы еды",
        "Космонавты забыли как говорить на своем языке",
        "В космосе появились странные звуки",
        "Солнечные батареи покрылись космической пылью",
        "Водопровод на станции дал течь"
    ],

    // Космические события
    events: [
        {
            type: "positive",
            title: "Метеоритный дождь!",
            description: "Все получают +1 звезду за смелость",
            effect: "+1 звезда всем"
        },
        {
            type: "challenge",
            title: "Космический ветер!",
            description: "Пропускаешь ход, но придумываешь новое применение своей профессии",
            effect: "Пропуск хода + творческое задание"
        },
        {
            type: "positive",
            title: "Солнечная вспышка!",
            description: "Энергия творчества! Получаешь +2 звезды",
            effect: "+2 звезды"
        },
        {
            type: "challenge",
            title: "Черная дыра!",
            description: "Все возвращаются на 2 планеты назад",
            effect: "Откат на 2 позиции"
        },
        {
            type: "positive",
            title: "Встреча с дружелюбными инопланетянами!",
            description: "Они дарят тебе особую технологию +3 звезды",
            effect: "+3 звезды"
        }
    ],

    // Типы планет и их распределение
    planetTypes: [
        { type: "blue", name: "Космическая задача", probability: 0.4 },
        { type: "red", name: "Доказательство полезности", probability: 0.3 },
        { type: "green", name: "Помощь другим", probability: 0.2 },
        { type: "yellow", name: "Космическое событие", probability: 0.1 }
    ],

    // Названия планет
    planetNames: [
        "Кристаллиус",
        "Нептуния",
        "Марс-2",
        "Венера-Про",
        "Сатурн-Кольцо",
        "Юпитерия",
        "Плутония",
        "Меркурий-Х",
        "Урания",
        "Нептун-Плюс",
        "Звездолит",
        "Галактикус",
        "Туманность",
        "Квазар",
        "Комета",
        "Астероид-Бей",
        "Орбитус",
        "Спутник-1"
    ],

    // Данные для магазина
    shopItems: {
        skills: [
            {
                id: 'double_stars',
                name: 'Удвоитель звезд',
                description: 'Получай в 2 раза больше звезд за задания на 3 хода',
                price: 15,
                icon: '⭐⭐',
                type: 'booster',
                duration: 3
            },
            {
                id: 'extra_dice',
                name: 'Улучшенный кубик',
                description: 'Бросай два кубика и выбирай лучший результат',
                price: 20,
                icon: '🎲🎲',
                type: 'skill',
                permanent: true
            },
            {
                id: 'time_extend',
                name: 'Дополнительное время',
                description: '+30 секунд на выполнение заданий',
                price: 10,
                icon: '⏰',
                type: 'skill',
                permanent: true
            },
            {
                id: 'auto_complete',
                name: 'Автозавершение',
                description: 'Автоматически получай 1 звезду за простые задания',
                price: 25,
                icon: '🤖',
                type: 'skill',
                permanent: true
            }
        ],
        
        items: [
            {
                id: 'rocket_boost',
                name: 'Ракетный ускоритель',
                description: 'Пропусти следующую планету без выполнения задания',
                price: 8,
                icon: '🚀',
                type: 'item',
                consumable: true
            },
            {
                id: 'shield',
                name: 'Энергетический щит',
                description: 'Защита от негативных космических событий',
                price: 12,
                icon: '🛡️',
                type: 'item',
                consumable: true
            },
            {
                id: 'teleport',
                name: 'Телепорт',
                description: 'Переместись на любую планету вперед',
                price: 30,
                icon: '🌀',
                type: 'item',
                consumable: true
            },
            {
                id: 'star_magnet',
                name: 'Звездный магнит',
                description: 'Автоматически собирай звезды с пролетаемых планет',
                price: 18,
                icon: '🧲',
                type: 'item',
                consumable: true
            }
        ],
        
        boosters: [
            {
                id: 'lucky_charm',
                name: 'Счастливый талисман',
                description: 'Увеличивает шанс выпадения 6 на кубике',
                price: 15,
                icon: '🍀',
                type: 'booster',
                duration: 5
            },
            {
                id: 'inspiration',
                name: 'Вдохновение',
                description: '+1 дополнительная звезда за творческие задания',
                price: 12,
                icon: '💡',
                type: 'booster',
                duration: 4
            },
            {
                id: 'diplomacy',
                name: 'Космическая дипломатия',
                description: 'Упрощает убеждение других игроков',
                price: 10,
                icon: '🕊️',
                type: 'booster',
                duration: 3
            }
        ]
    },

    // Аватары для игроков
    avatars: [
        '👨‍🚀', '👩‍🚀', '🧑‍🚀', '👨‍🔬', '👩‍🔬', '🧑‍🔬', 
        '👨‍🎨', '👩‍🎨', '🧑‍🎨', '👨‍💻', '👩‍💻', '🧑‍💻'
    ],

    // Цвета для игроков
    playerColors: [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ],

    // Генератор названий профессий
    generateProfession: function(skill, interest) {
        const prefixes = [
            "Космический", "Звездный", "Галактический", "Орбитальный", 
            "Межпланетный", "Вселенский", "Солнечный", "Лунный"
        ];
        
        const suffixes = [
            "специалист", "эксперт", "мастер", "исследователь", "инженер",
            "художник", "ученый", "помощник", "изобретатель", "творец"
        ];

        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        // Создаем уникальное название профессии на основе навыка и интереса
        let professionName = `${prefix} ${skill.toLowerCase()}-${interest.toLowerCase()}`;
        
        // Добавляем суффикс
        professionName += ` ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        
        return professionName;
    },

    // Получить случайную проблему
    getRandomProblem: function() {
        return this.problems[Math.floor(Math.random() * this.problems.length)];
    },

    // Получить случайное событие
    getRandomEvent: function() {
        return this.events[Math.floor(Math.random() * this.events.length)];
    },

    // Создать игровое поле с планетами
    createGameBoard: function(numPlanets = 15) {
        const planets = [];
        const usedNames = new Set();
        
        for (let i = 0; i < numPlanets; i++) {
            // Выбираем тип планеты по вероятности
            let random = Math.random();
            let cumulative = 0;
            let planetType = this.planetTypes[0];
            
            for (const type of this.planetTypes) {
                cumulative += type.probability;
                if (random <= cumulative) {
                    planetType = type;
                    break;
                }
            }
            
            // Выбираем уникальное название планеты
            let planetName;
            do {
                planetName = this.planetNames[Math.floor(Math.random() * this.planetNames.length)];
            } while (usedNames.has(planetName));
            usedNames.add(planetName);
            
            planets.push({
                id: i + 1,
                name: planetName,
                type: planetType.type,
                typeName: planetType.name,
                position: i
            });
        }
        
        return planets;
    }
};

// Инициализация Telegram Web App
let tg = null;
try {
    tg = window.Telegram.WebApp;
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
    }
} catch (error) {
    console.log("Telegram Web App не доступен, запуск в браузере");
}
