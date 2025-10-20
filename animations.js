// Дополнительные анимации для игры
class GameAnimations {
    static init() {
        this.createFloatingStars();
        this.addParticleEffects();
    }

    // Создание плавающих звезд на фоне
    static createFloatingStars() {
        const starsContainer = document.querySelector('.stars-background');
        if (!starsContainer) return;

        // Удаляем существующие звезды
        starsContainer.innerHTML = '';

        // Создаем 15 звезд
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Случайные параметры
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            starsContainer.appendChild(star);
        }
    }

    // Добавление эффектов частиц для победы
    static addParticleEffects() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            @keyframes glow {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.1); }
            }
            
            .particle {
                position: absolute;
                pointer-events: none;
                animation: float 3s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Анимация появления элемента
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Анимация исчезновения элемента
    static fadeOut(element, duration = 500) {
        let start = null;
        const initialOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Анимация "пульсации" для важных элементов
    static pulse(element, duration = 1000) {
        element.style.animation = 'none';
        void element.offsetWidth; // Сброс анимации
        element.style.animation = `pulse ${duration}ms ease-in-out`;
    }

    // Создание эффекта конфетти
    static createConfetti() {
        const confettiContainer = document.querySelector('.victory-animation');
        if (!confettiContainer) return;

        // Очищаем старые конфетти
        const oldConfetti = confettiContainer.querySelectorAll('.confetti');
        oldConfetti.forEach(confetti => confetti.remove());

        // Создаем новые конфетти
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Случайные параметры
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = Math.random() * 2 + 2;
            const size = Math.random() * 8 + 4;
            
            // Случайный цвет
            const colors = [
                'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                'linear-gradient(45deg, #4ecdc4, #44a08d)',
                'linear-gradient(45deg, #ffd93d, #ff9a3d)',
                'linear-gradient(45deg, #6a11cb, #2575fc)',
                'linear-gradient(45deg, #667eea, #764ba2)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.left = `${left}%`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.background = color;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
        }
    }

    // Анимация "дрожания" для ошибок
    static shake(element) {
        element.style.animation = 'none';
        void element.offsetWidth;
        element.style.animation = 'shake 0.5s ease-in-out';
    }
}

// Добавляем CSS для анимации дрожания
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyles);

// Инициализация анимаций при загрузке
document.addEventListener('DOMContentLoaded', () => {
    GameAnimations.init();
});
