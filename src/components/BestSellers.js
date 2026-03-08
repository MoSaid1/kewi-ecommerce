const BestSellers = ({ t, country, rates, language }) => {
    const { useState, useEffect } = React;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (window.productService) {
            // Fetch products and take products from index 6 to 12 for Best Sellers
            const allProducts = window.productService.getAllProducts();
            setProducts(allProducts.slice(6, 12));
        }
    }, []);

    return (
        <section className="best-sellers container section-padding">
            <div className="section-header">
                <h2 className="section-title">{t('title_best_sellers')}</h2>
            </div>
            <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} country={country} rates={rates} language={language} />)}
            </div>
        </section>
    );
};
