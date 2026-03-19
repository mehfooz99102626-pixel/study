<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: index.php');
    exit;
}

require '../php/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $location = trim($_POST['location']);
    $price = (float)$_POST['price'];
    $type = $_POST['type'];
    $bedrooms = (int)$_POST['bedrooms'];
    $description = trim($_POST['description']);
    $amenities = $_POST['amenities'];
    $latitude = (float)$_POST['latitude'];
    $longitude = (float)$_POST['longitude'];

    // Handle image uploads
    $images = [];
    if (isset($_FILES['images'])) {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                $name = basename($_FILES['images']['name'][$key]);
                $target = '../images/' . $name;
                if (move_uploaded_file($tmp_name, $target)) {
                    $images[] = 'images/' . $name;
                }
            }
        }
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO properties (title, location, price, type, bedrooms, description, images, amenities, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $location, $price, $type, $bedrooms, $description, json_encode($images), $amenities, $latitude, $longitude]);
        header('Location: index.php');
    } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
    }
}
?>