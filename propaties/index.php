<?php
session_start();
require '../php/config.php';

// Simple authentication (use bcrypt in production)
if (!isset($_SESSION['admin'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['username'] === 'admin' && $_POST['password'] === 'password') {
        $_SESSION['admin'] = true;
    } else {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Admin Login - Royal Estate Pro</title>
            <link rel="stylesheet" href="../css/admin.css">
        </head>
        <body>
            <div class="container">
                <h1>Admin Login</h1>
                <form method="post">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}

// Fetch properties
try {
    $stmt = $pdo->query("SELECT * FROM properties ORDER BY id DESC");
    $properties = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $properties = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Royal Estate Pro</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="container">
        <h1>Admin Dashboard</h1>
        <a href="../index.html">Back to Site</a> | <a href="?logout">Logout</a>

        <h2>Add Property</h2>
        <form action="add_property.php" method="post" enctype="multipart/form-data">
            <input type="text" name="title" placeholder="Title" required>
            <input type="text" name="location" placeholder="Location" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <select name="type" required>
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
            </select>
            <input type="number" name="bedrooms" placeholder="Bedrooms" required>
            <textarea name="description" placeholder="Description" required></textarea>
            <input type="text" name="amenities" placeholder='["Pool", "Garage"]' required>
            <input type="number" name="latitude" placeholder="Latitude" step="any">
            <input type="number" name="longitude" placeholder="Longitude" step="any">
            <input type="file" name="images[]" multiple id="property-images">
            <div id="image-preview"></div>
            <button type="submit">Add Property</button>
        </form>

        <h2>Properties</h2>
        <table id="admin-properties">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($properties as $p): ?>
                <tr>
                    <td><?php echo $p['id']; ?></td>
                    <td><?php echo htmlspecialchars($p['title']); ?></td>
                    <td><?php echo htmlspecialchars($p['location']); ?></td>
                    <td>$<?php echo number_format($p['price'], 2); ?></td>
                    <td>
                        <a href="edit_property.php?id=<?php echo $p['id']; ?>">Edit</a> |
                        <a href="delete_property.php?id=<?php echo $p['id']; ?>" onclick="return confirm('Delete?')">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <script src="../js/admin.js"></script>
</body>
</html>

<?php
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
}
?>