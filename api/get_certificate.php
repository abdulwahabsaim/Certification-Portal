<?php
require_once "../db/config.php";

header('Content-Type: application/json');
session_start();

$certificate_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$certificate_id) {
    echo json_encode(["success" => false, "error" => "Invalid certificate ID."]);
    exit();
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit();
}

try {
    // Fetch the specific certificate, joining with users and templates
    $sql = "SELECT c.*, u.name, t.template_image, t.template_name
            FROM certificates c
            JOIN users u ON c.user_id = u.user_id
            JOIN templates t ON c.template_id = t.template_id
            WHERE c.certificate_id = ? AND c.user_id = ?"; // Check user_id too!

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $certificate_id, $_SESSION['user_id']); // Bind parameters
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $certificate = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $certificate]);
    } else {
        echo json_encode(["success" => false, "error" => "Certificate not found or you do not have permission to view it."]);
    }

} catch (Exception $e) {
    error_log("Error fetching certificate: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error retrieving certificate."]);
}

$stmt->close();
$conn->close();
?>