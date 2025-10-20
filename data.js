// Простые данные для тестирования
const GAME_DATA = {
    planets: [
        { id: 1, name: "Кристаллиус", type: "blue", icon: "💎", description: "Планета сверкающих кристаллов" },
        { id: 2, name: "Роботония", type: "red", icon: "🤖", description: "Мир роботов и технологий" },
        { id: 3, name: "Флора-7", type: "green", icon: "🌿", description: "Цветущая планета" },
        { id: 4, name: "Арт-Сфера", type: "blue", icon: "🎨", description: "Космическая галерея" },
        { id: 5, name: "ТехноМир", type: "yellow", icon: "⚡", description: "Центр технологий" }
    ]
};

// Простые утилиты
const GameUtils = {
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};
