const Header = ({ t }) => {
    return (
        <header className="header">
            <div className="container header-inner">
                <a href="#" className="logo"><img src="assets/logo.svg" alt="Kewi" /></a>
                <nav className="main-nav">
                    <a href="#">{t('nav_women')}</a>
                    <a href="#">{t('nav_kids')}</a>
                    <a href="#" className="text-red">{t('nav_sale')}</a>
                    <a href="#">{t('nav_just_dropped')}</a>
                    <a href="#">{t('nav_best_sellers')}</a>
                    <a href="#">{t('nav_trending')}</a>
                    <a href="#" className="text-red">{t('nav_hot_deals')}</a>
                </nav>
                <div className="header-right">
                    <div className="search-container">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder={t('search_placeholder')} />
                    </div>
                    <div className="header-actions">
                        <a href="#" className="action-btn">
                            <i className="far fa-user"></i><span>{t('login')}</span>
                        </a>
                        <a href="#" className="action-btn">
                            <i className="far fa-heart"></i><span>{t('favorites')}</span>
                        </a>
                        <a href="#" className="action-btn">
                            <i className="fas fa-shopping-bag"></i><span>{t('cart')}</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};
