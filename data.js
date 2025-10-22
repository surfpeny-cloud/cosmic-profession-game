// Конфигурация игры
const GAME_CONFIG = {
    totalStarsToWin: 10,
    totalPlanets: 15,
    timerDuration: 120, // секунды
    minProofLength: 20
};

// Типы планет
const PLANET_TYPES = {
    blue: {
        name: "Космические задачи",
        color: "#4fc3f7",
        icon: "🔵",
        probability: 0.4,
        description: "Реши космическую проблему с помощью своей профессии"
    },
    red: {
        name: "Доказательство полезности", 
        color: "#ff6b6b",
        icon: "🔴",
        probability: 0.3,
        description: "Убеди инопланетян в полезности твоей профессии"
    },
    green: {
        name: "Помощь другим",
        color: "#66bb6a", 
        icon: "🟢",
        probability: 0.2,
        description: "Помоги другому космическому исследователю"
    },
    yellow: {
        name: "Космические события",
        color: "#ffd54f",
        icon: "🟡", 
        probability: 0.1,
        description: "Случайное космическое приключение"
    }
};

// База данных космических проблем
const COSMIC_PROBLEMS = [
    {
        problem: "Инопланетяне не понимают земное искусство! Они видят цвета иначе.",
        hint: "Найди способ общения через универсальные формы творчества"
    },
    {
        problem: "Космические животные грустят в невесомости. Они тоскуют по гравитации.",
        hint: "Придумай способ создать им комфортные условия"
    },
    {
        problem: "Роботы на станции постоянно ссорятся из-за разных алгоритмов поведения.",
        hint: "Помоги им найти общий язык"
    },
    {
        problem: "Закончились краски для космических картин. Нужно создать новые цвета.",
        hint: "Используй космическую пыль и энергию звезд"
    },
    {
        problem: "Экипаж в унынии после долгого полета. Нужно поднять настроение.",
        hint: "Создай что-то, что вернет радость в космический быт"
    },
    {
        problem: "Сломался главный компьютер станции. Все системы отключены.",
        hint: "Найди нестандартный способ починки"
    },
    {
        problem: "Потерялась важная космическая карта с маршрутом к Планете Профессий.",
        hint: "Восстанови карту по памяти или создай новую"
    },
    {
        problem: "На борту закончились запасы вдохновения и креативных идей.",
        hint: "Вдохнови команду новыми перспективами"
    },
    {
        problem: "Космические растения перестали цвести от одиночества.",
        hint: "Помоги им снова расцвести"
    },
    {
        problem: "Инопланетные гости хотят узнать о земных профессиях, но не понимают наш язык.",
        hint: "Найди способ межгалактического общения"
    }
];

// Космические события
const COSMIC_EVENTS = [
    {
        type: "positive",
        title: "Метеоритный дождь!",
        description: "Ты стал свидетелем невероятного космического зрелища. Все игроки получают +1 звезду за смелость!",
        effect: { stars: 1 }
    },
    {
        type: "challenge", 
        title: "Космический ветер!",
        description: "Сильный солнечный ветер сбил с курса! Пропускаешь ход, но придумываешь новое применение своей профессии в условиях невесомости.",
        effect: { skipTurn: true, creativeTask: true }
    },
    {
        type: "positive",
        title: "Встреча с дружелюбными инопланетянами!",
        description: "Они поделились своими знаниями о галактических профессиях. Получаешь +2 звезды за межгалактическую дружбу!",
        effect: { stars: 2 }
    },
    {
        type: "challenge",
        title: "Солнечная буря!",
        description: "Все системы корабля временно отключены. Придумай, как твоя профессия может помочь в этой экстренной ситуации!",
        effect: { emergencyTask: true }
    },
    {
        type: "positive", 
        title: "Обнаружение космического месторождения!",
        description: "Ты нашел редкие материалы, которые очень ценятся в галактике! Получаешь +1 звезду за находку.",
        effect: { stars: 1 }
    }
];

// Навыки и интересы для генерации профессий
const SKILLS = [
    "Рисование и творчество", "Конструирование и изобретение", "Наблюдение и анализ",
    "Общение и помощь другим", "Организация и планирование", "Музыка и ритм",
    "Движение и спорт", "Природа и забота о живом", "Математика и вычисления",
    "Истории и рассказывание", "Эксперименты и открытия", "Технологии и программирование"
];

const INTERESTS = [
    "Исследование космоса", "Помощь животным", "Создание искусства",
    "Изобретение механизмов", "Изучение природы", "Работа с людьми",
    "Музыка и звуки", "Спорт и движение", "Наука и открытия", 
    "Техника и компьютеры", "Медицина и здоровье", "Еда и кулинария"
];

// Шаблоны профессий
const PROFESSION_TEMPLATES = [
    "Космический {specialty} {domain}",
    "Звездный {domain} {specialty}",
    "Галактический {specialty} по {domain}",
    "Планетарный {domain} {specialty}",
    "Межгалактический {specialty} {domain}",
    "Орбитальный {domain} {specialty}"
];

const SPECIALTIES = [
    "исследователь", "создатель", "художник", "инженер", "врач", "садовник",
    "архитектор", "повар", "тренер", "ученый", "дизайнер", "аналитик"
];

// Сообщения для помощи
const HELP_MESSAGES = [
    "Помоги другому игроку придумать креативное решение его космической задачи",
    "Предложи идею, как твоя профессия может дополнить профессию товарища",
    "Нарисуй вместе с другим игроком решение его проблемы",
    "Объясни, как ваш профессии могут работать вместе в космической миссии",
    "Создай совместный проект с другим космическим исследователем"
];

// Генератор игрового поля
function generateGameBoard(numPlanets = GAME_CONFIG.totalPlanets) {
    const planets = [];
    
    // Стартовая позиция
    planets.push({
        position: 0,
        type: 'start',
        name: 'СТАРТ',
        color: '#10b981',
        icon: '🚀',
        description: 'Начало космического путешествия'
    });
    
    // Генерация планет с учетом вероятностей
    const planetTypes = Object.keys(PLANET_TYPES);
    const probabilities = planetTypes.map(type => PLANET_TYPES[type].probability);
    
    for (let i = 1; i <= numPlanets; i++) {
        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedType = 'blue'; // fallback
        
        for (let j = 0; j < probabilities.length; j++) {
            cumulativeProbability += probabilities[j];
            if (random <= cumulativeProbability) {
                selectedType = planetTypes[j];
                break;
            }
        }
        
        const planetType = PLANET_TYPES[selectedType];
        planets.push({
            position: i,
            type: selectedType,
            name: `Планета ${i}`,
            color: planetType.color,
            icon: planetType.icon,
            description: planetType.description
        });
    }
    
    // Финальная планета
    planets.push({
        position: numPlanets + 1,
        type: 'finish',
        name: 'ПЛАНЕТА ПРОФЕССИЙ',
        color: '#f59e0b',
        icon: '🏆',
        description: 'Конечная цель путешествия',
        isWin: true
    });
    
    return planets;
}

// Генератор профессий
function generateProfession(skill, interest) {
    const template = PROFESSION_TEMPLATES[Math.floor(Math.random() * PROFESSION_TEMPLATES.length)];
    const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
    
    return template
        .replace('{specialty}', specialty)
        .replace('{domain}', interest.toLowerCase());
}

// Утилиты
function getRandomProblem() {
    const problem = COSMIC_PROBLEMS[Math.floor(Math.random() * COSMIC_PROBLEMS.length)];
    return `${problem.problem}\n\n💡 Подсказка: ${problem.hint}`;
}

function getRandomEvent() {
    return COSMIC_EVENTS[Math.floor(Math.random() * COSMIC_EVENTS.length)];
}

function getRandomHelpMessage() {
    return HELP_MESSAGES[Math.floor(Math.random() * HELP_MESSAGES.length)];
}

function getRandomSkill() {
    return SKILLS[Math.floor(Math.random() * SKILLS.length)];
}

function getRandomInterest() {
    return INTERESTS[Math.floor(Math.random() * INTERESTS.length)];
}

// Экспорт для использования в game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_CONFIG,
        PLANET_TYPES,
        generateGameBoard,
        generateProfession,
        getRandomProblem,
        getRandomEvent,
        getRandomHelpMessage,
        getRandomSkill,
        getRandomInterest
    };
}
