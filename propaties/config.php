<?php
// Database configuration
$host = 'localhost';  // Change if needed
$db = 'royal_estate_pro';
$user = 'your_username';  // Replace with your MySQL username
$pass = 'your_password';  // Replace with your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>