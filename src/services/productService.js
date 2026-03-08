// Dependencies are loaded via sequential script tags

const STORAGE_KEY = 'kewi_products_v3';

const productService = {
    /**
     * Get all products. Initializes with default seed data if empty.
     */
    getAllProducts: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            } else {
                // Initialize default database
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
                return initialProducts;
            }
        } catch (error) {
            console.error("Error reading products from localStorage:", error);
            return [];
        }
    },

    /**
     * Fetch a specific product by its exact string ID
     */
    getProductById: (id) => {
        const products = productService.getAllProducts();
        return products.find(p => p.id === id) || null;
    },

    /**
     * Get products in a specific category (case insensitive match)
     */
    getProductsByCategory: (categoryName) => {
        const products = productService.getAllProducts();
        return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    },

    /**
     * Create a new product object and prepend it to the list
     */
    createProduct: (productData) => {
        const products = productService.getAllProducts();
        // Generate a simple unique ID if none provided
        const newProduct = {
            ...productData,
            id: productData.id || `prod-${Date.now()}`
        };
        const updatedProducts = [newProduct, ...products];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
            return newProduct;
        } catch (error) {
            console.error("Error saving new product to localStorage:", error);
            throw error; // Bubble up for UI toasts
        }
    },

    /**
     * Full replace update for a specific product ID
     */
    updateProduct: (id, updatedData) => {
        const products = productService.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
                return products[index];
            } catch (error) {
                console.error("Error updating product in localStorage:", error);
                throw error;
            }
        }
        return null;
    },

    /**
     * Deletes a product from the array by ID
     */
    deleteProduct: (id) => {
        const products = productService.getAllProducts();
        const updatedProducts = products.filter(p => p.id !== id);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
            return true;
        } catch (error) {
            console.error("Error deleting product from localStorage:", error);
            throw error;
        }
    }
};

window.productService = productService;
