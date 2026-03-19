<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: index.php');
    exit;
}

require '../php/config.php';

$id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM properties WHERE id = ?");
$stmt->execute([$id]);
$property = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$property) {
    echo 'Property not found';
    exit;
}

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

    // Handle image uploads (append to existing)
    $images = json_decode($property['images'], true);
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
        $stmt = $pdo->prepare("UPDATE properties SET title=?, location=?, price=?, type=?, bedrooms=?, description=?, images=?, amenities=?, latitude=?, longitude=? WHERE id=?");
        $stmt->execute([$title, $location, $price, $type, $bedrooms, $description, json_encode($images), $amenities, $latitude, $longitude, $id]);
        header('Location: index.php');
    } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Property - Royal Estate Pro</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="container">
        <h1>Edit Property</h1>
        <form action="" method="post" enctype="multipart/form-data">
            <input type="text" name="title" value="<?php echo htmlspecialchars($property['title']); ?>" required>
            <input type="text" name="location" value="<?php echo htmlspecialchars($property['location']); ?>" required>
            <input type="number" name="price" value="<?php echo $property['price']; ?>" step="0.01" required>
            <select name="type" required>
                <option <?php if ($property['type'] === 'House') echo 'selected'; ?>>House</option>
                <option <?php if ($property['type'] === 'Apartment') echo 'selected'; ?>>Apartment</option>
                <option <?php if ($property['type'] === 'Villa') echo 'selected'; ?>>Villa</option>
            </select>
            <input type="number" name="bedrooms" value="<?php echo $property['bedrooms']; ?>" required>
            <textarea name="description" required><?php echo htmlspecialchars($property['description']); ?></textarea>
            <input type="text" name="amenities" value="<?php echo htmlspecialchars($property['amenities']); ?>" required>
            <input type="number" name="latitude" value="<?php echo $property['latitude']; ?>" step="any">
            <input type="number" name="longitude" value="<?php echo $property['longitude']; ?>" step="any">
            <input type="file" name="images[]" multiple>
            <button type="submit">Update Property</button>
        </form>
        <a href="index.php">Back</a>
    </div>
</body>
</html>