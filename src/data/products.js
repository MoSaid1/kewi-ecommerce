const initialProducts = [
    {
        id: "dress-001",
        titleEn: "Black Dress off Shoulder",
        titleAr: "فستان أسود مكشوف الأكتاف",
        descriptionEn: "Elegant off shoulder black dress perfect for evening events.",
        descriptionAr: "فستان أسود مكشوف الأكتاف أنيق ومثالي للمناسبات المسائية.",
        pricing: {
            UAE: { visible: true, price: 180, oldPrice: 200 },
            EGY: { visible: true, price: 1800, oldPrice: 2000 }
        },
        currency: "AED",
        images: [
            "assets/dress1.png",
            "assets/dress2.png"
        ],
        colors: [
            { nameEn: "Black", nameAr: "أسود", hex: "#000000" }
        ],
        sizes: ["S", "M", "L", "XL"],
        rating: 4.8,
        reviews: 12,
        category: "Dresses",
        modelInfo: {
            height: 177,
            size: "S"
        },
        badge: "sale"
    },
    {
        id: "dress-002",
        titleEn: "White Summer Dress",
        titleAr: "فستان صيفي أبيض",
        descriptionEn: "Lightweight and breathable white dress for sunny days.",
        descriptionAr: "فستان أبيض خفيف ومريح للأيام المشمسة.",
        pricing: {
            UAE: { visible: true, price: 150, oldPrice: null },
            EGY: { visible: true, price: 1500, oldPrice: null }
        },
        currency: "AED",
        images: [
            "assets/dress3.png"
        ],
        colors: [
            { nameEn: "White", nameAr: "أبيض", hex: "#ffffff" }
        ],
        sizes: ["M", "L"],
        rating: 4.5,
        reviews: 8,
        category: "Dresses",
        modelInfo: null,
        badge: "new"
    },
    {
        id: "abaya-001",
        titleEn: "Classic Black Abaya",
        titleAr: "عباية سوداء كلاسيكية",
        descriptionEn: "A timeless black abaya with intricate embroidery along the edges.",
        descriptionAr: "عباية سوداء كلاسيكية بتطريز دقيق على الأطراف.",
        pricing: {
            UAE: { visible: true, price: 250, oldPrice: 300 },
            EGY: { visible: true, price: 2500, oldPrice: 3000 }
        },
        currency: "AED",
        images: [
            "assets/abaya1.png"
        ],
        colors: [
            { nameEn: "Black", nameAr: "أسود", hex: "#000000" }
        ],
        sizes: ["Free Size"],
        rating: 4.9,
        reviews: 35,
        category: "Abayas",
        modelInfo: {
            height: 170,
            size: "Free Size"
        },
        badge: null
    }
];

window.initialProducts = initialProducts;
