const ProductList = ({ language, t, onCreateNew, onEditProduct }) => {
    const { useState, useEffect, useMemo } = React;
    const productService = window.productService;
    const [products, setProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const loadProducts = () => {
        setProducts(productService.getAllProducts());
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // --- Statistics ---
    const totalProducts = products.length;
    const itemsPerCategory = useMemo(() => {
        const counts = {};
        products.forEach(p => {
            const cat = p.category || 'Uncategorized';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [products]);

    // --- Sorting ---
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? 'fa-sort-up' : 'fa-sort-down';
        }
        return 'fa-sort';
    };

    const sortedProducts = useMemo(() => {
        let sortableProducts = [...products];
        if (sortConfig.key !== null) {
            sortableProducts.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested keys like pricing.UAE.price and sizes/colors length
                if (sortConfig.key.includes('.')) {
                    const keys = sortConfig.key.split('.');
                    aValue = keys.reduce((obj, key) => obj?.[key], a);
                    bValue = keys.reduce((obj, key) => obj?.[key], b);
                } else if (sortConfig.key === 'options') {
                    aValue = (a.sizes?.length || 0) + (a.colors?.length || 0);
                    bValue = (b.sizes?.length || 0) + (b.colors?.length || 0);
                } else if (sortConfig.key === 'title') {
                    aValue = language === 'ar' ? a.titleAr : a.titleEn;
                    bValue = language === 'ar' ? b.titleAr : b.titleEn;
                }

                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue === undefined || aValue === null) aValue = '';
                if (bValue === undefined || bValue === null) bValue = '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableProducts;
    }, [products, sortConfig, language]);

    const handleDelete = (id) => {
        if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج نهائياً؟' : 'Are you sure you want to permanently delete this product?')) {
            productService.deleteProduct(id);
            loadProducts();

            // Note: Ideally hook into the global Toast, but alert is a safe fallback
            if (window.alert) window.alert(language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
        }
    };

    return (
        <div className="admin-product-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div className="admin-card-title" style={{ margin: 0 }}>
                    <i className="fas fa-boxes"></i>
                    {language === 'ar' ? 'إدارة المنتجات' : 'Products Management'}
                </div>
                <button
                    onClick={onCreateNew}
                    style={{ padding: '10px 20px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-plus"></i>
                    {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fas fa-boxes"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>{language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}</div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginTop: '4px' }}>{totalProducts}</div>
                    </div>
                </div>

                {Object.entries(itemsPerCategory).map(([cat, count]) => (
                    <div key={cat} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                            <i className="fas fa-tag"></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>{cat}</div>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginTop: '4px' }}>{count}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: language === 'ar' ? 'right' : 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th onClick={() => requestSort('title')} style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                                {language === 'ar' ? 'المنتج' : 'Product'} <i className={`fas ${getSortIcon('title')}`} style={{ marginLeft: '4px', color: '#94a3b8' }}></i>
                            </th>
                            <th onClick={() => requestSort('category')} style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                                {language === 'ar' ? 'القسم' : 'Category'} <i className={`fas ${getSortIcon('category')}`} style={{ marginLeft: '4px', color: '#94a3b8' }}></i>
                            </th>
                            <th onClick={() => requestSort('pricing.UAE.price')} style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                                {language === 'ar' ? 'السعر (UAE)' : 'Price (UAE)'} <i className={`fas ${getSortIcon('pricing.UAE.price')}`} style={{ marginLeft: '4px', color: '#94a3b8' }}></i>
                            </th>
                            <th onClick={() => requestSort('pricing.EGY.price')} style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                                {language === 'ar' ? 'السعر (مصر)' : 'Price (EGY)'} <i className={`fas ${getSortIcon('pricing.EGY.price')}`} style={{ marginLeft: '4px', color: '#94a3b8' }}></i>
                            </th>
                            <th onClick={() => requestSort('options')} style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                                {language === 'ar' ? 'الخيارات' : 'Options'} <i className={`fas ${getSortIcon('options')}`} style={{ marginLeft: '4px', color: '#94a3b8' }}></i>
                            </th>
                            <th style={{ padding: '16px', color: '#475569', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                    <i className="fas fa-box-open" style={{ fontSize: '32px', marginBottom: '12px', color: '#cbd5e1' }}></i>
                                    <br />
                                    {language === 'ar' ? 'لا توجد منتجات حتى الآن' : 'No products found'}
                                </td>
                            </tr>
                        ) : (
                            sortedProducts.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                <img src={product.images?.[0] || 'assets/placeholder.png'} alt={product.titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>{language === 'ar' ? product.titleAr : product.titleEn}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#475569' }}>
                                        {product.category}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '600', color: product.pricing?.UAE?.visible ? 'var(--primary-color)' : '#94a3b8' }}>
                                        {product.pricing?.UAE?.visible ? `${product.pricing?.UAE?.price} AED` : <span style={{ fontSize: '12px' }}>{language === 'ar' ? 'مخفي' : 'Hidden'}</span>}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '600', color: product.pricing?.EGY?.visible ? 'var(--primary-color)' : '#94a3b8' }}>
                                        {product.pricing?.EGY?.visible ? `${product.pricing?.EGY?.price} EGP` : <span style={{ fontSize: '12px' }}>{language === 'ar' ? 'مخفي' : 'Hidden'}</span>}
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>
                                        <div>{product.sizes?.length || 0} {language === 'ar' ? 'مقاسات' : 'Sizes'}</div>
                                        <div>{product.colors?.length || 0} {language === 'ar' ? 'ألوان' : 'Colors'}</div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => onEditProduct(product.id)}
                                            style={{ background: '#f1f5f9', color: '#3b82f6', border: '1px solid #cbd5e1', borderRadius: '6px', width: '32px', height: '32px', margin: '0 4px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            title={language === 'ar' ? 'تعديل' : 'Edit'}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', width: '32px', height: '32px', margin: '0 4px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            title={language === 'ar' ? 'حذف' : 'Delete'}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

window.ProductList = ProductList;

window.ProductList = ProductList;
