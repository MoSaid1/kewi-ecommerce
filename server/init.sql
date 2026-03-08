-- Run this first to create all required tables in your MySQL database.
-- Database: u857014416_moData

-- =====================================================
-- TABLE: products
-- =====================================================
CREATE TABLE IF NOT EXISTS `products` (
    `id`          VARCHAR(100) NOT NULL PRIMARY KEY COMMENT 'User defined product ID (e.g. dress-001)',
    `title_en`    VARCHAR(255) NOT NULL,
    `title_ar`    VARCHAR(255) NOT NULL,
    `desc_en`     TEXT,
    `desc_ar`     TEXT,
    `category`    VARCHAR(100),
    `sizes`       JSON COMMENT 'Array of size strings e.g. ["S","M","L"]',
    `colors`      JSON COMMENT 'Array of {nameEn, nameAr, hex} objects',
    `images`      LONGTEXT COMMENT 'JSON array of base64 or URL image strings',
    `pricing`     JSON NOT NULL COMMENT '{"UAE":{visible,price,oldPrice},"EGY":{visible,price,oldPrice}}',
    `badge`       VARCHAR(50) DEFAULT NULL COMMENT 'sale | new | NULL',
    `rating`      FLOAT DEFAULT 5,
    `reviews`     INT DEFAULT 0,
    `model_info`  JSON DEFAULT NULL COMMENT '{height, size}',
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS `categories` (
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `title_en`   VARCHAR(100) NOT NULL,
    `title_ar`   VARCHAR(100) NOT NULL,
    `image`      LONGTEXT COMMENT 'Base64 or URL',
    `link`       VARCHAR(255) DEFAULT '#',
    `sort_order` INT DEFAULT 0
);

-- =====================================================
-- TABLE: hero_slides
-- =====================================================
CREATE TABLE IF NOT EXISTS `hero_slides` (
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `country`     ENUM('UAE','EGY') NOT NULL,
    `desktop_ar`  LONGTEXT,
    `desktop_en`  LONGTEXT,
    `mobile_ar`   LONGTEXT,
    `mobile_en`   LONGTEXT,
    `link`        VARCHAR(255) DEFAULT '#',
    `sort_order`  INT DEFAULT 0
);

-- =====================================================
-- TABLE: site_settings
-- =====================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
    `setting_key`   VARCHAR(100) NOT NULL PRIMARY KEY,
    `setting_value` TEXT NOT NULL
);

-- Default settings
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('heroSlideDuration', '4000'),
('allowedImageFormats', '.jpg,.jpeg,.png,.webp'),
('maxImageSizeMb', '5');
