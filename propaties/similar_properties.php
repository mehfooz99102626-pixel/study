<?php
require 'config.php';

$type = $_GET['type'] ?? '';

if (empty($type)) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM properties WHERE type = ? AND id != ? LIMIT 3");
    $stmt->execute([$type, $_GET['exclude'] ?? 0]);
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON fields
    foreach ($properties as &$property) {
        $property['images'] = json_decode($property['images'], true);
        $property['amenities'] = json_decode($property['amenities'], true);
    }

    header('Content-Type: application/json');
    echo json_encode($properties);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch similar properties']);
}
?>