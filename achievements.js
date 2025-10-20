// Система достижений и наград
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.initAchievements();
    }

    initAchievements() {
        // Исследовательские достижения
        this.addAchievement({
            id: 'first_launch',
            name: '🚀 Первый запуск',
            description: 'Начните свое космическое путешествие',
            category: 'exploration',
            icon: '🚀',
            points: 10,
            requirement: (player) => player.totalGames >= 1,
            hidden: false
        });

        this.addAchievement({
            id: 'planet_explorer',
            name: '🪐 Исследователь планет',
            description: 'Посетите 5 разных планет',
            category: 'exploration',
            icon: '🪐',
            points: 25,
            requirement: (player) => player.visitedPlanets?.length >= 5,
            hidden: false
        });

        this.addAchievement({
            id: 'galaxy_traveler',
            name: '🌌 Путешественник галактики',
            description: 'Посетите все 15 планет',
            category: 'exploration',
            icon: '🌌',
            points: 100,
            requirement: (player) => player.visitedPlanets?.length >= 15,
            hidden: false
        });

        // Профессиональные достижения
        this.addAchievement({
            id: 'first_profession',
            name: '🎓 Первая профессия',
            description: 'Создайте свою первую космическую профессию',
            category: 'profession',
            icon: '🎓',
            points: 15,
            requirement: (player) => player.professionsCreated >= 1,
            hidden: false
        });

        this.addAchievement({
            id: 'master_of_trades',
            name: '👑 Мастер профессий',
            description: 'Создайте 10 разных профессий',
            category: 'profession',
            icon: '👑',
            points: 75,
            requirement: (player) => player.uniqueProfessions >= 10,
            hidden: false
        });

        this.addAchievement({
            id: 'innovator',
            name: '💡 Инноватор',
            description: 'Создайте профессию с максимальной креативностью',
            category: 'profession',
            icon: '💡',
            points: 50,
            requirement: (player) => player.currentProfession?.creativity >= 90,
            hidden: true
        });

        // Социальные достижения
        this.addAchievement({
            id: 'team_player',
            name: '🤝 Командный игрок',
            description: 'Завершите 3 мультиплеерные сессии',
            category: 'social',
            icon: '🤝',
            points: 30,
            requirement: (player) => player.multiplayerSessions >= 3,
            hidden: false
        });

        this.addAchievement({
            id: 'helper',
            name: '🌟 Помощник',
            description: 'Помогите 5 другим игрокам',
            category: 'social',
            icon: '🌟',
            points: 40,
            requirement: (player) => player.playersHelped >= 5,
            hidden: false
        });

        this.addAchievement({
            id: 'diplomat',
            name: '🕊️ Дипломат',
            description: 'Успешно завершите все задания на красных планетах',
            category: 'social',
            icon: '🕊️',
            points: 60,
            requirement: (player) => player.redPlanetsCompleted >= 8,
            hidden: false
        });

        // Звездные достижения
        this.addAchievement({
            id: 'star_collector',
            name: '⭐ Коллекционер звезд',
            description: 'Соберите 50 звезд полезности',
            category: 'special',
            icon: '⭐',
            points: 50,
            requirement: (player) => player.totalStars >= 50,
            hidden: false
        });

        this.addAchievement({
            id: 'cosmic_rich',
            name: '💎 Космический богач',
            description: 'Накопите 1000 космических кристаллов',
            category: 'special',
            icon: '💎',
            points: 80,
            requirement: (player) => player.totalCrystals >= 1000,
            hidden: false
        });

        this.addAchievement({
            id: 'speed_runner',
            name: '⚡ Скоростной бегун',
            description: 'Достигните Планеты Профессий менее чем за 10 ходов',
            category: 'special',
            icon: '⚡',
            points: 100,
            requirement: (player) => player.fastestVictory <= 10,
            hidden: true
        });

        this.addAchievement({
            id: 'perfectionist',
            name: '🎯 Перфекционист',
            description: 'Выполните все задания с креативным решением',
            category: 'special',
            icon: '🎯',
            points: 150,
            requirement: (player) => player.perfectMissions >= 20,
            hidden: true
        });

        // Уровневые достижения
        for (let i = 1; i <= 10; i++) {
            this.addAchievement({
                id: `level_${i}`,
                name: `📈 Уровень ${i}`,
                description: `Достигните ${i} уровня`,
                category: 'special',
                icon: '📈',
                points: i * 10,
                requirement: (player) => player.level >= i,
                hidden: false
            });
        }
    }

    addAchievement(achievement) {
        this.achievements.set(achievement.id, achievement);
    }

    // Проверка достижений
    checkAchievements(playerData) {
        const newlyUnlocked = [];
        
        for (const [id, achievement] of this.achievements) {
            if (!this.unlockedAchievements.has(id) && achievement.requirement(playerData)) {
                this.unlockAchievement(id, playerData);
                newlyUnlocked.push(achievement);
            }
        }
        
        return newlyUnlocked;
    }

    async unlockAchievement(achievementId, playerData) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return;

        this.unlockedAchievements.add(achievementId);
        
        // Сохраняем в базу данных
        if (window.gameDatabase) {
            await window.gameDatabase.unlockAchievement(playerData.telegramId, achievementId);
        }

        // Показываем уведомление
        this.showAchievementNotification(achievement);

        // Обновляем статистику игрока
        this.updatePlayerStats(playerData, achievement);

        console.log(`🏆 Достижение разблокировано: ${achievement.name}`);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-content">
                    <div class="achievement-title">Достижение разблокировано!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} очков</div>
                </div>
                <div class="achievement-glow"></div>
            </div>
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    updatePlayerStats(playerData, achievement) {
        playerData.achievementPoints = (playerData.achievementPoints || 0) + achievement.points;
        playerData.achievementsUnlocked = (playerData.achievementsUnlocked || 0) + 1;
    }

    // Получение прогресса по достижению
    getAchievementProgress(achievementId, playerData) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return 0;

        // Для скрытых достижений показываем 0 пока они не выполнены
        if (achievement.hidden && !this.unlockedAchievements.has(achievementId)) {
            return 0;
        }

        // Вычисляем прогресс на основе требований
        // Это упрощенная реализация - в реальной игре нужно более точное отслеживание
        return achievement.requirement(playerData) ? 100 : 25;
    }

    // Получение достижений по категории
    getAchievementsByCategory(category) {
        return Array.from(this.achievements.values())
            .filter(achievement => category === 'all' || achievement.category === category)
            .sort((a, b) => a.points - b.points);
    }

    // Получение общей статистики
    getAchievementsStats() {
        const total = this.achievements.size;
        const unlocked = this.unlockedAchievements.size;
        const totalPoints = Array.from(this.unlockedAchievements)
            .reduce((sum, id) => sum + (this.achievements.get(id)?.points || 0), 0);

        return {
            total,
            unlocked,
            locked: total - unlocked,
            completion: Math.round((unlocked / total) * 100),
            totalPoints
        };
    }
}

// Стили для уведомлений о достижениях
const achievementStyles = `
.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.achievement-notification.show {
    transform: translateX(0);
}

.achievement-popup {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    padding: 15px;
    color: white;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    min-width: 300px;
}

.achievement-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: achievementGlow 2s ease-in-out infinite;
}

.achievement-popup {
    display: flex;
    align-items: center;
    gap: 15px;
}

.achievement-icon {
    font-size: 2.5em;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.achievement-content {
    flex: 1;
}

.achievement-title {
    font-size: 0.8em;
    opacity: 0.8;
    margin-bottom: 2px;
}

.achievement-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 5px;
}

.achievement-description {
    font-size: 0.9em;
    opacity: 0.9;
    margin-bottom: 5px;
}

.achievement-points {
    font-size: 0.8em;
    color: #ffd93d;
    font-weight: bold;
}

@keyframes achievementGlow {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
}

.achievements-grid-enhanced {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
    padding: 20px;
}

.achievement-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.achievement-card.locked {
    opacity: 0.6;
    filter: grayscale(0.8);
}

.achievement-card.unlocked {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
    border-color: rgba(102, 126, 234, 0.5);
}

.achievement-card.hidden {
    background: rgba(0, 0, 0, 0.3);
}

.achievement-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.achievement-icon {
    font-size: 2em;
}

.achievement-info {
    flex: 1;
}

.achievement-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 2px;
}

.achievement-points {
    color: #ffd93d;
    font-size: 0.9em;
    font-weight: bold;
}

.achievement-description {
    font-size: 0.9em;
    opacity: 0.9;
    margin-bottom: 10px;
}

.achievement-progress {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    height: 6px;
    overflow: hidden;
}

.achievement-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #56ab2f, #a8e6cf);
    border-radius: 10px;
    transition: width 0.5s ease;
}

.achievement-card.hidden .achievement-description {
    color: #ccc;
    font-style: italic;
}
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = achievementStyles;
document.head.appendChild(styleSheet);

window.achievementSystem = new AchievementSystem();
