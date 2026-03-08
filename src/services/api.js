/**
 * Kewi API Client — PHP Backend Edition
 *
 * On production hosting, set the full domain in index.html:
 *   <script>window.KEWI_API_BASE_URL = 'https://mo-said.com';</script>
 * Leave empty for same-origin requests (when index.html and api/ are on the same server).
 */

const BASE_URL = (window.KEWI_API_BASE_URL || '').replace(/\/$/, '');

async function req(url, method = 'GET', body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`API error ${r.status}`);
    return r.json();
}

const api = {
    // ── Products ──────────────────────────────────────────────
    getAllProducts: () =>
        req(`${BASE_URL}/api/products.php`),

    getProductById: (id) =>
        req(`${BASE_URL}/api/products.php?id=${encodeURIComponent(id)}`),

    createProduct: (data) =>
        req(`${BASE_URL}/api/products.php`, 'POST', data),

    updateProduct: (id, data) =>
        req(`${BASE_URL}/api/products.php?id=${encodeURIComponent(id)}`, 'PUT', data),

    deleteProduct: (id) =>
        req(`${BASE_URL}/api/products.php?id=${encodeURIComponent(id)}`, 'DELETE'),

    // ── Categories ────────────────────────────────────────────
    getCategories: () =>
        req(`${BASE_URL}/api/categories.php`),

    createCategory: (data) =>
        req(`${BASE_URL}/api/categories.php`, 'POST', data),

    updateCategory: (id, data) =>
        req(`${BASE_URL}/api/categories.php?id=${id}`, 'PUT', data),

    deleteCategory: (id) =>
        req(`${BASE_URL}/api/categories.php?id=${id}`, 'DELETE'),

    // ── Hero Slides ───────────────────────────────────────────
    getHeroSlides: () =>
        req(`${BASE_URL}/api/hero-slides.php`),

    createHeroSlide: (data) =>
        req(`${BASE_URL}/api/hero-slides.php`, 'POST', data),

    updateHeroSlide: (id, data) =>
        req(`${BASE_URL}/api/hero-slides.php?id=${id}`, 'PUT', data),

    deleteHeroSlide: (id) =>
        req(`${BASE_URL}/api/hero-slides.php?id=${id}`, 'DELETE'),

    // ── Settings ──────────────────────────────────────────────
    getSettings: () =>
        req(`${BASE_URL}/api/settings.php`),

    saveSettings: (data) =>
        req(`${BASE_URL}/api/settings.php`, 'POST', data),
};

window.kewiApi = api;

