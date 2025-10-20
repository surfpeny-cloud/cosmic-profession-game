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
        let professionName = `${prefix} ${skill.toLowerCase()}${interest.toLowerCase()}`;
        
        // Добавляем суффикс
        professionName += `-${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        
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
