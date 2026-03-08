<?php
require_once __DIR__ . '/config.php';

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $db->query('SELECT * FROM site_settings');
    $settings = [];
    while ($row = $result->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    respond($settings);
}

if ($method === 'POST') {
    $data = getBody();
    $stmt = $db->prepare(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    foreach ($data as $key => $value) {
        $val = (string)$value;
        $stmt->bind_param('ss', $key, $val);
        $stmt->execute();
    }
    respond(['success' => true]);
}

respond(['error' => 'Bad request'], 400);
?>
