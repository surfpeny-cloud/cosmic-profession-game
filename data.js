// Данные для игры "ПУТЕШЕСТВИЕ К ПЛАНЕТЕ ПРОФЕССИЙ"

// Космические проблемы для заданий
const COSMIC_PROBLEMS = [
    "Инопланетяне не понимают земное искусство! Они скучают по красоте и гармонии.",
    "Космические животные грустят в невесомости. Им нужна помощь и забота.",
    "Роботы на станции постоянно ссорятся из-за распределения задач.",
    "Закончились краски для космических картин. Нужно найти творческое решение!",
    "Нужно развеселить команду после долгого полета. Все устали и скучают по дому.",
    "Сломался главный компьютер станции. Вся информация может быть потеряна!",
    "Потерялась важная космическая карта. Без нее невозможно продолжить путь.",
    "На планете не хватает чистой воды. Нужно срочно решить эту проблему.",
    "Космические растения перестали расти. Без них не будет кислорода!",
    "Инопланетные гости прибыли с визитом, но никто не может с ними общаться.",
    "Система жизнеобеспечения дает сбои. Нужно быстро найти решение!",
    "Экипаж страдает от космической тоски. Нужно поднять всем настроение!",
    "Образцы инопланетных минералов нужно классифицировать и изучить.",
    "Космический корабль попал в метеоритный дождь! Нужно защитить экипаж.",
    "Научные данные нужно представить в понятной и красивой форме."
];

// Типы планет и их распределение
const PLANET_TYPES = {
    BLUE: {
        name: "Космические задачи",
        color: "blue",
        description: "Реши космическую проблему!",
        percentage: 40
    },
    RED: {
        name: "Доказательство полезности", 
        color: "red",
        description: "Убеди других в полезности твоей профессии!",
        percentage: 30
    },
    GREEN: {
        name: "Помощь другим",
        color: "green", 
        description: "Помоги другому игроку!",
        percentage: 20
    },
    YELLOW: {
        name: "Космические события",
        color: "yellow",
        description: "Случайное космическое событие!",
        percentage: 10
    }
};

// Космические события (для желтых планет)
const COSMIC_EVENTS = [
    {
        title: "Метеоритный дождь!",
        description: "Все игроки получают +1 звезду за смелость!",
        effect: "all_plus_star"
    },
    {
        title: "Космический ветер!",
        description: "Пропусти ход, но придумай новое применение своей профессии",
        effect: "skip_turn_but_idea"
    },
    {
        title: "Солнечная вспышка!",
        description: "Все профессии становятся вдвойне полезными! +2 звезды за следующее задание",
        effect: "double_next_reward"
    },
    {
        title: "Встреча с инопланетянами!",
        description: "Расскажи о своей профессии инопланетным гостям",
        effect: "alien_meeting"
    },
    {
        title: "Открытие новой планеты!",
        description: "Все игроки продвигаются на 2 клетки вперед",
        effect: "all_move_forward"
    }
];

// Игровое поле - 18 планет (включая старт и финиш)
const BOARD_SIZE = 18;

// Генерация игрового поля
function generateGameBoard() {
    const board = [];
    
    // Стартовая позиция
    board.push({
        number: 0,
        type: "start",
        name: "СТАРТ",
        description: "Начало космического путешествия!"
    });
    
    // Генерация 16 обычных планет
    const typeCounts = {
        blue: Math.floor(16 * PLANET_TYPES.BLUE.percentage / 100),
        red: Math.floor(16 * PLANET_TYPES.RED.percentage / 100),
        green: Math.floor(16 * PLANET_TYPES.GREEN.percentage / 100),
        yellow: Math.floor(16 * PLANET_TYPES.YELLOW.percentage / 100)
    };
    
    // Создаем массив типов планет согласно распределению
    const planetTypes = [];
    for (let type in typeCounts) {
        for (let i = 0; i < typeCounts[type]; i++) {
            planetTypes.push(type);
        }
    }
    
    // Перемешиваем типы планет
    for (let i = planetTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [planetTypes[i], planetTypes[j]] = [planetTypes[j], planetTypes[i]];
    }
    
    // Создаем планеты
    for (let i = 1; i <= 16; i++) {
        const type = planetTypes[i - 1];
        const planetType = Object.values(PLANET_TYPES).find(pt => pt.color === type);
        
        board.push({
            number: i,
            type: type,
            name: `Планета ${i}`,
            description: planetType.description,
            taskType: planetType.name
        });
    }
    
    // Финальная планета
    board.push({
        number: 17,
        type: "finish",
        name: "ПЛАНЕТА ПРОФЕССИЙ",
        description: "Конец путешествия! Собери 10 звезд чтобы выиграть!"
    });
    
    return board;
}

// Получить случайную космическую проблему
function getRandomProblem() {
    return COSMIC_PROBLEMS[Math.floor(Math.random() * COSMIC_PROBLEMS.length)];
}

// Получить случайное космическое событие
function getRandomEvent() {
    return COSMIC_EVENTS[Math.floor(Math.random() * COSMIC_EVENTS.length)];
}
