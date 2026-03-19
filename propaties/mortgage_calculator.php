<?php
// This is optional; mortgage calculation is handled client-side in JS.
// If needed server-side, implement here.
header('Content-Type: application/json');
echo json_encode(['message' => 'Mortgage calculation is client-side']);
?>