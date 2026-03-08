/**
 * productService.js
 * All data is now stored in MySQL via the PHP API.
 * Methods return Promises when writing, and use an in-memory cache for reads.
 */

const productService = (() => {
    let _cache = [];

    // Load all products from server into memory cache
    const loadAll = async () => {
        try {
            _cache = await window.kewiApi.getAllProducts();
        } catch (e) {
            console.error('productService: failed to load products', e);
            _cache = [];
        }
        return _cache;
    };

    // ── Sync reads from cache ────────────────────────────────
    const getAllProducts = () => _cache;

    const getProductById = (id) => _cache.find(p => p.id === id) || null;

    const getProductsByCategory = (cat) =>
        _cache.filter(p => p.category?.toLowerCase() === cat?.toLowerCase());

    // ── Async writes → API → refresh cache ──────────────────
    const createProduct = async (data) => {
        const result = await window.kewiApi.createProduct(data);
        await loadAll();
        return result;
    };

    const updateProduct = async (id, data) => {
        const result = await window.kewiApi.updateProduct(id, data);
        await loadAll();
        return result;
    };

    const deleteProduct = async (id) => {
        const result = await window.kewiApi.deleteProduct(id);
        await loadAll();
        return result;
    };

    return {
        loadAll,
        getAllProducts,
        getProductById,
        getProductsByCategory,
        createProduct,
        updateProduct,
        deleteProduct,
    };
})();

window.productService = productService;
