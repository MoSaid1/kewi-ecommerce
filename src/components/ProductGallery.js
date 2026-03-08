const { useState } = React;

const ProductGallery = ({ images }) => {
    const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : 'assets/placeholder.png');
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    if (!images || images.length === 0) return <div>No Images</div>;

    return (
        <div className="product-gallery">
            {/* Main Showcase Image */}
            <div
                className={`product-gallery-main ${isZoomed ? 'zoomed' : ''}`}
                onClick={() => setIsZoomed(!isZoomed)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsZoomed(false)}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8fafc'
                }}
            >
                <img
                    src={mainImage}
                    alt="Main Product"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isZoomed ? 'none' : 'contain',
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        transform: isZoomed ? 'scale(2)' : 'scale(1)',
                        transition: isZoomed ? 'none' : 'transform 0.3s ease'
                    }}
                />
            </div>

            {/* Thumbnails Row */}
            <div className="product-gallery-thumbnails" style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => setMainImage(img)}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            border: mainImage === img ? '2px solid var(--primary-color)' : '1px solid #e2e8f0',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            flexShrink: 0,
                            opacity: mainImage === img ? 1 : 0.6,
                            transition: 'all 0.2s'
                        }}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

window.ProductGallery = ProductGallery;
