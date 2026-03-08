const SizeSelector = ({ sizes, selectedSize, onSelectSize, language }) => {
    if (!sizes || sizes.length === 0) return null;

    return (
        <div className="size-selector" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', color: '#1e293b', marginBottom: '12px', fontWeight: 'bold' }}>
                {language === 'ar' ? 'المقاس:' : 'Size:'} <span style={{ fontWeight: 'normal', color: '#64748b' }}>{selectedSize || ''}</span>
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {sizes.map((size, idx) => {
                    const isSelected = selectedSize === size;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectSize(size)}
                            style={{
                                padding: '8px 16px',
                                minWidth: '48px',
                                border: isSelected ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
                                background: isSelected ? '#f0fdf4' : '#fff',
                                color: isSelected ? 'var(--primary-color)' : '#475569',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                transition: 'all 0.2s'
                            }}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

window.SizeSelector = SizeSelector;
