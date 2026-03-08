const FlashSale = ({ t, country, rates, language }) => {
    const { useState, useEffect } = React;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (window.productService) {
            // Fetch products and take the first 6 for the Flash Sale section
            const allProducts = window.productService.getAllProducts();
            setProducts(allProducts.slice(0, 6));
        }
    }, []);

    return (
        <section className="flash-sale container section-padding">
            <div className="section-header">
                <h2 className="section-title">{t('title_flash_sale')}</h2>
            </div>
            <div className="product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} country={country} rates={rates} language={language} />)}
            </div>
        </section>
    );
};
