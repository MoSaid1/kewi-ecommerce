const App = () => {
    const { useState, useEffect } = React;
    const AdminDashboard = window.AdminDashboard;
    const ProductPage = window.ProductPage;
    const getInitialState = () => {
        const fullHash = window.location.hash;

        // Admin
        if (fullHash.startsWith('#/admin') || fullHash.startsWith('#admin')) {
            return { route: 'admin', isAdmin: true, lang: 'ar', country: { code: 'EGY', flag: 'assets/egypt.svg' }, productId: null };
        }

        // Product Page: #/UAE/en/product/id
        const productMatch = fullHash.match(/^#\/?([A-Z]{3})\/(en|ar)\/product\/(.+)$/);
        if (productMatch) {
            const [, pCountry, pLang, pId] = productMatch;
            const countryDef = pCountry === 'UAE' ? { code: 'UAE', flag: 'assets/uae.svg' } : { code: 'EGY', flag: 'assets/egypt.svg' };
            return { route: 'product', isAdmin: false, lang: pLang, country: countryDef, productId: pId };
        }

        // Storefront (Language/Country)
        const hash = fullHash.replace('#/', '').split('/');
        const defaultLang = 'ar';
        const defaultCountry = { code: 'EGY', flag: 'assets/egypt.svg' };

        if (hash.length === 2 && hash[0] !== '') {
            const [cCode, lCode] = hash;
            const validLang = ['en', 'ar'].includes(lCode) ? lCode : defaultLang;

            let validCountry = defaultCountry;
            if (cCode === 'UAE') validCountry = { code: 'UAE', flag: 'assets/uae.svg' };

            return { route: 'home', isAdmin: false, lang: validLang, country: validCountry, productId: null };
        }
        return { route: 'home', isAdmin: false, lang: defaultLang, country: defaultCountry, productId: null };
    };

    const initialState = getInitialState();
    const [route, setRoute] = useState(initialState.route);
    const [productId, setProductId] = useState(initialState.productId);
    const [isAdmin, setIsAdmin] = useState(initialState.isAdmin || false);
    const [language, setLanguage] = useState(initialState.lang);
    const [country, setCountry] = useState(initialState.country);

    // Load Slides from LocalStorage or use defaults
    const [heroSlides, setHeroSlides] = useState(() => {
        const saved = localStorage.getItem('kewi_hero_slides');
        const defaultSlides = [
            {
                desktopEn: 'assets/Kewi banner 1.webp', desktopAr: 'assets/Kewi banner 1.webp',
                mobileEn: 'assets/Kewi banner 1.webp', mobileAr: 'assets/Kewi banner 1.webp',
                link: '#'
            },
            {
                desktopEn: 'assets/Kewi banner 2.webp', desktopAr: 'assets/Kewi banner 2.webp',
                mobileEn: 'assets/Kewi banner 2.webp', mobileAr: 'assets/Kewi banner 2.webp',
                link: '#'
            }
        ];

        if (saved) {
            try {
                let parsed = JSON.parse(saved);

                // Migrate array-based (legacy) structures into EGY mapping
                if (Array.isArray(parsed)) {
                    const migratedArray = parsed.map(slide => {
                        if (typeof slide === 'string') {
                            return { desktopEn: slide, desktopAr: slide, mobileEn: slide, mobileAr: slide, link: '#' };
                        } else if (slide && slide.src) {
                            return { desktopEn: slide.src, desktopAr: slide.src, mobileEn: slide.src, mobileAr: slide.src, link: slide.link || '#' };
                        }
                        return slide || { desktopEn: '', desktopAr: '', mobileEn: '', mobileAr: '', link: '#' };
                    });
                    return { EGY: migratedArray, UAE: [] };
                }

                // If it's already an object, ensure EGY and UAE are specifically arrays
                return {
                    EGY: Array.isArray(parsed.EGY) ? parsed.EGY : [],
                    UAE: Array.isArray(parsed.UAE) ? parsed.UAE : []
                };

            } catch (e) { }
        }

        // Final Default if localstorage yields absolutely nothing
        return { EGY: defaultSlides, UAE: [] };
    });

    // Load Global Settings
    const [siteSettings, setSiteSettings] = useState(() => {
        const saved = localStorage.getItem('kewi_site_settings');
        const defaultSettings = {
            heroSlideDuration: 4000,
            allowedImageFormats: '.jpg,.jpeg,.png,.webp',
            maxImageSizeMb: 5
        };

        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) { }
        }
        return defaultSettings;
    });

    // Load Categories
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('kewi_categories');
        const defaultCategories = [
            { id: 1, image: 'assets/kewi_dress.png', titleAr: 'فساتين', titleEn: 'Dresses', link: '#' },
            { id: 2, image: 'assets/kewi_look.png', titleAr: 'عبايات', titleEn: 'Abayas', link: '#' },
            { id: 3, image: 'assets/kewi_look.png', titleAr: 'بيجامات', titleEn: 'Pajamas', link: '#' },
            { id: 4, image: 'assets/kewi_dress.png', titleAr: 'تنانير', titleEn: 'Skirts', link: '#' },
            { id: 5, image: 'assets/kewi_bag.png', titleAr: 'حقائب', titleEn: 'Bags', link: '#' },
            { id: 6, image: 'assets/kewi_hero_banner.png', titleAr: 'وصل حديثاً', titleEn: 'New Arrivals', link: '#' }
        ];

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) { }
        }
        return defaultCategories;
    });

    // Save slides to LocalStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('kewi_hero_slides', JSON.stringify(heroSlides));
        } catch (error) {
            console.error("Failed to save slides to localStorage. They may be too large.", error);
            if (window.alert) window.alert("⚠️ المساحة ممتلئة! حجم الصور المرفوعة كبير جداً ولا يمكن حفظه في المتصفح. يرجى تقليل حجم الصور.");
        }
    }, [heroSlides]);

    // Save settings to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem('kewi_site_settings', JSON.stringify(siteSettings));
        } catch (error) {
            console.error("Failed to save settings to localStorage.", error);
        }
    }, [siteSettings]);

    // Save categories to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem('kewi_categories', JSON.stringify(categories));
        } catch (error) {
            console.error("Failed to save categories to localStorage.", error);
            if (window.alert) window.alert("⚠️ المساحة ممتلئة! حجم صور الأقسام كبير جداً ولا يمكن حفظه.");
        }
    }, [categories]);

    // Sync state changes back to the URL Hash
    useEffect(() => {
        if (route === 'admin' || route === 'product') {
            return; // don't sync URL on edit/product pages, keep it distinct
        }
        const newHash = `/${country.code}/${language}`;
        if (window.location.hash !== `#${newHash}`) {
            window.location.hash = newHash;
        }
    }, [language, country, route]);

    // Listen for manual browser back/forward Hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const newState = getInitialState();
            setRoute(newState.route);
            setProductId(newState.productId);
            setIsAdmin(newState.isAdmin || false);
            setLanguage(newState.lang);
            setCountry(newState.country);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Translation Logic 
    useEffect(() => {
        if (language === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.lang = 'en';
        }
    }, [language]);

    const dict = window.translations ? window.translations[language] : {};

    const t = (key) => dict && dict[key] ? dict[key] : key;

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
    };

    const handleCountryChange = (code, flag) => {
        setCountry({ code, flag });
    };

    if (route === 'admin') {
        return (
            <AdminDashboard
                t={t}
                language={language}
                heroSlides={heroSlides}
                setHeroSlides={setHeroSlides}
                siteSettings={siteSettings}
                setSiteSettings={setSiteSettings}
                categories={categories}
                setCategories={setCategories}
                onExit={() => {
                    window.location.hash = '#/';
                }}
            />
        );
    }

    if (route === 'product' && productId) {
        return (
            <div className="app-main">
                <TopBar language={language} country={country} onLanguageChange={handleLanguageChange} onCountryChange={handleCountryChange} t={t} />
                <Header t={t} />
                <ProductPage id={productId} t={t} language={language} country={country} rates={window.rates} />
                <Footer t={t} />
            </div>
        );
    }

    return (
        <div className="app-main">
            <HomePage
                language={language}
                country={country}
                handleLanguageChange={handleLanguageChange}
                handleCountryChange={handleCountryChange}
                t={t}
                heroSlides={heroSlides}
                siteSettings={siteSettings}
                categories={categories}
            />
        </div>
    );
};

// Start rendering App
const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(<App />);
