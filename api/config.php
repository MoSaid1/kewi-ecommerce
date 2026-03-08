<?php
// ==============================================
// Kewi Store - PHP API Backend for Hostinger
// Place this entire `api/` folder in your
// Hostinger public_html directory.
// ==============================================

define('DB_HOST', 'localhost');
define('DB_USER', 'u857014416_kewi');
define('DB_PASS', 'Kewi@2025!Store');
define('DB_NAME', 'u857014416_moData');

function getDb() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $conn->set_charset('utf8mb4');
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'DB connection failed: ' . $conn->connect_error]));
    }
    return $conn;
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// Allow CORS from any origin
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
?>
