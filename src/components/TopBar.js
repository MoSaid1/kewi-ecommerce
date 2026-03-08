const TopBar = ({ language, country, onLanguageChange, onCountryChange, t }) => {
    return (
        <div className="top-bar">
            <div className="container top-bar-inner">
                <div className="top-bar-left">
                    <div className="dropdown">
                        <button className="dropdown-btn">
                            <i className="fas fa-globe"></i>
                            {language === 'ar' ? 'العربية' : 'English'}
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <a href="#" onClick={(e) => { e.preventDefault(); onLanguageChange('en'); }}>English</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLanguageChange('ar'); }}>العربية</a>
                        </div>
                    </div>
                    <div className="dropdown" id="country-dropdown">
                        <button className="dropdown-btn">
                            <img src={country.flag} alt={`${country.code} Flag`} className="flag-icon" />
                            <span>{country.code === 'UAE' ? t('country_uae') || 'United Arab Emirates' : t('country_egy') || 'Egypt'}</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <a href="#" onClick={(e) => { e.preventDefault(); onCountryChange('UAE', 'assets/uae.svg'); }}>
                                <img src="assets/uae.svg" alt="UAE Flag" className="flag-icon" />
                                <span>{t('country_uae') || 'United Arab Emirates'}</span> (AED)
                            </a>
                            <a href="#" onClick={(e) => { e.preventDefault(); onCountryChange('EGY', 'assets/egypt.svg'); }}>
                                <img src="assets/egypt.svg" alt="Egypt Flag" className="flag-icon" />
                                <span>{t('country_egy') || 'Egypt'}</span> (EGP)
                            </a>
                        </div>
                    </div>
                </div>
                <div className="top-bar-right">
                    <a href="#/admin" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</a>
                    <a href="#">{t('help')}</a>
                    <a href="#">{t('contact')}</a>
                    <a href="#">{t('faqs')}</a>
                    <a href="#">{t('order_tracking')}</a>
                </div>
            </div>
        </div>
    );
};
