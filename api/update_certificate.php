<?php
require_once "../db/config.php";
header('Content-Type: application/json');
session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    exit();
}

$certificate_id = isset($_POST['certificate_id']) ? intval($_POST['certificate_id']) : 0;
$name = trim($_POST['name']);
$date = isset($_POST['date']) ? $_POST['date'] : '';
$signature = isset($_POST['signature']) ? $_POST['signature'] : '';
$details = isset($_POST['details']) ? $_POST['details'] : '';
$template_id = isset($_POST['template_id']) ? intval($_POST['template_id']) : 1;


if (!$certificate_id || empty($name) || empty($date) || empty($signature) || empty($details)) {
    echo json_encode(["success" => false, "error" => "All fields are required."]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit();
}

// Validate date format (YYYY-MM-DD)
if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
    echo json_encode(["success" => false, "error" => "Invalid date format. Use YYYY-MM-DD."]);
    exit();
}

// Sanitize
$name = mysqli_real_escape_string($conn, $name);
$signature = mysqli_real_escape_string($conn, $signature);
$details = mysqli_real_escape_string($conn, $details);

try {
     // Update the certificate, BUT ONLY IF it belongs to the logged-in user
    $sql = "UPDATE certificates SET template_id = ?, certificate_name = ?, issue_date = ?, signature = ?, details = ?
            WHERE certificate_id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issssi", $template_id, $name, $date, $signature, $details, $certificate_id, $_SESSION['user_id']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Certificate updated successfully."]);
    }
     else {
       echo json_encode(["success" => false, "error" => "Certificate not found or you do not have permission to update it."]);
    }


} catch (Exception $e) {
    error_log("Error updating certificate: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error updating certificate."]);
}

$stmt->close();
$conn->close();
?>