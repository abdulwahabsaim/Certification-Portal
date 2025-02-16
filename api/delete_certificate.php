<?php
require_once "../db/config.php";

header('Content-Type: application/json');
session_start();

$certificate_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if (!$certificate_id) {
    echo json_encode(["success" => false, "error" => "Invalid certificate ID."]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit();
}

try {
    // Delete the certificate, BUT ONLY IF it belongs to the logged-in user
    $sql = "DELETE FROM certificates WHERE certificate_id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $certificate_id, $_SESSION['user_id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Certificate deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "error" => "Certificate not found or you do not have permission to delete it."]);
    }

} catch (Exception $e) {
    error_log("Error deleting certificate: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error deleting certificate."]);
}

$stmt->close();
$conn->close();
?>