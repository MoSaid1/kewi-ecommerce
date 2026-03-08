const ProductPage = ({ id, t, language, country, rates }) => {
    const { useState, useEffect } = React;
    const productService = window.productService;
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch product logic simulating a network request
        setLoading(true);
        const data = productService.getProductById(id);
        if (data) {
            setProduct(data);
            // Fetch related pseudo query
            const related = productService.getProductsByCategory(data.category).filter(p => p.id !== data.id).slice(0, 4);
            setRelatedProducts(related);
        } else {
            setProduct(null); // Not found
        }

        // Scroll to top when new product page loads
        window.scrollTo(0, 0);

        // Slight delay to simulate loading for better UX
        setTimeout(() => {
            setLoading(false);
        }, 300);

    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '40px', color: 'var(--primary-color)', marginBottom: '20px' }}></i>
                <h2>{language === 'ar' ? 'جاري تحميل تفاصيل المنتج...' : 'Loading product details...'}</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <i className="fas fa-box-open" style={{ fontSize: '60px', color: '#cbd5e1', marginBottom: '20px' }}></i>
                <h1 style={{ color: '#0f172a', marginBottom: '16px' }}>{language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h1>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>{language === 'ar' ? 'عفواً، لم نتمكن من العثور على المنتج الذي تبحث عنه.' : 'Sorry, we couldn\'t find the product you are looking for.'}</p>
                <a href="#/" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--primary-color)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                    {language === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
                </a>
            </div>
        );
    }

    return (
        <main className="product-page-wrapper" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Breadcrumbs */}
            <nav style={{ fontSize: '13px', color: '#64748b', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a href="#/" style={{ color: '#64748b', textDecoration: 'none' }}>{language === 'ar' ? 'الرئيسية' : 'Home'}</a>
                <i className={`fas fa-chevron-${language === 'ar' ? 'left' : 'right'}`} style={{ fontSize: '10px' }}></i>
                <a href={`#/category/${product.category}`} style={{ color: '#64748b', textDecoration: 'none' }}>{product.category}</a>
                <i className={`fas fa-chevron-${language === 'ar' ? 'left' : 'right'}`} style={{ fontSize: '10px' }}></i>
                <span style={{ color: '#0f172a', fontWeight: '500' }}>{language === 'ar' ? product.titleAr : product.titleEn}</span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', marginBottom: '80px' }}>
                {/* Left Side: Images */}
                <ProductGallery images={product.images} />

                {/* Right Side: Information */}
                <ProductInfo product={product} language={language} t={t} country={country} rates={rates} />
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section style={{ marginTop: '80px', borderTop: '1px solid #e2e8f0', paddingTop: '60px' }}>
                    <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '30px', fontWeight: '800' }}>
                        {language === 'ar' ? 'قد يعجبك أيضاً' : 'You Might Be Interested In'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                        {relatedProducts.map(relProduct => (
                            <ProductCard
                                key={relProduct.id}
                                product={relProduct}
                                language={language}
                                country={country}
                                rates={rates}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

window.ProductPage = ProductPage;
