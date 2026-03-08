const BagsSection = ({ t }) => {
    return (
        <section className="bags-section container section-padding">
            <div className="section-header">
                <h2 className="section-title">{t('title_bags')}</h2>
            </div>
            <div className="bags-grid">
                <div className="bag-card"><img src="assets/kewi_bag.png" alt="Bag 1" /></div>
                <div className="bag-card"><img src="assets/kewi_bag.png" alt="Bag 2" /></div>
                <div className="bag-card"><img src="assets/kewi_bag.png" alt="Bag 3" /></div>
                <div className="bag-card"><img src="assets/kewi_bag.png" alt="Bag 4" /></div>
            </div>
        </section>
    );
};
