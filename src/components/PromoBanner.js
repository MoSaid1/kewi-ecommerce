const PromoBanner = ({ t }) => {
    return (
        <section className="promo-banner container section-padding">
            <div className="promo-inner">
                <div className="promo-text">
                    <h2>{t('promo_title')}</h2>
                    <p>{t('promo_desc')}</p>
                    <a href="#" className="btn btn-white">{t('shop_now')}</a>
                </div>
                <div className="promo-image">
                    <img src="assets/kewi_hero_banner.png" alt="Elegant Look" />
                </div>
            </div>
        </section>
    );
};
