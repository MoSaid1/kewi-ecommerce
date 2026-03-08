const AdminDashboard = ({ t, language, heroSlides, setHeroSlides, siteSettings, setSiteSettings, categories, setCategories, onExit }) => {
    const { useState, useEffect } = React;
    const ProductList = window.ProductList;
    const ProductForm = window.ProductForm;
    const [activeTab, setActiveTab] = useState('hero');
    const [editingCountry, setEditingCountry] = useState('EGY');
    const [newSlideLink, setNewSlideLink] = useState('#');
    const [toastMsg, setToastMsg] = useState('');
    const [editingSlideIndex, setEditingSlideIndex] = useState(null);

    // Distinct states for the 4 variants
    const [newImages, setNewImages] = useState({
        desktopEn: '', desktopAr: '', mobileEn: '', mobileAr: ''
    });

    // Categories State
    const [newCategory, setNewCategory] = useState({ titleAr: '', titleEn: '', link: '', image: '' });
    const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

    // Dynamic Product Management State
    const [productView, setProductView] = useState('list'); // 'list' or 'form'
    const [editingProductId, setEditingProductId] = useState(null);

    // Delete Modal State
    const [deletePrompt, setDeletePrompt] = useState({ isOpen: false, type: null, index: null });

    const showToast = () => {
        setToastMsg(language === 'ar' ? '✅ تم الحفظ بنجاح!' : '✅ Changes Saved!');
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleAddSlide = () => {
        // Require at least one image to be provided
        if (Object.values(newImages).some(url => url.trim() !== '')) {
            const currentCountrySlides = heroSlides[editingCountry] || [];
            const safeHeroSlides = {
                EGY: heroSlides.EGY || [],
                UAE: heroSlides.UAE || []
            };
            const updatedSlides = {
                ...safeHeroSlides,
                [editingCountry]: [...currentCountrySlides, { ...newImages, link: newSlideLink.trim() }]
            };
            setHeroSlides(updatedSlides);
            setNewImages({ desktopEn: '', desktopAr: '', mobileEn: '', mobileAr: '' });
            setNewSlideLink('#');
            showToast();
        }
    };

    const handleFileUpload = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const maxSize = (siteSettings?.maxImageSizeMb || 5) * 1024 * 1024;
        if (file.size > maxSize) {
            setToastMsg(language === 'ar' ? `⚠️ الملف كبير جداً! الحد الأقصى ${siteSettings.maxImageSizeMb} ميجا.` : `⚠️ File too large! Max ${siteSettings.maxImageSizeMb}MB.`);
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }

        const allowedFormats = (siteSettings?.allowedImageFormats || '.jpg,.jpeg,.png,.webp').split(',');
        const isAllowed = allowedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
        if (!isAllowed) {
            setToastMsg(language === 'ar' ? '⚠️ صيغة الملف غير مدعومة!' : '⚠️ Invalid file format!');
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImages(prev => ({ ...prev, [key]: reader.result }));
            showToast(); // Optional UX feedback that it was loaded to memory
        };
        reader.readAsDataURL(file);
    };

    const updateImageField = (key, value) => {
        setNewImages(prev => ({ ...prev, [key]: value }));
    };

    const requestRemoveSlide = (index) => {
        setDeletePrompt({ isOpen: true, type: 'slide', index });
    };

    const moveSlide = (index, offset) => {
        const currentCountrySlides = heroSlides[editingCountry] || [];
        const newIndex = index + offset;
        if (newIndex < 0 || newIndex >= currentCountrySlides.length) return;

        const newSlidesArray = [...currentCountrySlides];
        // Swap
        [newSlidesArray[index], newSlidesArray[newIndex]] = [newSlidesArray[newIndex], newSlidesArray[index]];

        const safeHeroSlides = { EGY: heroSlides.EGY || [], UAE: heroSlides.UAE || [] };
        setHeroSlides({ ...safeHeroSlides, [editingCountry]: newSlidesArray });
        showToast();
    };

    const updateExistingSlideImage = (index, key, value) => {
        const currentCountrySlides = heroSlides[editingCountry] || [];
        const newSlidesArray = [...currentCountrySlides];
        const currentSlide = newSlidesArray[index];
        // Ensure it's an object first
        const slideObj = typeof currentSlide === 'string' ? { desktopEn: currentSlide, desktopAr: currentSlide, mobileEn: currentSlide, mobileAr: currentSlide, link: '#' } : { ...currentSlide };
        slideObj[key] = value;
        newSlidesArray[index] = slideObj;

        const safeHeroSlides = { EGY: heroSlides.EGY || [], UAE: heroSlides.UAE || [] };
        setHeroSlides({ ...safeHeroSlides, [editingCountry]: newSlidesArray });
    };

    const handleExistingFileUpload = (e, index, key) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const maxSize = (siteSettings?.maxImageSizeMb || 5) * 1024 * 1024;
        if (file.size > maxSize) {
            setToastMsg(language === 'ar' ? `⚠️ الملف كبير جداً! الحد الأقصى ${siteSettings.maxImageSizeMb} ميجا.` : `⚠️ File too large! Max ${siteSettings.maxImageSizeMb}MB.`);
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }

        const allowedFormats = (siteSettings?.allowedImageFormats || '.jpg,.jpeg,.png,.webp').split(',');
        const isAllowed = allowedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
        if (!isAllowed) {
            setToastMsg(language === 'ar' ? '⚠️ صيغة الملف غير مدعومة!' : '⚠️ Invalid file format!');
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            updateExistingSlideImage(index, key, reader.result);
            showToast();
        };
        reader.readAsDataURL(file);
    };

    const updateSlideLink = (index, newLink) => {
        const currentCountrySlides = heroSlides[editingCountry] || [];
        const newSlidesArray = [...currentCountrySlides];
        const currentSlide = newSlidesArray[index];
        if (typeof currentSlide === 'string') {
            newSlidesArray[index] = { src: currentSlide, link: newLink };
        } else {
            newSlidesArray[index] = { ...currentSlide, link: newLink };
        }

        const safeHeroSlides = { EGY: heroSlides.EGY || [], UAE: heroSlides.UAE || [] };
        setHeroSlides({ ...safeHeroSlides, [editingCountry]: newSlidesArray });
    };

    // --- Category Handlers ---
    const handleAddCategory = async () => {
        if (!newCategory.titleAr || !newCategory.titleEn || !newCategory.image) {
            setToastMsg(language === 'ar' ? '⚠️ يرجى تعبئة الحقول الأساسية (الاسم والصورة)' : '⚠️ Please fill required fields (Name & Image)');
            setTimeout(() => setToastMsg(''), 3000);
            return;
        }
        try {
            await window.kewiApi.createCategory({
                titleAr: newCategory.titleAr,
                titleEn: newCategory.titleEn,
                image: newCategory.image,
                link: newCategory.link || '#',
                sort_order: (categories || []).length
            });
            const fresh = await window.kewiApi.getCategories();
            setCategories(fresh);
            setNewCategory({ image: '', titleAr: '', titleEn: '', link: '#' });
            showToast();
        } catch (err) {
            setToastMsg('⚠️ خطأ في الحفظ: ' + err.message);
            setTimeout(() => setToastMsg(''), 3000);
        }
    };

    const requestRemoveCategory = (index) => {
        setDeletePrompt({ isOpen: true, type: 'category', index });
    };

    const confirmDelete = async () => {
        if (deletePrompt.type === 'slide') {
            const currentCountrySlides = heroSlides[editingCountry] || [];
            const updatedCountrySlides = currentCountrySlides.filter((_, i) => i !== deletePrompt.index);
            const safeHeroSlides = { EGY: heroSlides.EGY || [], UAE: heroSlides.UAE || [] };
            setHeroSlides({ ...safeHeroSlides, [editingCountry]: updatedCountrySlides });
            showToast();
        } else if (deletePrompt.type === 'category') {
            const cat = (categories || [])[deletePrompt.index];
            if (cat && cat.id) {
                try {
                    await window.kewiApi.deleteCategory(cat.id);
                    const fresh = await window.kewiApi.getCategories();
                    setCategories(fresh);
                    showToast();
                } catch (err) {
                    setToastMsg('⚠️ خطأ في الحذف: ' + err.message);
                    setTimeout(() => setToastMsg(''), 3000);
                }
            }
        }
        setDeletePrompt({ isOpen: false, type: null, index: null });
    };

    const cancelDelete = () => {
        setDeletePrompt({ isOpen: false, type: null, index: null });
    };

    const moveCategory = (index, offset) => {
        const newIndex = index + offset;
        const catArray = categories || [];
        if (newIndex < 0 || newIndex >= catArray.length) return;
        const updated = [...catArray];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setCategories(updated);
        showToast();
    };

    const updateExistingCategory = async (index, key, value) => {
        const updated = [...(categories || [])];
        updated[index] = { ...updated[index], [key]: value };
        setCategories(updated); // optimistic update
        // Persist to MySQL
        const cat = updated[index];
        if (cat && cat.id) {
            try {
                await window.kewiApi.updateCategory(cat.id, {
                    titleAr: cat.titleAr,
                    titleEn: cat.titleEn,
                    image: cat.image,
                    link: cat.link || '#',
                    sort_order: cat.sort_order || index
                });
            } catch (err) {
                console.error('Category update error:', err);
            }
        }
    };

    const handleCategoryFileUpload = (e, isNew, indexForExisting = null) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const maxSize = (siteSettings?.maxImageSizeMb || 5) * 1024 * 1024;
        if (file.size > maxSize) {
            setToastMsg(language === 'ar' ? `⚠️ الملف كبير جداً! الحد الأقصى ${siteSettings.maxImageSizeMb} ميجا.` : `⚠️ File too large! Max ${siteSettings.maxImageSizeMb}MB.`);
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }
        const allowedFormats = (siteSettings?.allowedImageFormats || '.jpg,.jpeg,.png,.webp').split(',');
        const isAllowed = allowedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
        if (!isAllowed) {
            setToastMsg(language === 'ar' ? '⚠️ صيغة الملف غير مدعومة!' : '⚠️ Invalid file format!');
            setTimeout(() => setToastMsg(''), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (isNew) {
                setNewCategory(prev => ({ ...prev, image: reader.result }));
            } else if (indexForExisting !== null) {
                updateExistingCategory(indexForExisting, 'image', reader.result);
            }
            showToast();
        };
        reader.readAsDataURL(file);
    };

    const handleSaveLink = () => {
        showToast();
    };

    const updateSetting = (key, value) => {
        setSiteSettings({ ...siteSettings, [key]: value });
    };

    return (
        <div className="admin-layout" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <i className="fas fa-cog"></i>
                    <h2>{language === 'ar' ? 'لوحة القيادة' : 'Dashboard'}</h2>
                </div>
                <nav className="admin-nav">
                    {/* Storefront Group */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ padding: '0 16px', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            {language === 'ar' ? 'واجهة المتجر' : 'Storefront'}
                        </div>
                        <button
                            className={`admin-nav-item ${activeTab === 'hero' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hero')}
                        >
                            <i className="far fa-image"></i>
                            {language === 'ar' ? 'البانر الرئيسي' : 'Hero Slider'}
                        </button>
                    </div>

                    {/* Catalog Group */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ padding: '0 16px', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            {language === 'ar' ? 'الكتالوج' : 'Catalog'}
                        </div>
                        <button
                            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            <i className="fas fa-th-large"></i>
                            {language === 'ar' ? 'الأقسام (Categories)' : 'Categories'}
                        </button>
                        <button
                            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <i className="fas fa-tags"></i>
                            {language === 'ar' ? 'المنتجات (Products)' : 'Products'}
                        </button>
                    </div>

                    {/* Settings Group */}
                    <div>
                        <div style={{ padding: '0 16px', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            {language === 'ar' ? 'النظام' : 'System'}
                        </div>
                        <button
                            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <i className="fas fa-cog"></i>
                            {language === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1>
                        {activeTab === 'hero' && (language === 'ar' ? 'إدارة السلايدر الرئيسي' : 'Manage Hero Slider')}
                        {activeTab === 'products' && (language === 'ar' ? 'إدارة المنتجات' : 'Manage Products')}
                        {activeTab === 'settings' && (language === 'ar' ? 'إعدادات الموقع' : 'Site Settings')}
                    </h1>
                    <button className="btn btn-primary" onClick={onExit}>
                        <i className="fas fa-store" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0' }}></i>
                        {language === 'ar' ? 'العودة للمتجر' : 'Return to Store'}
                    </button>
                </header>

                {/* Hero Manager Tab Content */}
                {activeTab === 'hero' && (
                    <div className="admin-card">
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <button
                                onClick={() => { setEditingCountry('EGY'); setEditingSlideIndex(null); }}
                                style={{ flex: 1, padding: '12px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: editingCountry === 'EGY' ? '2px solid #22c55e' : '1px solid #cbd5e1', background: editingCountry === 'EGY' ? '#f0fdf4' : '#fff', color: editingCountry === 'EGY' ? '#166534' : '#475569', transition: 'all 0.2s' }}
                            >
                                <img src="assets/egypt.svg" alt="EGY" style={{ width: '20px', margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', verticalAlign: 'middle' }} />
                                {language === 'ar' ? 'بانرات مصر' : 'Egypt Banners'}
                            </button>
                            <button
                                onClick={() => { setEditingCountry('UAE'); setEditingSlideIndex(null); }}
                                style={{ flex: 1, padding: '12px', fontSize: '15px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: editingCountry === 'UAE' ? '2px solid #22c55e' : '1px solid #cbd5e1', background: editingCountry === 'UAE' ? '#f0fdf4' : '#fff', color: editingCountry === 'UAE' ? '#166534' : '#475569', transition: 'all 0.2s' }}
                            >
                                <img src="assets/uae.svg" alt="UAE" style={{ width: '20px', margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', verticalAlign: 'middle' }} />
                                {language === 'ar' ? 'بانرات الإمارات' : 'UAE Banners'}
                            </button>
                        </div>

                        <div className="admin-card-title">
                            <i className="fas fa-plus-circle"></i>
                            {language === 'ar' ? `إضافة شريحة جديدة (${editingCountry === 'EGY' ? 'مصر' : 'الإمارات'})` : `Add New Slide (${editingCountry})`}
                        </div>

                        <div className="admin-input-group" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
                            <label style={{ fontSize: '15px', color: '#1e293b' }}>
                                <i className="fas fa-link" style={{ margin: language === 'ar' ? '0 0 0 8px' : '0 8px 0 0', color: 'var(--primary-color)' }}></i>
                                {language === 'ar' ? 'الرابط عند الضغط (Destination Link)' : 'Destination Link'}
                            </label>
                            <input
                                type="text"
                                placeholder={language === 'ar' ? "مثال: #/EGY/ar/category" : "e.g. #/EGY/en/category"}
                                value={newSlideLink}
                                onChange={(e) => setNewSlideLink(e.target.value)}
                            />
                            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                                {language === 'ar' ? 'الرابط الذي سيذهب إليه العميل عند النقر على البانر.' : 'Where the user goes after clicking.'}
                            </p>
                        </div>

                        {/* 2x2 Image Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                            {[
                                { key: 'desktopAr', titleAr: 'بـانر عـربي (كـمبيوتر)', titleEn: 'Desktop Banner (AR)', icon: 'desktop', color: '#3b82f6' },
                                { key: 'desktopEn', titleAr: 'بـانر إنجليزي (كـمبيوتر)', titleEn: 'Desktop Banner (EN)', icon: 'desktop', color: '#0ea5e9' },
                                { key: 'mobileAr', titleAr: 'بـانر عـربي (موبـايل)', titleEn: 'Mobile Banner (AR)', icon: 'mobile-alt', color: '#8b5cf6' },
                                { key: 'mobileEn', titleAr: 'بـانر إنجليزي (موبـايل)', titleEn: 'Mobile Banner (EN)', icon: 'mobile-alt', color: '#d946ef' }
                            ].map(input => (
                                <div key={input.key} style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <h5 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <i className={`fas fa-${input.icon}`} style={{ color: input.color, background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}></i>
                                        {language === 'ar' ? input.titleAr : input.titleEn}
                                    </h5>

                                    <div className="admin-input-group" style={{ marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder={language === 'ar' ? "رابط الصورة الخارجي (URL)" : "External Image URL"}
                                            value={newImages[input.key]}
                                            onChange={(e) => updateImageField(input.key, e.target.value)}
                                        />
                                    </div>

                                    <div style={{ position: 'relative', textAlign: 'center', margin: '16px 0' }}>
                                        <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: 0 }} />
                                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 10px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
                                            {language === 'ar' ? 'أو' : 'OR'}
                                        </span>
                                    </div>

                                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%', borderRadius: '8px', background: '#f8fafc', border: '1px dashed #94a3b8', transition: 'all 0.2s', textAlign: 'center', padding: '16px 0' }}>
                                        <i className="fas fa-cloud-upload-alt" style={{ fontSize: '24px', color: '#64748b', marginBottom: '8px' }}></i>
                                        <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>{language === 'ar' ? 'اضغط لرفع صورة' : 'Click to Upload'}</div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, input.key)}
                                            style={{ position: 'absolute', left: 0, top: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                        />
                                    </div>

                                    {/* Preview Block */}
                                    {newImages[input.key] && (
                                        <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                                            <img src={newImages[input.key]} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button type="button" onClick={handleAddSlide} style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 'bold', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(62,180,137, 0.2)' }}>
                            <i className="fas fa-plus-circle"></i>
                            {language === 'ar' ? 'إضافة الشريحة الجديدة بالمجموعة' : 'Add New Slide Batch'}
                        </button>

                        <div className="admin-card-title" style={{ marginTop: '40px' }}>
                            <i className="fas fa-images"></i>
                            {language === 'ar' ? `الشرائح الحالية (${editingCountry === 'EGY' ? 'مصر' : 'الإمارات'})` : `Current Slides (${editingCountry})`}
                        </div>
                        <div className="admin-grid-slides">
                            {(heroSlides[editingCountry] || []).map((slide, index) => {
                                const slideObj = typeof slide === 'string'
                                    ? { desktopEn: slide, desktopAr: slide, mobileEn: slide, mobileAr: slide, link: '#' }
                                    : slide;

                                return (
                                    <div key={index} className="admin-slide-item">
                                        <div style={{ position: 'relative' }}>
                                            <img src={slideObj.desktopAr || slideObj.src || slideObj} alt={`Slide ${index}`} className="admin-slide-image" />
                                            <button
                                                className="btn-danger"
                                                onClick={() => requestRemoveSlide(index)}
                                                style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                                                title={language === 'ar' ? 'حذف' : 'Delete'}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="admin-slide-info">
                                            <div style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1e293b' }}>
                                                <span>{language === 'ar' ? `الشريحة #${index + 1}` : `Slide #${index + 1}`}</span>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        onClick={() => moveSlide(index, -1)}
                                                        disabled={index === 0}
                                                        style={{ cursor: index === 0 ? 'not-allowed' : 'pointer', border: '1px solid #e2e8f0', background: index === 0 ? '#f8fafc' : '#fff', color: index === 0 ? '#cbd5e1' : '#475569', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                        title={language === 'ar' ? 'تحريك للأمام' : 'Move Forward'}
                                                    >
                                                        <i className={`fas fa-chevron-${language === 'ar' ? 'right' : 'left'}`} style={{ fontSize: '12px' }}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => moveSlide(index, 1)}
                                                        disabled={index === (heroSlides[editingCountry] || []).length - 1}
                                                        style={{ cursor: index === (heroSlides[editingCountry] || []).length - 1 ? 'not-allowed' : 'pointer', border: '1px solid #e2e8f0', background: index === (heroSlides[editingCountry] || []).length - 1 ? '#f8fafc' : '#fff', color: index === (heroSlides[editingCountry] || []).length - 1 ? '#cbd5e1' : '#475569', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                        title={language === 'ar' ? 'تحريك للخلف' : 'Move Backward'}
                                                    >
                                                        <i className={`fas fa-chevron-${language === 'ar' ? 'left' : 'right'}`} style={{ fontSize: '12px' }}></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                                <div style={{ flex: 1, position: 'relative' }}>
                                                    <i className="fas fa-link" style={{ position: 'absolute', left: language === 'ar' ? 'auto' : '10px', right: language === 'ar' ? '10px' : 'auto', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px' }}></i>
                                                    <input
                                                        type="text"
                                                        value={slideObj.link || '#'}
                                                        onChange={(e) => updateSlideLink(index, e.target.value)}
                                                        style={{ width: '100%', padding: '8px 10px', paddingLeft: language === 'ar' ? '10px' : '28px', paddingRight: language === 'ar' ? '28px' : '10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#334155' }}
                                                        placeholder="Destination URL"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleSaveLink}
                                                    style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                                                >
                                                    {language === 'ar' ? 'حفظ' : 'Save'}
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => setEditingSlideIndex(editingSlideIndex === index ? null : index)}
                                                style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: '600', background: editingSlideIndex === index ? '#475569' : '#f1f5f9', color: editingSlideIndex === index ? '#fff' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                            >
                                                <i className={`fas fa-${editingSlideIndex === index ? 'times' : 'edit'}`}></i>
                                                {editingSlideIndex === index ? (language === 'ar' ? 'إغلاق المحرر' : 'Close Editor') : (language === 'ar' ? 'تعديل صور الشريحة' : 'Edit Slide Images')}
                                            </button>

                                            {/* Modern Accordion Editor for Existing Slides */}
                                            {editingSlideIndex === index && (
                                                <div style={{ marginTop: '12px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                                        {[
                                                            { key: 'desktopAr', label: language === 'ar' ? 'كمبيوتر (عربي)' : 'Desktop (AR)', icon: 'desktop', color: '#3b82f6' },
                                                            { key: 'desktopEn', label: language === 'ar' ? 'كمبيوتر (إنجليزي)' : 'Desktop (EN)', icon: 'desktop', color: '#0ea5e9' },
                                                            { key: 'mobileAr', label: language === 'ar' ? 'موبايل (عربي)' : 'Mobile (AR)', icon: 'mobile-alt', color: '#8b5cf6' },
                                                            { key: 'mobileEn', label: language === 'ar' ? 'موبايل (إنجليزي)' : 'Mobile (EN)', icon: 'mobile-alt', color: '#d946ef' }
                                                        ].map(f => {
                                                            const currentVal = slideObj[f.key] || '';
                                                            return (
                                                                <div key={f.key} style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                                                                    <div style={{ fontSize: '12px', color: '#1e293b', marginBottom: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                        <i className={`fas fa-${f.icon}`} style={{ color: f.color }}></i>
                                                                        {f.label}
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={currentVal.startsWith('data:') ? '' : currentVal}
                                                                        onChange={(e) => updateExistingSlideImage(index, f.key, e.target.value)}
                                                                        placeholder="External Image URL"
                                                                        style={{ width: '100%', padding: '8px', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '8px', background: '#fff' }}
                                                                    />
                                                                    <div style={{ position: 'relative', overflow: 'hidden', display: 'block', width: '100%', borderRadius: '4px', background: '#fff', border: '1px dashed #cbd5e1', textAlign: 'center', padding: '8px 0', cursor: 'pointer' }}>
                                                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                                                                            <i className="fas fa-upload" style={{ margin: '0 6px' }}></i>
                                                                            {language === 'ar' ? 'أو ارفع ملف' : 'Or upload file'}
                                                                        </div>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(e) => handleExistingFileUpload(e, index, f.key)}
                                                                            style={{ position: 'absolute', left: 0, top: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <button onClick={handleSaveLink} style={{ width: '100%', fontSize: '13px', fontWeight: 'bold', padding: '10px', marginTop: '16px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(62, 180, 137, 0.2)' }}>
                                                        <i className="fas fa-check" style={{ margin: '0 6px' }}></i>
                                                        {language === 'ar' ? 'تأكيد التعديلات' : 'Confirm Edits'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
                }

                {/* Settings Tab Content */}
                {
                    activeTab === 'settings' && siteSettings && (
                        <div className="admin-card">
                            <div className="admin-card-title" style={{ marginBottom: '30px' }}>
                                <i className="fas fa-sliders-h"></i>
                                {language === 'ar' ? 'الإعدادات العامة للمتجر' : 'General Store Settings'}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '600px' }}>
                                {/* Slide Duration Component */}
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <i className="fas fa-stopwatch" style={{ fontSize: '20px', color: '#3b82f6', margin: language === 'ar' ? '0 0 0 10px' : '0 10px 0 0' }}></i>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>{language === 'ar' ? 'وقت البانر (بالمللي ثانية)' : 'Slide Duration (ms)'}</h4>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                        {language === 'ar' ? 'الوقت الذي تستغرقه الشريحة قبل الانتقال للتالية (1000 مللي ثانية = 1 ثانية).' : 'Time each slide stays on screen before transitioning (1000ms = 1 second).'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="number"
                                            value={siteSettings.heroSlideDuration}
                                            onChange={(e) => updateSetting('heroSlideDuration', parseInt(e.target.value) || 4000)}
                                            style={{ flex: 1, padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                        />
                                        <button onClick={showToast} className="btn btn-primary">{language === 'ar' ? 'حفظ' : 'Save'}</button>
                                    </div>
                                </div>

                                {/* Max Image Size Component */}
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <i className="fas fa-weight-hanging" style={{ fontSize: '20px', color: '#0ea5e9', margin: language === 'ar' ? '0 0 0 10px' : '0 10px 0 0' }}></i>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>{language === 'ar' ? 'حجم الصور المسموح (Max Size MB)' : 'Max Allowed Image Size (MB)'}</h4>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                        {language === 'ar' ? 'الحد الأقصى لحجم الصورة المرفوعة لحماية سرعة الموقع.' : 'Maximum allowed upload size to protect website performance.'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="number"
                                            value={siteSettings.maxImageSizeMb}
                                            onChange={(e) => updateSetting('maxImageSizeMb', parseInt(e.target.value) || 5)}
                                            style={{ flex: 1, padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                        />
                                        <button onClick={showToast} className="btn btn-primary">{language === 'ar' ? 'حفظ' : 'Save'}</button>
                                    </div>
                                </div>

                                {/* Allowed Image Formats Component */}
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <i className="fas fa-file-image" style={{ fontSize: '20px', color: '#8b5cf6', margin: language === 'ar' ? '0 0 0 10px' : '0 10px 0 0' }}></i>
                                        <h4 style={{ margin: 0, color: '#1e293b' }}>{language === 'ar' ? 'صيغ الصور المسموحة (Formats)' : 'Allowed File Formats'}</h4>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                        {language === 'ar' ? 'أنواع الملفات المسموح برفعها في البانرات. افصل بينها بفاصلة.' : 'Extensions allowed in file uploads. Comma separated.'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={siteSettings.allowedImageFormats}
                                            onChange={(e) => updateSetting('allowedImageFormats', e.target.value)}
                                            style={{ flex: 1, padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px', direction: 'ltr' }}
                                        />
                                        <button onClick={showToast} className="btn btn-primary">{language === 'ar' ? 'حفظ' : 'Save'}</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                }

                {/* Products & Categories Tab */}
                {
                    activeTab === 'products' && (
                        <div>
                            {/* Product Datatable & Forms */}
                            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '2px dashed #cbd5e1' }}>
                                {productView === 'list' && (
                                    <ProductList
                                        language={language}
                                        t={t}
                                        onCreateNew={() => { setEditingProductId(null); setProductView('form'); }}
                                        onEditProduct={(id) => { setEditingProductId(id); setProductView('form'); }}
                                    />
                                )}

                                {productView === 'form' && (
                                    <ProductForm
                                        language={language}
                                        t={t}
                                        categories={categories}
                                        initialProduct={editingProductId ? window.productService?.getProductById(editingProductId) : null}
                                        onSave={() => setProductView('list')}
                                        onCancel={() => setProductView('list')}
                                    />
                                )}
                            </div>
                        </div>
                    )
                }

                {/* Categories Tab Content */}
                {
                    activeTab === 'categories' && (
                        <div>
                            {/* Add New Category Panel */}
                            <div className="admin-card-title">
                                <i className="fas fa-folder-plus"></i>
                                {language === 'ar' ? 'إضافة قسم جديد' : 'Add New Category'}
                            </div>

                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '32px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>

                                    <div className="admin-input-group">
                                        <label style={{ fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>{language === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                        <input type="text" value={newCategory.titleAr} onChange={(e) => setNewCategory(p => ({ ...p, titleAr: e.target.value }))} placeholder="مثال: فساتين" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '6px' }} />
                                    </div>

                                    <div className="admin-input-group">
                                        <label style={{ fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
                                        <input type="text" value={newCategory.titleEn} onChange={(e) => setNewCategory(p => ({ ...p, titleEn: e.target.value }))} placeholder="e.g. Dresses" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '6px' }} />
                                    </div>

                                    <div className="admin-input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>{language === 'ar' ? 'الرابط (Link)' : 'Link URL'}</label>
                                        <input type="text" value={newCategory.link} onChange={(e) => setNewCategory(p => ({ ...p, link: e.target.value }))} placeholder="#/category" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '6px', direction: 'ltr' }} />
                                    </div>

                                    <div className="admin-input-group" style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>{language === 'ar' ? 'صورة القسم' : 'Category Image'}</label>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            {newCategory.image && (
                                                <img src={newCategory.image} alt="Preview" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                                            )}
                                            <div style={{ position: 'relative', flex: 1, padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                                                <i className="fas fa-cloud-upload-alt" style={{ color: '#94a3b8', fontSize: '24px', marginBottom: '8px' }}></i>
                                                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{language === 'ar' ? 'اضغط لرفع صورة أو اسحب الملف هنا' : 'Click to upload image'}</div>
                                                <input type="file" accept="image/*" onChange={(e) => handleCategoryFileUpload(e, true)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" onClick={handleAddCategory} style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 'bold', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(62,180,137, 0.3)', transition: 'all 0.2s' }}>
                                    <i className="fas fa-plus-circle"></i>
                                    {language === 'ar' ? 'إضافة القسم للمتجر' : 'Add Category to Store'}
                                </button>
                            </div>

                            {/* Existing Categories */}
                            <div className="admin-card-title">
                                <i className="fas fa-layer-group"></i>
                                {language === 'ar' ? 'إدارة الأقسام الحالية' : 'Manage Existing Categories'}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {(categories || []).map((cat, index) => (
                                    <div key={cat.id || index} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img src={cat.image} alt={cat.titleEn} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>
                                                    {language === 'ar' ? cat.titleAr : cat.titleEn}
                                                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 'normal', margin: '0 6px' }}>
                                                        ({language === 'ar' ? cat.titleEn : cat.titleAr})
                                                    </span>
                                                </h4>
                                                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <i className="fas fa-link" style={{ color: '#cbd5e1' }}></i>
                                                    <span style={{ direction: 'ltr', display: 'inline-block' }}>{cat.link}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ display: 'flex', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <button onClick={() => moveCategory(index, -1)} disabled={index === 0} style={{ padding: '8px 12px', background: 'transparent', border: 'none', borderRight: language === 'ar' ? 'none' : '1px solid #e2e8f0', borderLeft: language === 'ar' ? '1px solid #e2e8f0' : 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#cbd5e1' : '#475569', transition: '0.2s' }} title={language === 'ar' ? 'أعلى' : 'Move Up'}>
                                                        <i className="fas fa-arrow-up"></i>
                                                    </button>
                                                    <button onClick={() => moveCategory(index, 1)} disabled={index === (categories || []).length - 1} style={{ padding: '8px 12px', background: 'transparent', border: 'none', cursor: index === (categories || []).length - 1 ? 'not-allowed' : 'pointer', color: index === (categories || []).length - 1 ? '#cbd5e1' : '#475569', transition: '0.2s' }} title={language === 'ar' ? 'أسفل' : 'Move Down'}>
                                                        <i className="fas fa-arrow-down"></i>
                                                    </button>
                                                </div>

                                                <button onClick={() => setEditingCategoryIndex(editingCategoryIndex === index ? null : index)} style={{ padding: '8px 14px', fontSize: '14px', background: editingCategoryIndex === index ? '#475569' : '#f1f5f9', color: editingCategoryIndex === index ? '#fff' : '#475569', border: '1px solid', borderColor: editingCategoryIndex === index ? '#475569' : '#e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <i className={`fas fa-${editingCategoryIndex === index ? 'times' : 'pen'}`}></i>
                                                </button>

                                                <button onClick={() => requestRemoveCategory(index)} style={{ padding: '8px 14px', fontSize: '14px', background: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#fef2f2' }} onMouseOut={e => { e.currentTarget.style.background = '#fff' }} title={language === 'ar' ? 'حذف' : 'Delete'}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inline Editor */}
                                        {editingCategoryIndex === index && (
                                            <div style={{ marginTop: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{language === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                                    <input type="text" value={cat.titleAr} onChange={(e) => updateExistingCategory(index, 'titleAr', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
                                                    <input type="text" value={cat.titleEn} onChange={(e) => updateExistingCategory(index, 'titleEn', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{language === 'ar' ? 'الرابط (Link)' : 'Link'}</label>
                                                    <input type="text" value={cat.link} onChange={(e) => updateExistingCategory(index, 'link', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '6px', direction: 'ltr', background: '#fff' }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{language === 'ar' ? 'تغيير الصورة' : 'Change Image'}</label>
                                                    <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', borderRadius: '6px', background: '#fff', border: '1px dashed #94a3b8', padding: '8px 0', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#94a3b8'}>
                                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                                                            <i className="fas fa-camera" style={{ margin: '0 6px' }}></i>
                                                            {language === 'ar' ? 'اختر صورة جديدة' : 'Choose new image'}
                                                        </div>
                                                        <input type="file" accept="image/*" onChange={(e) => handleCategoryFileUpload(e, false, index)} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Delete Confirmation Modal */}
            {deletePrompt.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 style={{ margin: '0 0 10px', color: '#1e293b', fontSize: '20px' }}>
                            {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px', lineHeight: '1.5' }}>
                            {language === 'ar' ? 'هل أنت متأكد من رغبتك في الحذف النهائي؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to permanently delete this item? This action cannot be undone.'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={cancelDelete} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}>
                                {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)' }} onMouseOver={e => e.currentTarget.style.background = '#dc2626'} onMouseOut={e => e.currentTarget.style.background = '#ef4444'}>
                                {language === 'ar' ? 'نعم، احذف' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {
                toastMsg && (
                    <div style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#22c55e',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontWeight: 'bold',
                        zIndex: 9999,
                        animation: 'fadeInOut 3s forwards'
                    }}>
                        {toastMsg}
                    </div>
                )
            }
        </div >
    );
};

window.AdminDashboard = AdminDashboard;
