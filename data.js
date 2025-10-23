// Конфигурация игры
const GAME_CONFIG = {
    totalCells: 32,
    maxPlayers: 16,
    startCoins: 50,
    targetCoins: 300,
    skipTaskPenalty: 5,
    usedTasks: new Set() // Для отслеживания использованных заданий
};

// Уровни сложности заданий
const DIFFICULTY_LEVELS = {
    easy: {
        name: "Лёгкое",
        reward: 10,
        color: "#10b981",
        time: 60,
        probability: 0.5
    },
    medium: {
        name: "Среднее", 
        reward: 20,
        color: "#f59e0b",
        time: 90,
        probability: 0.3
    },
    hard: {
        name: "Сложное",
        reward: 35,
        color: "#ef4444", 
        time: 120,
        probability: 0.2
    }
};

// Категории заданий
const TASK_CATEGORIES = {
    creative: {
        name: "Творческое задание",
        icon: "🎨",
        color: "#8b5cf6"
    },
    logical: {
        name: "Логическая задача", 
        icon: "🧩",
        color: "#06b6d4"
    },
    social: {
        name: "Социальное взаимодействие",
        icon: "👥",
        color: "#10b981"
    },
    physical: {
        name: "Физическое задание",
        icon: "💪",
        color: "#f59e0b"
    },
    knowledge: {
        name: "Проверка знаний",
        icon: "📚",
        color: "#ef4444"
    }
};

// База данных заданий
const TASKS_DATABASE = [
    // Легкие задания
    {
        id: "easy_1",
        difficulty: "easy",
        category: "creative",
        title: "Нарисуй космического друга",
        description: "За 1 минуту нарисуй инопланетянина, который мог бы стать твоим другом в космосе.",
        hint: "Не бойся фантазировать! Используй необычные цвета и формы."
    },
    {
        id: "easy_2", 
        difficulty: "easy",
        category: "social",
        title: "Комплимент космонавту",
        description: "Сделай искренний комплимент любому игроку за его космические достижения.",
        hint: "Будь внимателен к другим игрокам и их успехам."
    },
    {
        id: "easy_3",
        difficulty: "easy", 
        category: "knowledge",
        title: "Космическая викторина",
        description: "Назови 3 планеты Солнечной системы и по одному интересному факту о каждой.",
        hint: "Вспомни школьные знания или придумай фантастические факты!"
    },
    {
        id: "easy_4",
        difficulty: "easy",
        category: "physical", 
        title: "Невесомость",
        description: "Изобрази, как ты двигаешься в невесомости в течение 30 секунд.",
        hint: "Плавные, медленные движения как будто ты паришь в воздухе."
    },
    {
        id: "easy_5",
        difficulty: "easy",
        category: "logical",
        title: "Космическая загадка", 
        description: "Что можно увидеть с закрытыми глазами?",
        hint: "Подумай о снах и воображении."
    },

    // Средние задания
    {
        id: "medium_1",
        difficulty: "medium",
        category: "creative", 
        title: "Дизайн космического корабля",
        description: "Придумай и опиши космический корабль будущего с тремя уникальными функциями.",
        hint: "Вдохновись современными технологиями и научной фантастикой."
    },
    {
        id: "medium_2",
        difficulty: "medium",
        category: "social",
        title: "Межгалактический дипломат", 
        description: "Придумай способ общения с инопланетной расой, которая не понимает земные языки.",
        hint: "Язык жестов, музыки или искусства может быть универсальным."
    },
    {
        id: "medium_3",
        difficulty: "medium",
        category: "knowledge",
        title: "Космический инженер", 
        description: "Опиши, как бы ты решил проблему нехватки кислорода на космической станции.",
        hint: "Подумай о растениях, переработке или новых технологиях."
    },
    {
        id: "medium_4",
        difficulty: "medium",
        category: "physical",
        title: "Космический танец", 
        description: "Придумай и станцуй танец, который показывал бы жизнь в невесомости.",
        hint: "Используй плавные движения и импровизацию."
    },
    {
        id: "medium_5",
        difficulty: "medium",
        category: "logical",
        title: "Маршрут через астероидное поле", 
        description: "Представь, что тебе нужно проложить безопасный маршрут через поле из 10 астероидов. Опиши свою стратегию.",
        hint: "Подумай о сканировании, маневренности и резервных путях."
    },

    // Сложные задания
    {
        id: "hard_1",
        difficulty: "hard",
        category: "creative",
        title: "Космическая опера", 
        description: "Придумай и расскажи короткую историю (2-3 минуты) о первом контакте с инопланетной цивилизацией.",
        hint: "Удели внимание деталям, эмоциям и неожиданным поворотам сюжета."
    },
    {
        id: "hard_2",
        difficulty: "hard",
        category: "social",
        title: "Разрешение космического конфликта", 
        description: "Две инопланетные расы конфликтуют из-за ресурсов. Предложи дипломатическое решение.",
        hint: "Ищи компромисс и взаимовыгодные условия для обеих сторон."
    },
    {
        id: "hard_3",
        difficulty: "hard",
        category: "knowledge", 
        title: "Колония на Марсе",
        description: "Опиши подробный план создания самодостаточной колонии на Марсе на 1000 человек.",
        hint: "Учти жильё, питание, энергию, кислород и защиту от радиации."
    },
    {
        id: "hard_4",
        difficulty: "hard",
        category: "physical",
        title: "Космическая йога", 
        description: "Продемонстрируй 3 асаны йоги, которые могли бы быть полезны астронавтам в невесомости.",
        hint: "Сфокусируйся на равновесии, гибкости и расслаблении."
    },
    {
        id: "hard_5",
        difficulty: "hard",
        category: "logical",
        title: "Временная петля", 
        description: "Ты попал в временную петлю. Каждый день повторяется. Как бы ты доказал это другим и нашёл выход?",
        hint: "Ищи закономерности и оставляй сообщения своему будущему я."
    }
];

// Магазин предметов
const SHOP_ITEMS = {
    boosters: [
        {
            id: "double_reward",
            name: "Удвоение награды",
            icon: "💰",
            price: 50,
            description: "Следующее выполненное задание принесёт в 2 раза больше монет",
            category: "boosters",
            effect: "next_reward_double"
        },
        {
            id: "extra_roll",
            name: "Дополнительный бросок",
            icon: "🎲",
            price: 30,
            description: "Получи право на дополнительный бросок кубика в свой ход",
            category: "boosters", 
            effect: "extra_dice_roll"
        },
        {
            id: "task_skip",
            name: "Пропуск задания",
            icon: "⏭️",
            price: 25,
            description: "Позволяет пропустить следующее задание без штрафа",
            category: "boosters",
            effect: "free_skip"
        }
    ],
    powers: [
        {
            id: "time_extend",
            name: "Увеличение времени",
            icon: "⏰",
            price: 40,
            description: "+30 секунд к таймеру следующего задания",
            category: "powers",
            effect: "time_extend_30"
        },
        {
            id: "difficulty_choice",
            name: "Выбор сложности", 
            icon: "🎯",
            price: 60,
            description: "Позволяет выбрать сложность следующего задания",
            category: "powers",
            effect: "choose_difficulty"
        },
        {
            id: "coin_magnet",
            name: "Магнит монет",
            icon: "🧲",
            price: 75,
            description: "Получай +5 монет за каждого игрока, находящегося на той же клетке",
            category: "powers",
            effect: "coin_magnet"
        }
    ],
    cosmetics: [
        {
            id: "golden_avatar",
            name: "Золотой аватар",
            icon: "🌟",
            price: 100,
            description: "Особая золотая рамка для твоего аватара",
            category: "cosmetics",
            effect: "golden_frame"
        },
        {
            id: "sparkle_trail",
            name: "Сверкающий след",
            icon: "✨",
            price: 80,
            description: "Красивый анимированный след при движении по полю",
            category: "cosmetics",
            effect: "sparkle_trail"
        },
        {
            id: "victory_animation",
            name: "Особая анимация победы",
            icon: "🎉",
            price: 150,
            description: "Уникальная анимация при победе в игре",
            category: "cosmetics",
            effect: "special_win_animation"
        }
    ]
};

// Специальные клетки поля
const SPECIAL_CELLS = {
    0: { type: "start", name: "Старт", effect: "start" },
    8: { type: "shop", name: "Магазин", effect: "shop_discount" },
    16: { type: "event", name: "Космическое событие", effect: "random_event" },
    24: { type: "challenge", name: "Испытание", effect: "special_challenge" },
    31: { type: "finish", name: "Финиш", effect: "finish_bonus" }
};

// Цвета для игроков
const PLAYER_COLORS = [
    "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
    "#f97316", "#6366f1", "#d946ef", "#0ea5e9",
    "#22c55e", "#eab308", "#a855f7", "#f43f5e"
];

const PLAYER_AVATARS = [
    "👨‍🚀", "👩‍🚀", "🛸", "🚀", "⭐", "🌌", "🪐", "☄️",
    "👽", "🤖", "🐙", "🦄", "🐲", "🦁", "🐯", "🐵"
];

// Генератор случайных заданий
class TaskGenerator {
    constructor() {
        this.usedTasks = new Set();
    }

    getRandomTask(difficulty = null) {
        // Фильтруем задания по сложности если указана
        let availableTasks = TASKS_DATABASE.filter(task => 
            !this.usedTasks.has(task.id) && 
            (!difficulty || task.difficulty === difficulty)
        );

        // Если все задания использованы, сбрасываем
        if (availableTasks.length === 0) {
            this.usedTasks.clear();
            availableTasks = TASKS_DATABASE.filter(task => 
                !difficulty || task.difficulty === difficulty
            );
        }

        if (availableTasks.length === 0) {
            // Fallback задание
            return {
                id: "fallback",
                difficulty: "medium",
                category: "knowledge",
                title: "Космическая загадка",
                description: "Что бесконечно, но имеет начало и конец?",
                hint: "Подумай о чём-то, что нас окружает постоянно."
            };
        }

        // Выбираем случайное задание
        const randomIndex = Math.floor(Math.random() * availableTasks.length);
        const task = availableTasks[randomIndex];
        
        // Помечаем как использованное
        this.usedTasks.add(task.id);
        
        return task;
    }

    getTaskByDifficulty() {
        const random = Math.random();
        let difficulty;

        if (random < DIFFICULTY_LEVELS.easy.probability) {
            difficulty = "easy";
        } else if (random < DIFFICULTY_LEVELS.easy.probability + DIFFICULTY_LEVELS.medium.probability) {
            difficulty = "medium";
        } else {
            difficulty = "hard";
        }

        return this.getRandomTask(difficulty);
    }

    markTaskAsUsed(taskId) {
        this.usedTasks.add(taskId);
    }

    resetUsedTasks() {
        this.usedTasks.clear();
    }
}

// Утилиты
function getRandomColor() {
    return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
}

function getRandomAvatar() {
    return PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)];
}

function generatePlayerName(index) {
    const names = [
        "Космонавт", "Звёздный", "Галактика", "Орбита", 
        "Комета", "Астероид", "Туманность", "Созвездие",
        "Пульсар", "Квазар", "Нейтрон", "Протон",
        "Фотон", "Электрон", "Атмосфера", "Гравитация"
    ];
    return `${names[index]} ${Math.floor(Math.random() * 1000)}`;
}

// Экспорт для использования в game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_CONFIG,
        DIFFICULTY_LEVELS,
        TASK_CATEGORIES,
        TASKS_DATABASE,
        SHOP_ITEMS,
        SPECIAL_CELLS,
        PLAYER_COLORS,
        PLAYER_AVATARS,
        TaskGenerator,
        getRandomColor,
        getRandomAvatar,
        generatePlayerName
    };
}
