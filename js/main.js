// Variables globales
let currentSong = 0;
let isPlaying = false;
let isDarkMode = false;
let currentImageIndex = 0;
let candlesBlown = 0;

const songs = [
    './sounds/song1.mp3',
    './sounds/song2.mp3',
    './sounds/song3.mp3'
];

const galleryImages = [
    './images/gallery1.jpg',
    './images/gallery2.jpg',
    './images/gallery3.jpg',
    './images/gallery4.jpg',
    './images/gallery5.jpg',
    './images/gallery6.jpg'
];

// ==================== DARK MODE ====================
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const icon = document.getElementById('theme-icon');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('darkMode', isDarkMode);
}

// Charger la préférence dark mode
if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
}

// ==================== MUSIC PLAYER ====================
const audio = document.getElementById('background-music');

function toggleMusic() {
    const icon = document.getElementById('music-icon');
    
    if (audio.paused) {
        audio.play();
        icon.className = 'fas fa-pause';
    } else {
        audio.pause();
        icon.className = 'fas fa-music';
    }
}

function togglePlayPause() {
    const playIcon = document.getElementById('play-icon');
    
    if (isPlaying) {
        audio.pause();
        playIcon.className = 'fas fa-play';
    } else {
        audio.play();
        playIcon.className = 'fas fa-pause';
    }
    
    isPlaying = !isPlaying;
}

function previousSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong();
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong();
}

function loadSong() {
    audio.src = songs[currentSong];
    
    if (isPlaying) {
        audio.play();
    }
    
    // Mettre à jour l'UI
    document.querySelectorAll('.song-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentSong);
    });
    
    // Visualiseur simple
    createVisualizer();
}

function createVisualizer() {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = Math.random() * 60 + 20 + 'px';
        bar.style.animationDelay = Math.random() * 0.5 + 's';
        visualizer.appendChild(bar);
    }
}

// Contrôle du volume
document.getElementById('volume-slider')?.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Clic sur les chansons
document.querySelectorAll('.song-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentSong = index;
        loadSong();
        if (!isPlaying) togglePlayPause();
    });
});

// ==================== GALLERY LIGHTBOX ====================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(galleryImages[index]);
    });
});

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Animation d'ouverture
    gsap.from(lightboxImg, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3
    });
}

function closeLightbox() {
    gsap.to(lightboxImg, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    animateImageChange(galleryImages[currentImageIndex]);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    animateImageChange(galleryImages[currentImageIndex]);
}

function animateImageChange(src) {
    gsap.to(lightboxImg, {
        opacity: 0,
        x: -50,
        duration: 0.2,
        onComplete: () => {
            lightboxImg.src = src;
            gsap.to(lightboxImg, {
                opacity: 1,
                x: 0,
                duration: 0.2
            });
        }
    });
}

// Support clavier
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});

// Support swipe mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextImage();
    if (touchEndX > touchStartX + 50) prevImage();
}

// ==================== BIRTHDAY CAKE ====================
function blowCandle(candle) {
    if (candle.classList.contains('blown')) return;
    
    candle.classList.add('blown');
    candlesBlown++;
    
    // Son de souffle (si disponible)
    const blowSound = new Audio('./sounds/blow.mp3');
    blowSound.play().catch(() => {});
    
    // Animation
    gsap.to(candle, {
        rotationX: 10,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });
    
    // Si toutes les bougies sont soufflées
    if (candlesBlown === document.querySelectorAll('.candle').length) {
        setTimeout(() => {
            showWishMessage();
            launchFireworks();
        }, 500);
    }
}

function showWishMessage() {
    gsap.to('#wish-message', {
        opacity: 1,
        y: -20,
        duration: 1,
        ease: 'back.out(1.7)'
    });
}

function launchFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const fireworks = [];
    const particles = [];
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height / 2;
            this.speed = Math.random() * 3 + 3;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.y -= this.speed;
            return this.y <= this.targetY;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01;
        }
        
        update() {
            this.velocity.y += 0.1;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            if (fireworks[i].update()) {
                const f = fireworks[i];
                for (let j = 0; j < 100; j++) {
                    particles.push(new Particle(f.x, f.y, f.color));
                }
                fireworks.splice(i, 1);
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            if (!particles[i].update()) {
                particles.splice(i, 1);
            }
        }
        
        if (fireworks.length > 0 || particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.classList.add('hidden');
        }
    }
    
    animate();
}

// ==================== COUNTDOWN ====================
function updateCountdown() {
    // Date du prochain anniversaire (à personnaliser)
    const nextBirthday = new Date('2025-12-31T00:00:00');
    const now = new Date();
    const diff = nextBirthday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(3, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==================== QR CODE ====================
function generateQRCode() {
    const qrcodeContainer = document.getElementById('qrcode');
    if (!qrcodeContainer) return;
    
    new QRCode(qrcodeContainer, {
        text: window.location.href,
        width: 256,
        height: 256,
        colorDark: '#FF6B9D',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// ==================== PARTAGE ====================
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Joyeux Anniversaire !',
            text: 'Un message spécial pour toi ❤️',
            url: window.location.href
        });
    } else {
        copyLink();
    }
}

function shareOnWhatsApp() {
    const text = encodeURIComponent('Regarde ce magnifique site d\'anniversaire ! ❤️');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const text = encodeURIComponent('Regarde ce magnifique site d\'anniversaire ! ❤️');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    const message = document.getElementById('copy-message');
    message.style.opacity = '1';
    setTimeout(() => {
        message.style.opacity = '0';
    }, 2000);
}

// ==================== EASTER EGGS ====================
let easterEggsRevealed = new Set();

function revealEasterEgg(element, message) {
    // Vérifier si déjà révélé
    const eggIndex = Array.from(document.querySelectorAll('.easter-egg-item')).indexOf(element);
    
    if (easterEggsRevealed.has(eggIndex)) {
        // Déjà révélé, juste montrer le message à nouveau
        showEasterEggMessage(message);
        return;
    }
    
    // Marquer comme révélé
    easterEggsRevealed.add(eggIndex);
    element.classList.add('revealed');
    
    // Afficher le message
    showEasterEggMessage(message);
    
    // Confettis
    const rect = element.getBoundingClientRect();
    createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function showEasterEggMessage(message) {
    const modal = document.getElementById('easter-egg-modal');
    const content = document.getElementById('easter-egg-content');
    const messageEl = document.getElementById('easter-egg-message');
    
    // Réinitialiser l'échelle du contenu
    gsap.set(content, { scale: 0, rotation: 0 });
    
    messageEl.textContent = message;
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // Animation d'entrée
    gsap.to(content, {
        scale: 1,
        rotation: 360,
        duration: 0.6,
        ease: 'back.out(1.7)'
    });
}

function closeEasterEgg() {
    const modal = document.getElementById('easter-egg-modal');
    const content = document.getElementById('easter-egg-content');
    
    gsap.to(content, {
        scale: 0,
        rotation: -360,
        duration: 0.4,
        onComplete: () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    });
}

function createConfettiBurst(x, y) {
    const colors = ['🎉', '✨', '💖', '⭐', '🎊', '💕', '❤️', '🌟'];
    
    for (let i = 0; i < 30; i++) {
        const confetto = document.createElement('div');
        confetto.textContent = colors[Math.floor(Math.random() * colors.length)];
        confetto.style.position = 'fixed';
        confetto.style.left = x + 'px';
        confetto.style.top = y + 'px';
        confetto.style.fontSize = (20 + Math.random() * 20) + 'px';
        confetto.style.pointerEvents = 'none';
        confetto.style.zIndex = '9999';
        confetto.style.userSelect = 'none';
        
        document.body.appendChild(confetto);
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 150 + Math.random() * 150;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100;
        
        gsap.to(confetto, {
            x: vx,
            y: vy,
            opacity: 0,
            rotation: Math.random() * 720 - 360,
            duration: 1.5 + Math.random() * 0.5,
            ease: 'power2.out',
            onComplete: () => confetto.remove()
        });
    }
}

// ==================== SCREENSHOT ====================
function takeScreenshot() {
    // Utiliser html2canvas si disponible
    if (typeof html2canvas !== 'undefined') {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.download = 'birthday-moment.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert('📸 Fais une capture d\'écran avec ton téléphone ! 😊');
    }
}

// ==================== SCROLL TO TOP ====================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    generateQRCode();
    
    // Smooth scroll pour tous les liens d'ancre
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Détecter la section visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Empêcher le zoom sur double-tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Ajouter l'installation PWA (optionnel)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher un bouton d'installation si souhaité
    console.log('💡 L\'app peut être installée !');
});