const ProductForm = ({ language, t, initialProduct, onSave, onCancel, categories }) => {
    const { useState, useEffect } = React;
    const productService = window.productService;
    const isEditMode = !!initialProduct;

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        titleEn: '',
        titleAr: '',
        descriptionAr: '',
        pricing: {
            UAE: { visible: true, price: '', oldPrice: '' },
            EGY: { visible: true, price: '', oldPrice: '' }
        },
        currency: 'AED',
        images: [''],
        colors: [],
        sizes: [],
        category: categories && categories.length > 0 ? categories[0].titleEn : '',
        badge: 'none',
        modelInfo: { height: '', size: '' }
    });

    // Populate if editing
    useEffect(() => {
        if (isEditMode && initialProduct) {
            setFormData({
                ...initialProduct,
                pricing: initialProduct.pricing || {
                    UAE: { visible: true, price: initialProduct.price || '', oldPrice: initialProduct.oldPrice || '' },
                    EGY: { visible: true, price: initialProduct.price || '', oldPrice: initialProduct.oldPrice || '' }
                },
                images: initialProduct.images?.length > 0 ? initialProduct.images : [''],
                colors: initialProduct.colors || [],
                sizes: initialProduct.sizes || [],
                badge: initialProduct.badge || 'none',
                modelInfo: initialProduct.modelInfo || { height: '', size: '' }
            });
        }
    }, [isEditMode, initialProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIdChange = (e) => {
        // Only allow english letters and numbers, no spaces
        const cleanVal = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        setFormData(prev => ({ ...prev, id: cleanVal }));
    };

    const handleModelChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            modelInfo: { ...prev.modelInfo, [name]: value }
        }));
    };

    const handlePricingChange = (region, field, value) => {
        setFormData(prev => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [region]: {
                    ...prev.pricing[region],
                    [field]: value
                }
            }
        }));
    };

    // Images Arrays
    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };
    const addImageInput = () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    const removeImageInput = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            const newImages = [...formData.images];
            newImages[index] = base64String;
            setFormData(prev => ({ ...prev, images: newImages }));
        };
        reader.readAsDataURL(file);
    };

    // Sizes Array Checkboxes
    const AVAILABLE_SIZES = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44'];

    const toggleSize = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    // Note: To keep things simple without complex color pickers, adding colors is simplified
    // In a full app this would be a detailed sub-form. We will mock a simple comma string approach for now.

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clean data before saving
        const finalData = { ...formData };
        if (finalData.badge === 'none') finalData.badge = null;
        if (!finalData.modelInfo.height && !finalData.modelInfo.size) finalData.modelInfo = null;

        // Parse pricing values
        ['UAE', 'EGY'].forEach(region => {
            finalData.pricing[region].price = parseFloat(finalData.pricing[region].price) || 0;
            finalData.pricing[region].oldPrice = parseFloat(finalData.pricing[region].oldPrice) || null;
        });

        finalData.images = finalData.images.filter(img => img.trim() !== '');

        if (!isEditMode) {
            const existing = productService.getProductById(finalData.id);
            if (existing) {
                if (window.alert) window.alert(language === 'ar' ? 'معرف المنتج هذا موجود بالفعل. يرجى اختيار معرف آخر.' : 'This Product ID already exists. Please choose another.');
                return;
            }
        }

        try {
            if (isEditMode) {
                productService.updateProduct(finalData.id, finalData);
            } else {
                productService.createProduct(finalData);
            }
            if (window.alert) window.alert(language === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved successfully!');
            onSave();
        } catch (error) {
            if (window.alert) window.alert(language === 'ar' ? 'حدث خطأ أثناء الحفظ.' : 'Error saving product.');
        }
    };

    return (
        <div className="admin-product-form" style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <div className="admin-card-title" style={{ margin: 0 }}>
                    <i className={`fas fa-${isEditMode ? 'edit' : 'plus-circle'}`}></i>
                    {isEditMode ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Create New Product')}
                </div>
                <button onClick={onCancel} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <i className="fas fa-arrow-left" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0' }}></i>
                    {language === 'ar' ? 'رجوع' : 'Back'}
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>

                {/* Basic Info */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>
                        <i className="fas fa-info-circle" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: 'var(--primary-color)' }}></i>
                        {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'معرف المنتج (حروف إنجليزية وأرقام فقط وبدون مسافات)' : 'Product ID (English letters & numbers only, no spaces)'}</label>
                            <input type="text" name="id" value={formData.id} onChange={handleIdChange} placeholder="e.g. dress001" pattern="[A-Za-z0-9]+" title={language === 'ar' ? "حروف إنجليزية وأرقام فقط وبدون مسافات" : "English letters and numbers only, no spaces"} disabled={isEditMode} style={{ background: isEditMode ? '#e2e8f0' : '#fff' }} required />
                        </div>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'القسم (Category)' : 'Category'}</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                {categories && categories.map(c => (
                                    <option key={c.titleEn || c.id} value={c.titleEn}>{language === 'ar' ? c.titleAr : c.titleEn}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Localization */}
                <div style={{ padding: '20px', background: '#fcf8fa', borderRadius: '8px', border: '1px solid #fce7f3' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#831843' }}>
                        <i className="fas fa-language" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: '#db2777' }}></i>
                        {language === 'ar' ? 'الترجمة والنصوص' : 'Localization'}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* English */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="admin-input-group">
                                <label>Title (English)</label>
                                <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} required />
                            </div>
                            <div className="admin-input-group">
                                <label>Description (English)</label>
                                <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleChange} rows="4" required></textarea>
                            </div>
                        </div>
                        {/* Arabic */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', direction: 'rtl' }}>
                            <div className="admin-input-group">
                                <label>الاسم (عربي)</label>
                                <input type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} required />
                            </div>
                            <div className="admin-input-group">
                                <label>الوصف (عربي)</label>
                                <textarea name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} rows="4" required></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Visibility - UAE */}
                <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: '#14532d' }}>
                            <img src="assets/uae.svg" alt="UAE" style={{ width: '20px', margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', verticalAlign: 'middle' }} />
                            {language === 'ar' ? 'التسعير والظهور (الإمارات)' : 'Pricing & Visibility (UAE)'}
                        </h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#16a34a', fontWeight: 'bold' }}>
                            <input type="checkbox" checked={formData.pricing.UAE.visible} onChange={(e) => handlePricingChange('UAE', 'visible', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#16a34a' }} />
                            {language === 'ar' ? 'تفعيل في الإمارات' : 'Active in UAE'}
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', opacity: formData.pricing.UAE.visible ? 1 : 0.5 }}>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'السعر الحالي (AED)' : 'Current Price (AED)'}</label>
                            <input type="number" value={formData.pricing.UAE.price} onChange={(e) => handlePricingChange('UAE', 'price', e.target.value)} required={formData.pricing.UAE.visible} min="0" disabled={!formData.pricing.UAE.visible} />
                        </div>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'السعر القديم (للتخفيضات)' : 'Old Price (Strikethrough)'}</label>
                            <input type="number" value={formData.pricing.UAE.oldPrice} onChange={(e) => handlePricingChange('UAE', 'oldPrice', e.target.value)} min="0" disabled={!formData.pricing.UAE.visible} />
                        </div>
                    </div>
                </div>

                {/* Pricing & Visibility - Egypt */}
                <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: '#78350f' }}>
                            <img src="assets/egypt.svg" alt="EGY" style={{ width: '20px', margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', verticalAlign: 'middle' }} />
                            {language === 'ar' ? 'التسعير والظهور (مصر)' : 'Pricing & Visibility (Egypt)'}
                        </h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#b45309', fontWeight: 'bold' }}>
                            <input type="checkbox" checked={formData.pricing.EGY.visible} onChange={(e) => handlePricingChange('EGY', 'visible', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#d97706' }} />
                            {language === 'ar' ? 'تفعيل في مصر' : 'Active in EGY'}
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', opacity: formData.pricing.EGY.visible ? 1 : 0.5 }}>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'السعر الحالي (EGP)' : 'Current Price (EGP)'}</label>
                            <input type="number" value={formData.pricing.EGY.price} onChange={(e) => handlePricingChange('EGY', 'price', e.target.value)} required={formData.pricing.EGY.visible} min="0" disabled={!formData.pricing.EGY.visible} />
                        </div>
                        <div className="admin-input-group">
                            <label>{language === 'ar' ? 'السعر القديم (للتخفيضات)' : 'Old Price (Strikethrough)'}</label>
                            <input type="number" value={formData.pricing.EGY.oldPrice} onChange={(e) => handlePricingChange('EGY', 'oldPrice', e.target.value)} min="0" disabled={!formData.pricing.EGY.visible} />
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e3a8a' }}>
                        <i className="fas fa-certificate" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: '#3b82f6' }}></i>
                        {language === 'ar' ? 'شارة المنتج' : 'Product Badge'}
                    </h4>
                    <div className="admin-input-group">
                        <select name="badge" value={formData.badge} onChange={handleChange} style={{ width: '100%', maxWidth: '300px' }}>
                            <option value="none">{language === 'ar' ? 'بدون' : 'None'}</option>
                            <option value="new">{language === 'ar' ? 'جديد (New)' : 'New'}</option>
                            <option value="sale">{language === 'ar' ? 'تخفيض (Sale)' : 'Sale'}</option>
                        </select>
                    </div>
                </div>

                {/* Images */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <i className="fas fa-images" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: '#3b82f6' }}></i>
                            {language === 'ar' ? 'صور المنتج' : 'Product Images'}
                        </div>
                        <button type="button" onClick={addImageInput} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                            <i className="fas fa-plus" style={{ margin: '0 4px' }}></i> {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
                        </button>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {formData.images.map((img, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                {img && (
                                    <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                                        <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(idx, e)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
                                />
                                {formData.images.length > 1 && (
                                    <button type="button" onClick={() => removeImageInput(idx)} style={{ padding: '8px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details (Sizes / Models) */}
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>
                        <i className="fas fa-ruler-combined" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: '#8b5cf6' }}></i>
                        {language === 'ar' ? 'المقاسات والعارضة' : 'Sizes & Model Info'}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        <div className="admin-input-group">
                            <label style={{ marginBottom: '12px', display: 'block', fontWeight: 'bold' }}>{language === 'ar' ? 'المقاسات المتوفرة' : 'Available Sizes'}</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {AVAILABLE_SIZES.map(size => (
                                    <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: formData.sizes.includes(size) ? 'var(--primary-color)' : '#fff', color: formData.sizes.includes(size) ? '#fff' : '#475569', border: `1px solid ${formData.sizes.includes(size) ? 'var(--primary-color)' : '#cbd5e1'}`, padding: '6px 12px', borderRadius: '20px', fontSize: '14px', transition: 'all 0.2s' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.sizes.includes(size)}
                                            onChange={() => toggleSize(size)}
                                            style={{ display: 'none' }}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="admin-input-group">
                                <label>{language === 'ar' ? 'طول العارضة (cm)' : 'Model Height (cm)'}</label>
                                <input type="number" name="height" value={formData.modelInfo.height} onChange={handleModelChange} placeholder="170" />
                            </div>
                            <div className="admin-input-group">
                                <label>{language === 'ar' ? 'مقاس العارضة' : 'Model Size'}</label>
                                <input type="text" name="size" value={formData.modelInfo.size} onChange={handleModelChange} placeholder="S" />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" style={{ padding: '16px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(62,180,137, 0.3)' }}>
                    <i className="fas fa-save"></i>
                    {language === 'ar' ? 'حفظ المنتج' : 'Save Product'}
                </button>
            </form>
        </div>
    );
};

window.ProductForm = ProductForm;

window.ProductForm = ProductForm;
