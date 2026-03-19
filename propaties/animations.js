// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Hero Animation
    gsap.from('.animated-headline', { duration: 1, y: -50, opacity: 0 });
    gsap.from('.search-bar', { duration: 1, y: 50, opacity: 0, delay: 0.5 });

    // Scroll Reveal
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.property-card, .testimonial, .agent').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8
        });
    });

    // Navbar Animation
    gsap.from('.navbar', { duration: 0.5, y: -100, opacity: 0 });

    // Stats Animation Trigger
    ScrollTrigger.create({
        trigger: '.stats',
        start: 'top 80%',
        onEnter: () => animateStats()
    });
});