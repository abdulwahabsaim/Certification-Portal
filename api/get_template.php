<?php
require_once "../db/config.php";
header('Content-Type: application/json');

$template_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$template_id) {
    echo json_encode(["success" => false, "error" => "Invalid template ID."]);
    exit();
}

try {
    $sql = "SELECT template_image FROM templates WHERE template_id = ?"; // Select only template_image
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $template_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $row]); // Return the row
    } else {
        echo json_encode(["success" => false, "error" => "Template not found."]);
    }

} catch (Exception $e) {
    error_log("Error fetching template: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error retrieving template."]);
}

$stmt->close();
$conn->close();

?>