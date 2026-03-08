const Hero = ({ slides, language, duration = 4000 }) => {
    const { useState, useEffect } = React;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-play
    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, duration);
        return () => clearInterval(timer);
    }, [slides.length, duration]);

    return (
        <section className="hero">
            <div className="hero-slider-container">
                {slides.map((slide, index) => {
                    let src = '';
                    let link = '#';

                    // Legacy String Migration Fallback
                    if (typeof slide === 'string') {
                        src = slide;
                    }
                    // New Object Structure handling
                    else if (slide) {
                        link = slide.link || '#';
                        // Determine which language + device image to pick
                        if (isMobile) {
                            src = language === 'ar' ? (slide.mobileAr || slide.mobileEn || slide.src) : (slide.mobileEn || slide.src);
                        } else {
                            src = language === 'ar' ? (slide.desktopAr || slide.desktopEn || slide.src) : (slide.desktopEn || slide.src);
                        }
                    }

                    return (
                        <a href={link} key={index} className={`hero-image-wrapper ${index === currentSlide ? 'active' : ''}`}>
                            <img src={src} alt={`Hero Campaign ${index + 1}`} className="hero-model" />
                        </a>
                    );
                })}

                {/* Navigation Dots */}
                <div className="hero-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
