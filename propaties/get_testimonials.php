<?php
require 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY id DESC");
    $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($testimonials);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch testimonials']);
}
?>