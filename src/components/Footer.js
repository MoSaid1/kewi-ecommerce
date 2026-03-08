const Footer = ({ t }) => {
    return (
        <footer className="footer">
            <div className="newsletter-section">
                <div className="container newsletter-inner">
                    <h2>{t('newsletter_title')}</h2>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder={t('newsletter_placeholder')} required />
                        <button type="submit" className="btn btn-primary">{t('subscribe')}</button>
                    </form>
                </div>
            </div>

            <div className="footer-main container">
                <div className="footer-col brand-col">
                    <a href="#" className="logo footer-logo"><img src="assets/logo.svg" alt="Kewi" /></a>
                    <p>{t('footer_about')}</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-tiktok"></i></a>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>{t('footer_countries')}</h4>
                    <ul>
                        <li><a href="#">{t('country_sa')}</a></li>
                        <li><a href="#">{t('country_uae')}</a></li>
                        <li><a href="#">{t('country_kw')}</a></li>
                        <li><a href="#">{t('country_qa')}</a></li>
                        <li><a href="#">{t('country_bh')}</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{t('footer_top_cat')}</h4>
                    <ul>
                        <li><a href="#">{t('nav_women')}</a></li>
                        <li><a href="#">{t('nav_kids')}</a></li>
                    </ul>
                    <h4 className="mt-4">{t('footer_about_us')}</h4>
                    <ul>
                        <li><a href="#">{t('footer_about_link')}</a></li>
                        <li><a href="#">{t('footer_privacy')}</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{t('footer_cust_service')}</h4>
                    <ul>
                        <li><a href="#">{t('order_tracking')}</a></li>
                        <li><a href="#">{t('footer_order_returns')}</a></li>
                        <li><a href="#">{t('footer_refund')}</a></li>
                        <li><a href="#">{t('faqs')}</a></li>
                        <li><a href="#">{t('footer_delivery')}</a></li>
                        <li><a href="#">{t('footer_returns')}</a></li>
                    </ul>
                </div>
                <div className="footer-col app-col">
                    <h4>{t('footer_download_app')}</h4>
                    <div className="app-buttons">
                        <a href="#" className="app-btn"><i className="fab fa-apple"></i> <span>{t('app_store')}</span></a>
                        <a href="#" className="app-btn"><i className="fab fa-google-play"></i> <span>{t('google_play')}</span></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>{t('copyright')}</p>
                </div>
            </div>
        </footer>
    );
};
