// Данные для игры
const GAME_DATA = {
    // Типы планет и их распределение
    planetTypes: {
        blue: { 
            name: "Космические задачи", 
            probability: 0.4,
            color: "#4fc3f7",
            icon: "🔵"
        },
        red: { 
            name: "Доказательство полезности", 
            probability: 0.3,
            color: "#ff6b6b",
            icon: "🔴"
        },
        green: { 
            name: "Помощь другим", 
            probability: 0.2,
            color: "#66bb6a",
            icon: "🟢"
        },
        yellow: { 
            name: "Космические события", 
            probability: 0.1,
            color: "#ffd54f",
            icon: "🟡"
        }
    },

    // Космические проблемы для синих планет
    cosmicProblems: [
        "Инопланетяне не понимают земное искусство! Нужно найти способ общения через творчество",
        "Космические животные грустят в невесомости. Им нужна помощь и забота",
        "Роботы на станции постоянно ссорятся из-за разных алгоритмов поведения",
        "Закончились краски для космических картин. Нужно создать новые цвета из космической пыли",
        "Нужно развеселить команду после долгого полета в глубоком космосе",
        "Сломался главный компьютер станции. Нужно починить его нестандартным способом",
        "Потерялась важная космическая карта с маршрутом к Планете Профессий",
        "На борту закончились запасы вдохновения и креативных идей",
        "Космические растения перестали цвести от одиночества",
        "Инопланетные гости хотят узнать о земных профессиях, но не понимают наш язык",
        "Система искусственной гравитации работает с перебоями",
        "Космический корабль попал в поле астероидов и нужно проложить безопасный путь",
        "Экипаж страдает от космической тоски по дому",
        "Обнаружена новая неизвестная планета, нужно ее исследовать",
        "Космическая еда стала безвкусной и однообразной"
    ],

    // Космические события для желтых планет
    cosmicEvents: [
        {
            type: "positive",
            title: "Метеоритный дожь!",
            description: "Все игроки получают +1 звезду за смелость и красоту зрелища",
            effect: "+1 звезда всем"
        },
        {
            type: "challenge",
            title: "Космический ветер!",
            description: "Пропускаешь ход, но придумываешь новое применение своей профессии в условиях невесомости",
            effect: "Пропуск хода + творческое задание"
        },
        {
            type: "positive",
            title: "Встреча с дружелюбными инопланетянами!",
            description: "Они делятся своими знаниями - получаешь +2 звезды за межгалактическую дружбу",
            effect: "+2 звезды"
        },
        {
            type: "challenge",
            title: "Солнечная буря!",
            description: "Все системы корабля временно отключены. Придумай, как твоя профессия может помочь в этой ситуации",
            effect: "Экстренное задание"
        },
        {
            type: "positive",
            title: "Обнаружение космического месторождения!",
            description: "Нашел редкие материалы - получаешь +1 звезду за находку",
            effect: "+1 звезда"
        }
    ],

    // Навыки из "Цеха"
    skills: [
        "Рисование и творчество", "Конструирование и изобретение", "Наблюдение и анализ",
        "Общение и помощь другим", "Организация и планирование", "Музыка и ритм",
        "Движение и спорт", "Природа и забота о живом", "Математика и вычисления",
        "Истории и рассказывание", "Эксперименты и открытия", "Технологии и программирование"
    ],

    // Сферы интересов из "Окна в профессии"
    interests: [
        "Исследование космоса", "Помощь животным", "Создание искусства",
        "Изобретение механизмов", "Изучение природы", "Работа с людьми",
        "Музыка и звуки", "Спорт и движение", "Наука и открытия",
        "Техника и компьютеры", "Медицина и здоровье", "Еда и кулинария"
    ],

    // Примеры профессий для вдохновения
    professionExamples: [
        "Космический художник-ветеринар",
        "Звездный инженер-певец", 
        "Галактический садовник-программист",
        "Планетарный врач-исследователь",
        "Межгалактический архитектор эмоций",
        "Космический шеф-повар науки",
        "Орбитальный тренер роботов",
        "Создатель звездных картин",
        "Исследователь лунных мелодий",
        "Дизайнер солнечных систем"
    ],

    // Фразы для доказательства полезности
    proofTemplates: [
        "Моя профессия '{profession}' полезна для космонавтов, потому что...",
        "С помощью {profession} можно решить проблему...", 
        "В космическом путешествии {profession} помогает...",
        "Без {profession} космонавты не смогут...",
        "Моя профессия делает космос лучше, так как..."
    ],

    // Сообщения для помощи другим
    helpMessages: [
        "Помоги другому игроку придумать решение его задачи",
        "Предложи креативную идею для профессии товарища",
        "Нарисуй вместе с другим игроком решение его проблемы", 
        "Объясни, как твоя профессия может дополнить профессию другого игрока",
        "Создай совместный проект с другим исследователем"
    ]
};

// Генератор случайных профессий
function generateProfession(skill, interest) {
    const prefixes = ["Космический", "Звездный", "Галактический", "Планетарный", "Межгалактический", "Орбитальный"];
    const suffixes = ["исследователь", "создатель", "художник", "инженер", "врач", "садовник", "архитектор", "повар"];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${randomPrefix} ${randomSuffix} ${interest.toLowerCase()}`;
}

// Генератор игрового поля
function generateGameBoard(numPlanets = 15) {
    const planets = [];
    let position = 0;
    
    // Стартовая позиция
    planets.push({
        position: 0,
        type: 'start',
        name: 'СТАРТ',
        color: '#ffffff',
        icon: '🚀'
    });
    
    // Генерация планет
    for (let i = 1; i <= numPlanets; i++) {
        const random = Math.random();
        let planetType;
        
        if (random < 0.4) planetType = 'blue';
        else if (random < 0.7) planetType = 'red';
        else if (random < 0.9) planetType = 'green';
        else planetType = 'yellow';
        
        planets.push({
            position: i,
            type: planetType,
            name: `Планета ${i}`,
            color: GAME_DATA.planetTypes[planetType].color,
            icon: GAME_DATA.planetTypes[planetType].icon,
            description: GAME_DATA.planetTypes[planetType].name
        });
    }
    
    // Финальная планета
    planets.push({
        position: numPlanets + 1,
        type: 'finish',
        name: 'ПЛАНЕТА ПРОФЕССИЙ',
        color: '#ffd700',
        icon: '🏆',
        isWin: true
    });
    
    return planets;
}

// Получение случайной проблемы
function getRandomProblem() {
    return GAME_DATA.cosmicProblems[Math.floor(Math.random() * GAME_DATA.cosmicProblems.length)];
}

// Получение случайного события
function getRandomEvent() {
    return GAME_DATA.cosmicEvents[Math.floor(Math.random() * GAME_DATA.cosmicEvents.length)];
}

// Получение случайного шаблона для доказательства
function getRandomProofTemplate(profession) {
    const template = GAME_DATA.proofTemplates[Math.floor(Math.random() * GAME_DATA.proofTemplates.length)];
    return template.replace('{profession}', profession);
}

// Получение случайного сообщения помощи
function getRandomHelpMessage() {
    return GAME_DATA.helpMessages[Math.floor(Math.random() * GAME_DATA.helpMessages.length)];
}
// Генератор случайных профессий (исправленная версия)
function generateProfession(skill, interest) {
    const prefixes = ["Космический", "Звездный", "Галактический", "Планетарный", "Межгалактический", "Орбитальный"];
    const suffixes = ["исследователь", "создатель", "художник", "инженер", "врач", "садовник", "архитектор", "повар"];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${randomPrefix} ${randomSuffix} ${interest.toLowerCase()}`;
}
