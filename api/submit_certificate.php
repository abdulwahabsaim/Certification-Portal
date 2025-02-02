<?php
require_once "../db/config.php"; // Include database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $date = $_POST['date'];
    $signature = $_POST['signature'];
    $details = $_POST['details'];
    $template_id = 1; // Default template ID (Can be dynamic later)

    // Insert user if not exists
    $sql = "INSERT INTO USERS (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)";
    $stmt = $conn->prepare($sql);
    $email = $name . "@example.com"; // Temporary email handling
    $stmt->bind_param("ss", $name, $email);
    $stmt->execute();

    // Get user ID
    $user_id = $conn->insert_id;

    // Insert certificate
    $sql = "INSERT INTO CERTIFICATES (user_id, template_id, certificate_name, issue_date, signature, details) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissss", $user_id, $template_id, $name, $date, $signature, $details);

    if ($stmt->execute()) {
        echo "Certificate saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
