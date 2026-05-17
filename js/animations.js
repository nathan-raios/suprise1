// Animations GSAP
gsap.registerPlugin(ScrollTrigger);

// Animation du splash screen
function initSplashScreen() {
    const countdown = document.getElementById('countdown');
    let count = 3;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
            gsap.from(countdown, {
                scale: 0,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        } else {
            clearInterval(interval);
            countdown.textContent = '🎉';
            
            setTimeout(() => {
                gsap.to('#splash-screen', {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        document.getElementById('splash-screen').style.display = 'none';
                        document.getElementById('navbar').classList.remove('hidden');
                        startConfetti();
                        animateHero();
                    }
                });
            }, 1000);
        }
    }, 1000);
}

// Animation de la section héro
function animateHero() {
    const tl = gsap.timeline();
    
    tl.to('.hero-content', {
        opacity: 1,
        duration: 1
    })
    .from('.heart-photo', {
        scale: 0,
        rotation: 360,
        duration: 1,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.text-letter', {
        opacity: 0,
        y: 50,
        stagger: 0.05,
        duration: 0.5
    }, '-=0.5');
}

// Confettis
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#FF6B9D', '#FEC601', '#C724B1', '#FFFFFF', '#FFD700'];
    
    class Confetto {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 5 - 2.5;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < 150; i++) {
        confetti.push(new Confetto());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            c.update();
            c.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Animations au scroll - VERSION CORRIGÉE
function initScrollAnimations() {
    // Configuration plus robuste pour les memory cards
    const memoryCards = document.querySelectorAll('.memory-card');
    
    // Observer pour détecter quand les éléments sont visibles
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation GSAP supplémentaire
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        });
    }, observerOptions);
    
    // Observer chaque carte
    memoryCards.forEach(card => {
        observer.observe(card);
    });
    
    // Gallery items avec ScrollTrigger
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'back.out(1.7)'
        });
    });
    
    // Easter eggs avec animation améliorée
    gsap.utils.toArray('.easter-egg-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            rotation: 720,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'back.out(1.7)'
        });
    });
}

// Effet machine à écrire
function initTypewriter() {
    const text = `Ma chérie,

Aujourd'hui est un jour spécial, car c'est le jour où la personne la plus extraordinaire que je connaisse est née.

Tu illumines ma vie de ta présence. Ton sourire réchauffe mon cœur, ton rire est la plus belle mélodie, et tes yeux sont mon refuge.

Chaque moment passé avec toi est un trésor que je chéris. Tu me rends meilleur, plus heureux, et je ne peux imaginer ma vie sans toi.

En ce jour spécial, je veux que tu saches à quel point tu comptes pour moi. Tu es mon amour, ma complice, ma meilleure amie.

Joyeux anniversaire mon cœur ❤️

Que cette nouvelle année t'apporte tout le bonheur que tu mérites, car personne ne le mérite plus que toi.

Je t'aime plus que les mots ne peuvent le dire, plus que les étoiles dans le ciel, plus chaque jour qui passe.

Pour toujours tienne,
[Ton prénom] 💕`;

    const element = document.getElementById('typewriter-text');
    let index = 0;
    
    const trigger = ScrollTrigger.create({
        trigger: '#typewriter',
        start: 'top 60%',
        once: true,
        onEnter: () => {
            typeWriter();
        }
    });
    
    function typeWriter() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 30);
            
            // Auto-scroll pendant la frappe
            element.scrollTop = element.scrollHeight;
        }
    }
}

// Coeurs flottants
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = ['❤️', '💕', '💖', '💗', '💓'][Math.floor(Math.random() * 5)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heart.style.opacity = '0';
        heart.style.animation = 'floatHeart 8s linear forwards';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 1000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initScrollAnimations();
    initTypewriter();
    createFloatingHearts();
});

// Responsive: Recalculer au resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});