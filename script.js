document.addEventListener("DOMContentLoaded", () => {
    // Force manual scroll restoration to prevent auto-scrolling on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Interactive Button Navigation
    const enterButton = document.getElementById("enterStory");

    if (enterButton) {
        enterButton.addEventListener("click", (e) => {
            const targetUrl = enterButton.getAttribute("href") || "chapter1.html";
            if (targetUrl && targetUrl !== "#") {
                e.preventDefault();
                document.body.classList.add("leaving");
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    }

    // 2. Floating Dust Particle Canvas Engine
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor(window.innerWidth / 20);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});