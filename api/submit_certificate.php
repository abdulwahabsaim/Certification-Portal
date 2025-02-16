<?php
require_once "../db/config.php"; // Include database connection

header('Content-Type: application/json'); // Set JSON content type
session_start(); // Start the session

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get POST data
    $name = trim($_POST['name']);
    $date = isset($_POST['date']) ? $_POST['date'] : '';
    $signature = isset($_POST['signature']) ? $_POST['signature'] : '';
    $details = isset($_POST['details']) ? $_POST['details'] : '';
    $template_id = isset($_POST['template_id']) ? intval($_POST['template_id']) : 1;

    // Get the user's ID from session - No email needed!
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;


    // Check if any of the required fields are empty, including user_id
    if (empty($name) || empty($date) || empty($signature) || empty($details) || !$user_id) {
        echo json_encode(["success" => false, "error" => "All fields must be filled out."]);
        exit();
    }
    // Validate date format (YYYY-MM-DD)
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
        echo json_encode(["success" => false, "error" => "Invalid date format. Use YYYY-MM-DD."]);
        exit();
    }

    // Sanitize data before using in query (important for security)
    $name = mysqli_real_escape_string($conn, $name);
    $signature = mysqli_real_escape_string($conn, $signature);
    $details = mysqli_real_escape_string($conn, $details);
    // $template_id is already an integer due to intval()

    // Insert certificate (no need to insert/update user here)
    $sql = "INSERT INTO CERTIFICATES (user_id, template_id, certificate_name, issue_date, signature, details) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["success" => false, "error" => "Error preparing the certificate query: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("iissss", $user_id, $template_id, $name, $date, $signature, $details);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Certificate saved successfully!"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error executing certificate insert query: " . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}
?>