const Categories = ({ t, categories, language }) => {
    return (
        <section className="categories container section-padding">
            <div className="category-scroll">
                {categories.map((cat, index) => (
                    <a href={cat.link || '#'} className="category-item" key={cat.id || index}>
                        <div className="cat-img-wrap">
                            <img src={cat.image} alt={language === 'ar' ? cat.titleAr : cat.titleEn} />
                        </div>
                        <span>{language === 'ar' ? cat.titleAr : cat.titleEn}</span>
                    </a>
                ))}
            </div>
        </section>
    );
};
