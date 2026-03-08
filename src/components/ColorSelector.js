const ColorSelector = ({ colors, selectedColor, onSelectColor, language }) => {
    if (!colors || colors.length === 0) return null;

    return (
        <div className="color-selector" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', color: '#1e293b', marginBottom: '12px', fontWeight: 'bold' }}>
                {language === 'ar' ? 'اللون:' : 'Color:'} <span style={{ fontWeight: 'normal', color: '#64748b' }}>{selectedColor ? (language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn) : ''}</span>
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {colors.map((color, idx) => {
                    const isSelected = selectedColor && selectedColor.hex === color.hex;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelectColor(color)}
                            title={language === 'ar' ? color.nameAr : color.nameEn}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: color.hex,
                                border: isSelected ? '2px solid var(--primary-color)' : '1px solid #cbd5e1',
                                padding: '2px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                outline: isSelected ? '2px solid #fff' : 'none',
                                outlineOffset: '-4px',
                                boxShadow: isSelected ? '0 0 0 2px var(--primary-color)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

window.ColorSelector = ColorSelector;
