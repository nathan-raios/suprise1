// Carte à gratter interactive - VERSION CORRIGÉE
class ScratchCard {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.scratchedPercentage = 0;
        this.isRevealed = false;
        
        this.init();
    }
    
    init() {
        // Adapter la taille du canvas
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Utiliser les dimensions du conteneur
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Créer la surface à gratter
        this.createScratchSurface();
        
        // Ajouter les écouteurs d'événements
        this.addEventListeners();
    }
    
    createScratchSurface() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Fond dégradé
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FF6B9D');
        gradient.addColorStop(0.3, '#C724B1');
        gradient.addColorStop(0.6, '#FEC601');
        gradient.addColorStop(1, '#FF6B9D');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ajouter des motifs décoratifs
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 30 + 10;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Texte instructif centré
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText('🎁 Gratte ici 🎁', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '18px Poppins';
        ctx.fillText('pour découvrir ton message', canvas.width / 2, canvas.height / 2 + 20);
        ctx.shadowBlur = 0;
    }
    
    addEventListeners() {
        // Souris
        this.canvas.addEventListener('mousedown', (e) => this.startScratching(e));
        this.canvas.addEventListener('mousemove', (e) => this.scratch(e));
        this.canvas.addEventListener('mouseup', () => this.stopScratching());
        this.canvas.addEventListener('mouseleave', () => this.stopScratching());
        
        // Touch (mobile)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startScratching(e.touches[0]);
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.scratch(e.touches[0]);
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopScratching();
        }, { passive: false });
    }
    
    startScratching(e) {
        if (this.isRevealed) return;
        this.isDrawing = true;
        this.scratch(e);
    }
    
    scratch(e) {
        if (!this.isDrawing || this.isRevealed) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Mode de composition pour "effacer"
        this.ctx.globalCompositeOperation = 'destination-out';
        
        // Dessiner un cercle plus grand pour un meilleur effet
        this.ctx.beginPath();
        this.ctx.arc(x, y, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tracer une ligne si on bouge (pour un grattage fluide)
        if (this.lastX !== undefined && this.lastY !== undefined) {
            this.ctx.lineWidth = 80;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        this.lastX = x;
        this.lastY = y;
        
        // Vérifier le pourcentage gratté (mais pas à chaque mouvement pour la performance)
        if (Math.random() < 0.1) {
            this.checkScratchPercentage();
        }
    }
    
    stopScratching() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.lastX = undefined;
        this.lastY = undefined;
        
        // Vérifier une dernière fois
        this.checkScratchPercentage();
    }
    
    checkScratchPercentage() {
        if (this.isRevealed) return;
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        let total = 0;
        
        // Vérifier chaque 4ème pixel pour la performance
        for (let i = 3; i < pixels.length; i += 16) {
            total++;
            if (pixels[i] < 128) { // Alpha < 128 = considéré comme transparent
                transparent++;
            }
        }
        
        this.scratchedPercentage = (transparent / total) * 100;
        
        // Si plus de 60% est gratté, révéler complètement
        if (this.scratchedPercentage > 60) {
            this.revealAll();
        }
    }
    
    revealAll() {
        if (this.isRevealed) return;
        this.isRevealed = true;
        
        // Animation de disparition du canvas
        gsap.to(this.canvas, {
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                this.canvas.style.display = 'none';
            }
        });
        
        // Animer le message secret avec un délai
        setTimeout(() => {
            const secretMessage = document.querySelector('.secret-message');
            if (secretMessage) {
                gsap.from(secretMessage, {
                    scale: 0.5,
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: 'back.out(1.7)'
                });
                
                // Animer chaque paragraphe séparément
                const paragraphs = secretMessage.querySelectorAll('p');
                paragraphs.forEach((p, index) => {
                    gsap.from(p, {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        delay: 0.3 + (index * 0.2),
                        ease: 'power2.out'
                    });
                });
            }
        }, 300);
    }
}

// Initialiser la carte à gratter au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que tout est chargé
    setTimeout(() => {
        const scratchCard = new ScratchCard('scratch-canvas');
        
        // Gérer le redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (scratchCard && !scratchCard.isRevealed) {
                    scratchCard.init();
                }
            }, 250);
        });
    }, 100);
});