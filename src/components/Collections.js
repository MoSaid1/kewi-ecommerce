const Collections = () => {
    return (
        <section className="collections container section-padding">
            <div className="collection-grid">
                <a href="#" className="collection-banner">
                    <img src="assets/kewi_look.png" alt="Abaya Collection" />
                    <div className="collection-content">
                        <h3>Abaya Collection</h3>
                        <span className="btn btn-outline">Shop Now</span>
                    </div>
                </a>
                <a href="#" className="collection-banner">
                    <img src="assets/kewi_hero_banner.png" alt="Pajamas Collection" />
                    <div className="collection-content">
                        <h3>Pajamas Collection</h3>
                        <span className="btn btn-outline">Shop Now</span>
                    </div>
                </a>
                <a href="#" className="collection-banner">
                    <img src="assets/kewi_dress.png" alt="Skirts Collection" />
                    <div className="collection-content">
                        <h3>Skirts Collection</h3>
                        <span className="btn btn-outline">Shop Now</span>
                    </div>
                </a>
            </div>
        </section>
    );
};
