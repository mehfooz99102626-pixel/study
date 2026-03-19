<?php
require 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM properties ORDER BY id DESC");
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
    echo json_encode(['error' => 'Failed to fetch properties']);
}
?>