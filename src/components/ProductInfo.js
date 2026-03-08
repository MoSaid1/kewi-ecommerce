const { useState } = React;

const ProductInfo = ({ product, language, t, country, rates }) => {
    // Determine language fields
    const title = language === 'ar' ? product.titleAr : product.titleEn;
    const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;

    // State for selectors
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [quantity, setQuantity] = useState(1);

    // Pricing parsing from new Schema
    const countryCode = country?.code || 'UAE';
    const localizePricing = product.pricing?.[countryCode];

    if (!localizePricing || !localizePricing.visible) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }}></i>
                <h2>{language === 'ar' ? 'هذا المنتج غير متوفر في منطقتك' : 'This product is not available in your region.'}</h2>
                <a href={`#/${countryCode}/${language}`} style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', background: 'var(--primary-color)', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                    {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
                </a>
            </div>
        );
    }

    const currentPriceStr = `${localizePricing.price} ${countryCode === 'UAE' ? 'AED' : 'EGP'}`;
    const oldPriceStr = localizePricing.oldPrice ? `${localizePricing.oldPrice} ${countryCode === 'UAE' ? 'AED' : 'EGP'}` : null;

    const handleAddToCart = () => {
        // Mock add to cart interaction
        if (window.alert) {
            window.alert(language === 'ar'
                ? `تم إضافة ${quantity} من ${title} للسلة بنجاح!`
                : `Added ${quantity} of ${title} to cart successfully!`
            );
        }
    };

    return (
        <div className="product-info-panel" style={{ padding: '0 20px' }}>
            {/* Header */}
            <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '12px', fontWeight: '800' }}>{title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{currentPriceStr}</span>
                    {oldPriceStr && <span style={{ fontSize: '16px', textDecoration: 'line-through', color: '#94a3b8' }}>{oldPriceStr}</span>}
                </div>

                <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-star" style={{ color: '#fbbf24', fontSize: '14px' }}></i>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{product.rating}</span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>({product.reviews} {language === 'ar' ? 'تقييم' : 'Reviews'})</span>
                </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#475569', marginBottom: '30px' }}>
                {description}
            </p>

            {/* Selectors */}
            {product.colors && <ColorSelector colors={product.colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} language={language} />}
            {product.sizes && <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} language={language} />}

            {/* Model Info */}
            {product.modelInfo && (
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                    <div><i className="fas fa-ruler-vertical" style={{ marginRight: '6px', marginLeft: '6px' }}></i> {language === 'ar' ? 'طول العارضة:' : 'Model Height:'} <strong style={{ color: '#1e293b' }}>{product.modelInfo.height}cm</strong></div>
                    <div><i className="fas fa-tshirt" style={{ marginRight: '6px', marginLeft: '6px' }}></i> {language === 'ar' ? 'مقاس العارضة:' : 'Model Size:'} <strong style={{ color: '#1e293b' }}>{product.modelInfo.size}</strong></div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '30px', alignItems: 'stretch' }}>
                {/* Quantity */}
                <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0 16px', background: '#f8fafc', border: 'none', borderRight: language === 'ar' ? 'none' : '1px solid #cbd5e1', borderLeft: language === 'ar' ? '1px solid #cbd5e1' : 'none', cursor: 'pointer', fontSize: '18px', color: '#475569' }}>-</button>
                    <div style={{ width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', background: '#fff' }}>{quantity}</div>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0 16px', background: '#f8fafc', border: 'none', borderLeft: language === 'ar' ? 'none' : '1px solid #cbd5e1', borderRight: language === 'ar' ? '1px solid #cbd5e1' : 'none', cursor: 'pointer', fontSize: '18px', color: '#475569' }}>+</button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    style={{ flex: 1, padding: '16px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(62,180,137, 0.3)', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'none'}
                >
                    <i className="fas fa-shopping-bag"></i>
                    {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </button>

                {/* Wishlist */}
                <button style={{ width: '56px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '20px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                    <i className="far fa-heart"></i>
                </button>
            </div>

            {/* Delivery Features */}
            <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '14px' }}>
                    <i className="fas fa-truck" style={{ fontSize: '18px', color: '#64748b', width: '24px', textAlign: 'center' }}></i>
                    <span>{language === 'ar' ? 'توصيل مجاني للطلبات فوق 200 درهم' : 'Free shipping on orders over 200 AED'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '14px' }}>
                    <i className="fas fa-undo" style={{ fontSize: '18px', color: '#64748b', width: '24px', textAlign: 'center' }}></i>
                    <span>{language === 'ar' ? 'إرجاع مجاني خلال 14 يوم' : 'Free 14-day returns policy'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '14px' }}>
                    <i className="fas fa-shield-alt" style={{ fontSize: '18px', color: '#64748b', width: '24px', textAlign: 'center' }}></i>
                    <span>{language === 'ar' ? 'دفع آمن بنسبة 100%' : '100% secure checkout'}</span>
                </div>
            </div>
        </div>
    );
};

window.ProductInfo = ProductInfo;
