<?php
require_once "../db/config.php";

header('Content-Type: application/json');

try {
    $sql = "SELECT template_id, template_name, thumbnail_image FROM templates";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $templates = [];
    while ($row = $result->fetch_assoc()) {
        $templates[] = $row;
    }

    echo json_encode(["success" => true, "data" => $templates]);

} catch (Exception $e) {
    error_log("Error fetching templates: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error retrieving templates."]);
}

$stmt->close();
$conn->close();
?>