document.addEventListener('DOMContentLoaded', () => {
    // Basic setup for changing language and country/currency
});

window.rates = {
    'UAE': { currency: 'AED', text: 'United Arab Emirates', multiplier: 1 },
    'EGY': { currency: 'EGP', text: 'Egypt', multiplier: 10 } // Example rough conversion
};

window.translations = {
    'en': {
        // Top bar
        'help': 'Help', 'contact': 'Contact', 'faqs': 'FAQs', 'order_tracking': 'Order Tracking',
        // Navigation
        'nav_women': 'Women', 'nav_kids': 'Kids', 'nav_sale': 'Sale', 'nav_just_dropped': 'Just Dropped',
        'nav_best_sellers': 'Best Sellers', 'nav_trending': 'Trending Now', 'nav_hot_deals': 'Hot Deals',
        // Header
        'search_placeholder': 'Search: dress, abaya, pijama, skirt, brand',
        'login': 'Login', 'favorites': 'Favorites', 'cart': 'Cart',
        // Categories
        'cat_dresses': 'Dresses', 'cat_abayas': 'Abayas', 'cat_pajamas': 'Pajamas',
        'cat_skirts': 'Skirts', 'cat_bags': 'Bags', 'cat_new_arrivals': 'New Arrivals',
        // Sections
        'title_flash_sale': 'Flash Sale', 'title_recommended': 'Recommended For You', 'see_all': 'See All',
        'promo_title': 'Look Cool and Elegant', 'promo_desc': 'Discover the latest styles in our Look Cool and Elegant collection.',
        'shop_now': 'Shop Now', 'title_best_sellers': 'Best Sellers', 'title_bags': 'Bags',
        // Footer
        'newsletter_title': 'Subscribe to get the latest updates about our campaigns',
        'newsletter_placeholder': 'E-Mail Address', 'subscribe': 'Subscribe Now',
        'footer_about': 'Your ultimate destination for modern, elegant, and stylish women\'s fashion.',
        'footer_countries': 'Countries', 'country_sa': 'Saudi Arabia', 'country_uae': 'United Arab Emirates',
        'country_egy': 'Egypt', 'country_kw': 'Kuwait', 'country_qa': 'Qatar', 'country_bh': 'Bahrain',
        'footer_top_cat': 'Top Categories', 'footer_about_us': 'About Us',
        'footer_about_link': 'About Us', 'footer_privacy': 'Privacy and Policy',
        'footer_cust_service': 'Customer Service', 'footer_order_returns': 'Order Returns',
        'footer_refund': 'Refund', 'footer_delivery': 'Delivery', 'footer_returns': 'Returns',
        'footer_download_app': 'Download Our App', 'app_store': 'App Store', 'google_play': 'Google Play',
        'copyright': '© 2025 Kewi. All rights reserved.'
    },
    'ar': {
        'help': 'المساعدة', 'contact': 'اتصل بنا', 'faqs': 'الأسئلة الشائعة', 'order_tracking': 'تتبع الطلب',
        'nav_women': 'نساء', 'nav_kids': 'أطفال', 'nav_sale': 'تخفيضات', 'nav_just_dropped': 'وصل حديثاً',
        'nav_best_sellers': 'الأكثر مبيعاً', 'nav_trending': 'ترند', 'nav_hot_deals': 'عروض مميزة',
        'search_placeholder': 'ابحث عن: فستان، عباية، بيجاما، تنورة، ماركة',
        'login': 'تسجيل الدخول', 'favorites': 'المفضلة', 'cart': 'العربة',
        'cat_dresses': 'فساتين', 'cat_abayas': 'عبايات', 'cat_pajamas': 'بيجامات',
        'cat_skirts': 'تنانير', 'cat_bags': 'حقائب', 'cat_new_arrivals': 'وصل حديثاً',
        'title_flash_sale': 'تخفيضات سريعة', 'title_recommended': 'موصى به لك', 'see_all': 'عرض الكل',
        'promo_title': 'تألقي بأسلوب عصري وأنيق', 'promo_desc': 'اكتشفي أحدث التشكيلات في مجموعتنا الأنيقة.',
        'shop_now': 'تسوقي الآن', 'title_best_sellers': 'الأكثر مبيعاً', 'title_bags': 'حقائب',
        'newsletter_title': 'اشتركي للحصول على أحدث التحديثات عن عروضنا',
        'newsletter_placeholder': 'البريد الإلكتروني', 'subscribe': 'اشتركي الآن',
        'footer_about': 'وجهتك المثالية لأزياء نسائية عصرية، أنيقة، ومميزة.',
        'footer_countries': 'الدول', 'country_sa': 'السعودية', 'country_uae': 'الإمارات',
        'country_egy': 'مصر', 'country_kw': 'الكويت', 'country_qa': 'قطر', 'country_bh': 'البحرين',
        'footer_top_cat': 'أهم الفئات', 'footer_about_us': 'معلومات عنا',
        'footer_about_link': 'من نحن', 'footer_privacy': 'سياسة الخصوصية',
        'footer_cust_service': 'خدمة العملاء', 'footer_order_returns': 'إرجاع الطلب',
        'footer_refund': 'استرداد الأموال', 'footer_delivery': 'التوصيل', 'footer_returns': 'الإرجاع',
        'footer_download_app': 'حملي تطبيقنا', 'app_store': 'متجر آبل', 'google_play': 'جوجل بلاي',
        'copyright': '© 2025 Kewi. جميع الحقوق محفوظة.'
    }
};

window.rates = rates;
window.translations = translations;
