// Система сохранения прогресса и данных игрока
class GameDatabase {
    constructor() {
        this.dbName = 'CosmicProfessionGame';
        this.version = 3;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('🎮 База данных инициализирована');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Создаем хранилища
                if (!db.objectStoreNames.contains('players')) {
                    const playerStore = db.createObjectStore('players', { keyPath: 'id', autoIncrement: true });
                    playerStore.createIndex('telegramId', 'telegramId', { unique: true });
                    playerStore.createIndex('name', 'name', { unique: false });
                }

                if (!db.objectStoreNames.contains('gameSaves')) {
                    const saveStore = db.createObjectStore('gameSaves', { keyPath: 'id' });
                    saveStore.createIndex('playerId', 'playerId', { unique: false });
                    saveStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('achievements')) {
                    const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' });
                    achievementStore.createIndex('playerId', 'playerId', { unique: false });
                }

                if (!db.objectStoreNames.contains('multiplayer')) {
                    const mpStore = db.createObjectStore('multiplayer', { keyPath: 'sessionId' });
                    mpStore.createIndex('players', 'players', { unique: false });
                }

                console.log('🗃️ Структура базы данных создана');
            };
        });
    }

    // Сохранение данных игрока
    async savePlayerData(playerData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['players'], 'readwrite');
            const store = transaction.objectStore('players');
            
            // Добавляем timestamp
            playerData.lastSaved = new Date().toISOString();
            playerData.version = this.version;

            const request = store.put(playerData);

            request.onsuccess = () => {
                console.log('💾 Данные игрока сохранены:', playerData.name);
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Загрузка данных игрока
    async loadPlayerData(telegramId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['players'], 'readonly');
            const store = transaction.objectStore('players');
            const index = store.index('telegramId');
            const request = index.get(telegramId);

            request.onsuccess = () => {
                if (request.result) {
                    console.log('📂 Данные игрока загружены:', request.result.name);
                    resolve(request.result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Сохранение игры
    async saveGame(saveData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['gameSaves'], 'readwrite');
            const store = transaction.objectStore('gameSaves');
            
            saveData.timestamp = new Date().toISOString();
            saveData.id = `save_${Date.now()}`;

            const request = store.put(saveData);

            request.onsuccess = () => {
                console.log('🎮 Сохранение игры создано');
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Загрузка последнего сохранения
    async loadLastSave(playerId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['gameSaves'], 'readonly');
            const store = transaction.objectStore('gameSaves');
            const index = store.index('playerId');
            const request = index.getAll(playerId);

            request.onsuccess = () => {
                const saves = request.result;
                if (saves.length > 0) {
                    // Находим самое свежее сохранение
                    const lastSave = saves.reduce((latest, save) => {
                        return new Date(save.timestamp) > new Date(latest.timestamp) ? save : latest;
                    });
                    console.log('🕒 Загружено последнее сохранение');
                    resolve(lastSave);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Сохранение достижения
    async unlockAchievement(playerId, achievementId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readwrite');
            const store = transaction.objectStore('achievements');
            
            const achievementData = {
                id: `${playerId}_${achievementId}`,
                playerId: playerId,
                achievementId: achievementId,
                unlockedAt: new Date().toISOString(),
                progress: 100
            };

            const request = store.put(achievementData);

            request.onsuccess = () => {
                console.log('🏆 Достижение разблокировано:', achievementId);
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Получение всех достижений игрока
    async getPlayerAchievements(playerId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readonly');
            const store = transaction.objectStore('achievements');
            const index = store.index('playerId');
            const request = index.getAll(playerId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Статистика игрока
    async getPlayerStats(playerId) {
        const achievements = await this.getPlayerAchievements(playerId);
        const playerData = await this.loadPlayerData(playerId);
        
        return {
            totalGames: playerData?.totalGames || 0,
            totalStars: playerData?.totalStars || 0,
            achievementsUnlocked: achievements.length,
            uniqueProfessions: playerData?.uniqueProfessions?.length || 0,
            playTime: playerData?.totalPlayTime || 0,
            favoriteProfession: playerData?.favoriteProfession || null
        };
    }

    // Создание мультиплеер сессии
    async createMultiplayerSession(sessionData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['multiplayer'], 'readwrite');
            const store = transaction.objectStore('multiplayer');
            
            sessionData.createdAt = new Date().toISOString();
            sessionData.status = 'waiting';

            const request = store.put(sessionData);

            request.onsuccess = () => {
                console.log('👥 Мультиплеер сессия создана:', sessionData.sessionId);
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Резервное копирование в облако (если есть Telegram Cloud Storage)
    async backupToCloud(playerData) {
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.CloudStorage) {
            try {
                await Telegram.WebApp.CloudStorage.setItem('playerData', JSON.stringify(playerData));
                console.log('☁️ Данные сохранены в облако Telegram');
                return true;
            } catch (error) {
                console.error('❌ Ошибка облачного сохранения:', error);
                return false;
            }
        }
        return false;
    }

    // Восстановление из облака
    async restoreFromCloud() {
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.CloudStorage) {
            try {
                const data = await Telegram.WebApp.CloudStorage.getItem('playerData');
                if (data) {
                    console.log('☁️ Данные восстановлены из облака Telegram');
                    return JSON.parse(data);
                }
            } catch (error) {
                console.error('❌ Ошибка восстановления из облака:', error);
            }
        }
        return null;
    }

    // Экспорт данных игрока
    async exportPlayerData(playerId) {
        const playerData = await this.loadPlayerData(playerId);
        const achievements = await this.getPlayerAchievements(playerId);
        const saves = await this.loadLastSave(playerId);

        return {
            player: playerData,
            achievements: achievements,
            lastSave: saves,
            exportDate: new Date().toISOString(),
            version: this.version
        };
    }

    // Импорт данных игрока
    async importPlayerData(importData) {
        if (importData.version !== this.version) {
            console.warn('⚠️ Версия импортируемых данных отличается');
        }

        // Сохраняем все данные
        if (importData.player) {
            await this.savePlayerData(importData.player);
        }

        if (importData.achievements) {
            for (const achievement of importData.achievements) {
                await this.unlockAchievement(achievement.playerId, achievement.achievementId);
            }
        }

        console.log('📤 Данные игрока импортированы');
    }
}

// Глобальный экземпляр базы данных
window.gameDatabase = new GameDatabase();
