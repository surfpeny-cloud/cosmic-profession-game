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

// Аватары для игроков
const AVATARS = [
    "🚀", "👨‍🚀", "👩‍🚀", "🛸", "👾", "🤖", "🐙", "🦄",
    "🐲", "🦁", "🐯", "🐶", "🐱", "🐼", "🦊", "🐰",
    "🐢", "🐬", "🦅", "🦉", "🐝", "🦋", "🐞", "🦄"
];

// Товары для магазина
const SHOP_ITEMS = {
    abilities: [
        {
            id: "double_stars",
            name: "Удвоитель звезд",
            description: "Следующее задание принесет в 2 раза больше звезд",
            price: 50,
            icon: "⭐",
            type: "consumable"
        },
        {
            id: "extra_roll",
            name: "Дополнительный бросок",
            description: "Получите дополнительный бросок кубика",
            price: 30,
            icon: "🎲",
            type: "consumable"
        },
        {
            id: "planet_skip",
            name: "Пропуск планеты",
            description: "Пропустите следующую планету без выполнения задания",
            price: 40,
            icon: "⏭️",
            type: "consumable"
        },
        {
            id: "star_magnet",
            name: "Звездный магнит",
            description: "Автоматически получайте +1 звезду за каждые 3 хода",
            price: 100,
            icon: "🧲",
            type: "permanent"
        }
    ],
    items: [
        {
            id: "cosmic_compass",
            name: "Космический компас",
            description: "Позволяет выбрать направление движения после броска",
            price: 75,
            icon: "🧭",
            type: "permanent"
        },
        {
            id: "time_stop",
            name: "Остановка времени",
            description: "+30 секунд на выполнение следующего задания",
            price: 25,
            icon: "⏰",
            type: "consumable"
        },
        {
            id: "shield",
            name: "Защитный щит",
            description: "Защищает от негативных космических событий",
            price: 60,
            icon: "🛡️",
            type: "consumable"
        }
    ],
    special: [
        {
            id: "profession_change",
            name: "Смена профессии",
            description: "Позволяет изменить свою профессию один раз",
            price: 150,
            icon: "🎭",
            type: "consumable"
        },
        {
            id: "star_swap",
            name: "Обмен звездами",
            description: "Обменяйтесь звездами с другим игроком",
            price: 80,
            icon: "🔄",
            type: "consumable"
        },
        {
            id: "cosmic_boost",
            name: "Космическое ускорение",
            description: "Автоматическое продвижение на 5 клеток вперед",
            price: 120,
            icon: "⚡",
            type: "consumable"
        }
    ]
};

// Профессии для случайной генерации
const SAMPLE_PROFESSIONS = [
    "Космический дизайнер эмоций",
    "Архитектор виртуальных миров",
    "Инженер искусственной гравитации",
    "Био-хакер организмов",
    "Дизайнер межгалактических интерфейсов",
    "Специалист по ксенокоммуникациям",
    "Терапевт космической тоски",
    "Шеф-повар астероидной кухни",
    "Художник голографических инсталляций",
    "Тренер космических животных"
];

// Навыки для случайной генерации
const SAMPLE_SKILLS = [
    "Создание позитивной атмосферы",
    "Программирование нейросетей",
    "Дизайн пользовательского опыта",
    "Биоинженерия",
    "Межкультурная коммуникация",
    "Критическое мышление",
    "Эмоциональный интеллект",
    "Творческое решение проблем",
    "Работа в команде",
    "Адаптивность к изменениям"
];

// Игровое поле - 24 планеты (включая старт и финиш)
const BOARD_SIZE = 24;

// Генерация игрового поля
function generateGameBoard() {
    const board = [];
    
    // Стартовая позиция
    board.push({
        number: 0,
        type: "start",
        name: "СТАРТ",
        description: "Начало космического путешествия!",
        special: "start"
    });
    
    // Генерация обычных планет
    const typeCounts = {
        blue: Math.floor((BOARD_SIZE - 2) * PLANET_TYPES.BLUE.percentage / 100),
        red: Math.floor((BOARD_SIZE - 2) * PLANET_TYPES.RED.percentage / 100),
        green: Math.floor((BOARD_SIZE - 2) * PLANET_TYPES.GREEN.percentage / 100),
        yellow: Math.floor((BOARD_SIZE - 2) * PLANET_TYPES.YELLOW.percentage / 100)
    };
    
    // Создаем массив типов планет согласно распределению
    const planetTypes = [];
    for (let type in typeCounts) {
        for (let i = 0; i < typeCounts[type]; i++) {
            planetTypes.push(type);
        }
    }
    
    // Добавляем случайные планеты если нужно
    while (planetTypes.length < BOARD_SIZE - 2) {
        const types = Object.keys(typeCounts);
        planetTypes.push(types[Math.floor(Math.random() * types.length)]);
    }
    
    // Перемешиваем типы планет
    for (let i = planetTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [planetTypes[i], planetTypes[j]] = [planetTypes[j], planetTypes[i]];
    }
    
    // Создаем планеты
    for (let i = 1; i <= BOARD_SIZE - 2; i++) {
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
        number: BOARD_SIZE - 1,
        type: "finish",
        name: "ПЛАНЕТА ПРОФЕССИЙ",
        description: "Конец путешествия! Собери 10 звезд чтобы выиграть!",
        special: "finish"
    });
    
    return board;
}

// Генерация случайного кода игры
function generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Получить случайную космическую проблему
function getRandomProblem() {
    return COSMIC_PROBLEMS[Math.floor(Math.random() * COSMIC_PROBLEMS.length)];
}

// Получить случайное космическое событие
function getRandomEvent() {
    return COSMIC_EVENTS[Math.floor(Math.random() * COSMIC_EVENTS.length)];
}

// Получить случайную профессию
function getRandomProfession() {
    return SAMPLE_PROFESSIONS[Math.floor(Math.random() * SAMPLE_PROFESSIONS.length)];
}

// Получить случайный навык
function getRandomSkill() {
    return SAMPLE_SKILLS[Math.floor(Math.random() * SAMPLE_SKILLS.length)];
}

// Локальное хранилище для игры
class GameStorage {
    static saveGame(gameData) {
        localStorage.setItem('cosmic_profession_game', JSON.stringify(gameData));
    }
    
    static loadGame() {
        const data = localStorage.getItem('cosmic_profession_game');
        return data ? JSON.parse(data) : null;
    }
    
    static clearGame() {
        localStorage.removeItem('cosmic_profession_game');
    }
}
