const Recommended = ({ t }) => {
    return (
        <section className="recommended section-padding">
            <div className="container recommended-container">
                <div className="section-header light-text">
                    <h2 className="section-title">{t('title_recommended')}</h2>
                    <a href="#" className="see-all"><span>{t('see_all')}</span> <i className="fas fa-arrow-right"></i></a>
                </div>
                <div className="recommended-grid">
                    <div className="rec-card">
                        <img src="assets/kewi_look.png" alt="Formal Look" />
                        <div className="rec-info">
                            <h3>Formal Look</h3>
                            <p>Explore professional styles</p>
                        </div>
                    </div>
                    <div className="rec-card">
                        <img src="assets/kewi_hero_banner.png" alt="Casual Look" />
                        <div className="rec-info">
                            <h3>Casual Look</h3>
                            <p>Everyday comfort</p>
                        </div>
                    </div>
                    <div className="rec-card">
                        <img src="assets/kewi_look.png" alt="Formal Look" />
                        <div className="rec-info">
                            <h3>Formal Look</h3>
                            <p>Elegant and chic</p>
                        </div>
                    </div>
                    <div className="rec-card">
                        <img src="assets/kewi_hero_banner.png" alt="Casual Look" />
                        <div className="rec-info">
                            <h3>Casual Look</h3>
                            <p>Relaxed fits</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
