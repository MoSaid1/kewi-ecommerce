<?php
require_once __DIR__ . '/config.php';

$db = getDb();
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    $result = $db->query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
    $rows = [];
    while ($row = $result->fetch_assoc())
        $rows[] = $row;
    respond($rows);
}

if ($method === 'POST') {
    $c = getBody();
    $stmt = $db->prepare('INSERT INTO categories (title_en, title_ar, image, link, sort_order) VALUES (?,?,?,?,?)');
    $order = (int)($c['sort_order'] ?? 0);
    $stmt->bind_param('ssssi', $c['titleEn'], $c['titleAr'], $c['image'], $c['link'], $order);
    $stmt->execute();
    respond(['success' => true, 'id' => $db->insert_id], 201);
}

if ($method === 'PUT' && $id) {
    $c = getBody();
    $stmt = $db->prepare('UPDATE categories SET title_en=?, title_ar=?, image=?, link=?, sort_order=? WHERE id=?');
    $order = (int)($c['sort_order'] ?? 0);
    $stmt->bind_param('ssssii', $c['titleEn'], $c['titleAr'], $c['image'], $c['link'], $order, $id);
    $stmt->execute();
    respond(['success' => true]);
}

if ($method === 'DELETE' && $id) {
    $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    respond(['success' => true]);
}

respond(['error' => 'Bad request'], 400);
?>
