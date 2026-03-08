require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // large limit for base64 images

// ─────────────────────────────────────────────
//  PRODUCTS
// ─────────────────────────────────────────────

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        const products = rows.map(r => ({
            ...r,
            sizes: safeJson(r.sizes),
            colors: safeJson(r.colors),
            images: safeJson(r.images),
            pricing: safeJson(r.pricing),
            model_info: safeJson(r.model_info),
        }));
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        const r = rows[0];
        res.json({
            ...r,
            sizes: safeJson(r.sizes),
            colors: safeJson(r.colors),
            images: safeJson(r.images),
            pricing: safeJson(r.pricing),
            model_info: safeJson(r.model_info),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create product
app.post('/api/products', async (req, res) => {
    try {
        const p = req.body;
        await pool.query(
            `INSERT INTO products (id, title_en, title_ar, desc_en, desc_ar, category, sizes, colors, images, pricing, badge, rating, reviews, model_info)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                p.id, p.titleEn, p.titleAr, p.descriptionEn, p.descriptionAr,
                p.category,
                JSON.stringify(p.sizes || []),
                JSON.stringify(p.colors || []),
                JSON.stringify(p.images || []),
                JSON.stringify(p.pricing || {}),
                p.badge || null,
                p.rating || 5,
                p.reviews || 0,
                JSON.stringify(p.modelInfo || null),
            ]
        );
        res.status(201).json({ success: true, id: p.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const p = req.body;
        await pool.query(
            `UPDATE products SET title_en=?, title_ar=?, desc_en=?, desc_ar=?, category=?, sizes=?, colors=?, images=?, pricing=?, badge=?, rating=?, reviews=?, model_info=?
             WHERE id=?`,
            [
                p.titleEn, p.titleAr, p.descriptionEn, p.descriptionAr,
                p.category,
                JSON.stringify(p.sizes || []),
                JSON.stringify(p.colors || []),
                JSON.stringify(p.images || []),
                JSON.stringify(p.pricing || {}),
                p.badge || null,
                p.rating || 5,
                p.reviews || 0,
                JSON.stringify(p.modelInfo || null),
                req.params.id,
            ]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
//  CATEGORIES
// ─────────────────────────────────────────────

app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const c = req.body;
        const [result] = await pool.query(
            'INSERT INTO categories (title_en, title_ar, image, link, sort_order) VALUES (?,?,?,?,?)',
            [c.titleEn, c.titleAr, c.image || '', c.link || '#', c.sort_order || 0]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const c = req.body;
        await pool.query(
            'UPDATE categories SET title_en=?, title_ar=?, image=?, link=?, sort_order=? WHERE id=?',
            [c.titleEn, c.titleAr, c.image || '', c.link || '#', c.sort_order || 0, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
//  HERO SLIDES
// ─────────────────────────────────────────────

app.get('/api/hero-slides', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY country, sort_order ASC');
        // Group by country: { UAE: [...], EGY: [...] }
        const grouped = { UAE: [], EGY: [] };
        rows.forEach(r => {
            grouped[r.country].push({
                id: r.id,
                desktopAr: r.desktop_ar,
                desktopEn: r.desktop_en,
                mobileAr: r.mobile_ar,
                mobileEn: r.mobile_en,
                link: r.link,
            });
        });
        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/hero-slides', async (req, res) => {
    try {
        const s = req.body;
        const [result] = await pool.query(
            'INSERT INTO hero_slides (country, desktop_ar, desktop_en, mobile_ar, mobile_en, link, sort_order) VALUES (?,?,?,?,?,?,?)',
            [s.country, s.desktopAr || '', s.desktopEn || '', s.mobileAr || '', s.mobileEn || '', s.link || '#', s.sort_order || 0]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/hero-slides/:id', async (req, res) => {
    try {
        const s = req.body;
        await pool.query(
            'UPDATE hero_slides SET desktop_ar=?, desktop_en=?, mobile_ar=?, mobile_en=?, link=?, sort_order=? WHERE id=?',
            [s.desktopAr || '', s.desktopEn || '', s.mobileAr || '', s.mobileEn || '', s.link || '#', s.sort_order || 0, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/hero-slides/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
//  SITE SETTINGS
// ─────────────────────────────────────────────

app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings');
        const settings = {};
        rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const settings = req.body; // { key: value, ... }
        for (const [key, value] of Object.entries(settings)) {
            await pool.query(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?',
                [key, String(value), String(value)]
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
//  HELPERS & START
// ─────────────────────────────────────────────

function safeJson(val) {
    if (!val) return null;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return val; }
}

app.listen(PORT, () => {
    console.log(`✅ Kewi API server running on port ${PORT}`);
});
