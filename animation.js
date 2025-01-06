import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';




// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo img');
    const navItems = document.querySelectorAll('nav ul li');
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');

    // Create a timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animation sequence
    tl.fromTo(header, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(logo, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.5')
      .fromTo(navItems, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo(h1, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
      .fromTo(h2, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');



function starsGreen() {
    return new Promise((resolve) => {
        const stars = document.querySelectorAll('.star');
                    
        const totalStars = stars.length + 5; // Add 5 more stars
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const baseRadius = 250; // Base circular radius of 250px
        const radiusVariation = 100; // Allow stars to be placed within 100px outside the base radius

        let animationsCompleted = 0;

        for (let i = 0; i < totalStars; i++) {
            let star = stars[i];
            if (!star) {
                star = document.createElement('div');
                star.classList.add("star");
                document.querySelector('.stars-container').appendChild(star);
            }

            let xPos, yPos, size;

            if (i < totalStars / 2) {
                // Half of the stars closer to left and right corners
                const side = i % 2 === 0 ? 'left' : 'right';
                const verticalPosition = gsap.utils.random(0, window.innerHeight);
                if (side === 'left') {
                    xPos = gsap.utils.random(0, centerX / 2); // Left half of the left side
                } else {
                    xPos = gsap.utils.random(centerX * 1.5, window.innerWidth); // Right half of the right side
                }
                yPos = verticalPosition;

                // Calculate distance from center
                const distanceFromCenter = Math.sqrt(Math.pow(xPos - centerX, 2) + Math.pow(yPos - centerY, 2));
                const maxDistance = Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2));
                
                // Adjust size based on distance (farther = larger), but cap at 5px
                size = Math.min(gsap.utils.mapRange(0, maxDistance, 1, 5, distanceFromCenter), 5);
            } else {
                // The other half in a circle
                const angle = gsap.utils.random(0, Math.PI * 2);
                const radius = baseRadius + gsap.utils.random(0, radiusVariation);
                xPos = centerX + Math.cos(angle) * radius;
                yPos = centerY + Math.sin(angle) * radius;

                // Adjust size based on distance from base circle (closer = smaller), but cap at 5px
                const distanceFromBaseCircle = Math.abs(radius - baseRadius);
                size = Math.min(gsap.utils.mapRange(0, radiusVariation, 1, 5, distanceFromBaseCircle), 5);
            }
            
            // Determine the starting position
            const startX = xPos < centerX ? 0 : window.innerWidth;
            const startY = yPos < centerY ? 0 : window.innerHeight;

            // Set initial glow (dimmer)
            const initialGlowSize = size * 1.5;
            const initialGlowOpacity = 0.2;

            gsap.set(star, {
                width: size,
                height: size,
                left: startX,
                top: startY,
                xPercent: -50,
                yPercent: -50,
                opacity: 0,
                backgroundColor: '#4CAF00', // Darker green
                borderRadius: '50%',
                boxShadow: `
                    0 0 ${initialGlowSize / 2}px ${initialGlowSize / 4}px rgba(76, 175, 0, ${initialGlowOpacity}),
                    0 0 ${initialGlowSize}px ${initialGlowSize / 2}px rgba(76, 175, 0, ${initialGlowOpacity * 0.5})
                `
            });

            gsap.to(star, {
                duration: 3, // Set duration to 3 seconds
                left: xPos,
                top: yPos,
                opacity: 0.8, // Reduced opacity
                ease: 'power1.out', // Changed to power1 ease
                onComplete: () => {
                    animationsCompleted++;
                    if (animationsCompleted === totalStars) {
                        resolve();
                    }
                }
            });

            // Add random glow effect
            const glowDuration = gsap.utils.random(1, 3);
            const glowDelay = gsap.utils.random(0, 2);
            gsap.to(star, {
                duration: glowDuration,
                boxShadow: `
                    0 0 ${size * 4}px ${size * 2}px rgba(76, 175, 0, 0.8),
                    0 0 ${size * 8}px ${size * 4}px rgba(76, 175, 0, 0.6)
                `,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut', // Quick then slow
                delay: glowDelay
            });
        }
    });
}
starsGreen();

function bigNumber() {
    const animatedNumbers = [
        document.getElementById('animatedNumber'),
        document.getElementById('animatedNumber2')
    ];
    
    gsap.registerPlugin(ScrollTrigger);

    animatedNumbers.forEach(number => {
        gsap.to(number, {
            scrollTrigger: {
                trigger: number,
                start: "top bottom",
                end: "bottom center",
                scrub: true,
                toggleActions: "play reverse play reverse"
            },
            skewX: 25,
            skewY: 15,
            rotationZ: -30,
            duration: 0.3,
            ease: "power2.out",
            color: '#00ff00',
            scale: 1.1,
        });

        // Reset animation when scrolling back up
        ScrollTrigger.create({
            trigger: number,
            start: "top bottom",
            onLeaveBack: () => {
                gsap.to(number, {
                    skewX: 0,
                    skewY: 0,
                    rotationZ: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    color: '#4CAF50',
                    scale: 1,
                });
            }
        });
    });
}

bigNumber();
});


     