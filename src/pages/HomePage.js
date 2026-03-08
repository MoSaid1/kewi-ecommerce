const HomePage = ({
    language,
    country,
    handleLanguageChange,
    handleCountryChange,
    t,
    heroSlides,
    siteSettings,
    categories
}) => {
    return (
        <div className="home-page-container">
            <TopBar
                language={language}
                country={country}
                onLanguageChange={handleLanguageChange}
                onCountryChange={handleCountryChange}
                t={t}
            />
            <Header t={t} />
            <Hero slides={heroSlides[country.code] || []} language={language} duration={siteSettings.heroSlideDuration} />
            <Categories t={t} categories={categories} language={language} />
            <FlashSale t={t} country={country} rates={window.rates} language={language} />
            <Recommended t={t} />
            <Collections />
            <PromoBanner t={t} />
            <BestSellers t={t} country={country} rates={window.rates} language={language} />
            <BagsSection t={t} />
            <Footer t={t} />
        </div>
    );
};

window.HomePage = HomePage;
