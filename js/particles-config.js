// Configuration des particules pour le fond animé
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#FF6B9D', '#FEC601', '#C724B1', '#FFFFFF']
        },
        shape: {
            type: ['circle', 'heart'],
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 8,
            random: true,
            anim: {
                enable: true,
                speed: 3,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'top',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'bubble'
            },
            onclick: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 200,
                size: 12,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    retina_detect: true
});

// Créer des coeurs personnalisés pour particles
if (window.pJSDom && window.pJSDom[0]) {
    const canvas = window.pJSDom[0].pJS.canvas.el;
    const ctx = canvas.getContext('2d');
    
    // Dessiner un coeur
    function drawHeart(x, y, size, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        
        // Courbe gauche
        ctx.bezierCurveTo(
            x, y,
            x - size / 2, y,
            x - size / 2, y + topCurveHeight
        );
        
        ctx.bezierCurveTo(
            x - size / 2, y + (size + topCurveHeight) / 2,
            x, y + (size + topCurveHeight) / 2,
            x, y + size
        );
        
        // Courbe droite
        ctx.bezierCurveTo(
            x, y + (size + topCurveHeight) / 2,
            x + size / 2, y + (size + topCurveHeight) / 2,
            x + size / 2, y + topCurveHeight
        );
        
        ctx.bezierCurveTo(
            x + size / 2, y,
            x, y,
            x, y + topCurveHeight
        );
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}