<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: index.php');
    exit;
}

require '../php/config.php';

$id = $_GET['id'] ?? 0;

try {
    $stmt = $pdo->prepare("DELETE FROM properties WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: index.php');
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>