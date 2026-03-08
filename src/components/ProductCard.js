const ProductCard = ({ product, language, onAddToCart, rates, country }) => {
    // Determine title and description based on language
    const title = language === 'ar' ? product.titleAr : product.titleEn;

    // Price and Visibility calculation based on new Schema
    const countryCode = country?.code || 'UAE';
    const localizePricing = product.pricing?.[countryCode];

    // If the product is not explicitly visible in this country, do not render the card.
    if (!localizePricing || !localizePricing.visible) {
        return null; // Hide the card entirely
    }

    const currentPriceStr = `${localizePricing.price} ${countryCode === 'UAE' ? 'AED' : 'EGP'}`;
    const oldPriceStr = localizePricing.oldPrice ? `${localizePricing.oldPrice} ${countryCode === 'UAE' ? 'AED' : 'EGP'}` : null;

    return (
        <a
            href={`#/${countryCode}/${language}/product/${product.id}`}
            className="product-card"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
            <div className="product-image-container">
                {product.badge && (
                    <span className={`product-badge ${product.badge === 'sale' ? 'sale-badge' : 'new-badge'}`}>
                        {product.badge === 'sale' ? (language === 'ar' ? 'تخفيض' : 'Sale') : (language === 'ar' ? 'جديد' : 'New')}
                    </span>
                )}
                <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'assets/placeholder.png'}
                    alt={title}
                    className="product-image"
                />

                {/* Secondary Image on Hover if available */}
                {product.images && product.images.length > 1 && (
                    <img
                        src={product.images[1]}
                        alt={`${title} hover`}
                        className="product-image-hover"
                    />
                )}

                <div className="product-actions">
                    <button className="icon-btn" onClick={(e) => { e.preventDefault(); /* Add to Wishlist */ }}>
                        <i className="far fa-heart"></i>
                    </button>
                    <button
                        className="icon-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onAddToCart) onAddToCart(product);
                        }}
                    >
                        <i className="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-title">{title}</h3>
                <div className="product-price-row">
                    <span className="current-price">{currentPriceStr}</span>
                    {oldPriceStr && <span className="old-price">{oldPriceStr}</span>}
                </div>

                {/* Color swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="product-colors" style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {product.colors.map((color, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    backgroundColor: color.hex, border: '1px solid #e2e8f0'
                                }}
                                title={language === 'ar' ? color.nameAr : color.nameEn}
                            />
                        ))}
                    </div>
                )}

                <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                    <div style={{ color: '#fbbf24' }}>
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < Math.floor(product.rating || 5) ? "fas fa-star" : "far fa-star"} style={{ fontSize: '10px' }}></i>
                        ))}
                    </div>
                    <span>({product.reviews || 0})</span>
                </div>
            </div>
        </a>
    );
};

window.ProductCard = ProductCard;
