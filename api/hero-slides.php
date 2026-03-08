<?php
require_once __DIR__ . '/config.php';

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    $result = $db->query('SELECT * FROM hero_slides ORDER BY country, sort_order ASC');
    $grouped = ['UAE' => [], 'EGY' => []];
    while ($row = $result->fetch_assoc()) {
        $grouped[$row['country']][] = [
            'id' => $row['id'],
            'desktopAr' => $row['desktop_ar'],
            'desktopEn' => $row['desktop_en'],
            'mobileAr' => $row['mobile_ar'],
            'mobileEn' => $row['mobile_en'],
            'link' => $row['link'],
        ];
    }
    respond($grouped);
}

if ($method === 'POST') {
    $s = getBody();
    $stmt = $db->prepare('INSERT INTO hero_slides (country, desktop_ar, desktop_en, mobile_ar, mobile_en, link, sort_order) VALUES (?,?,?,?,?,?,?)');
    $order = (int)($s['sort_order'] ?? 0);
    $stmt->bind_param('ssssssi',
        $s['country'], $s['desktopAr'], $s['desktopEn'], $s['mobileAr'], $s['mobileEn'], $s['link'], $order
    );
    $stmt->execute();
    respond(['success' => true, 'id' => $db->insert_id], 201);
}

if ($method === 'PUT' && $id) {
    $s = getBody();
    $stmt = $db->prepare('UPDATE hero_slides SET desktop_ar=?, desktop_en=?, mobile_ar=?, mobile_en=?, link=?, sort_order=? WHERE id=?');
    $order = (int)($s['sort_order'] ?? 0);
    $stmt->bind_param('ssssiii',
        $s['desktopAr'], $s['desktopEn'], $s['mobileAr'], $s['mobileEn'], $s['link'], $order, $id
    );
    $stmt->execute();
    respond(['success' => true]);
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare('DELETE FROM hero_slides WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    respond(['success' => true]);
}

respond(['error' => 'Bad request'], 400);
?>
