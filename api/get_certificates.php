<?php
require_once "../db/config.php";

header('Content-Type: application/json');

// Start session to get user ID (IMPORTANT: Use sessions for logged-in user)
session_start(); // IMPORTANT: UNCOMMENT THIS

// Get user ID from session (replace with your actual session variable)
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;  //UNCOMMENT

// FOR DEMONSTRATION/TESTING PURPOSES ONLY. REMOVE THIS AFTER TESTING:
// if (!$user_id) { $user_id = 1; }  //  REMOVE THIS LINE AFTER TESTING

if (!$user_id) {  // IMPORTANT: Check for user ID
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit();
}

try {
    // Pagination support (default: 10 certificates per page)
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    // Fetch certificates with pagination and template name, FOR A SPECIFIC USER
    $sql = "SELECT c.certificate_id, u.name, c.certificate_name, c.issue_date, c.signature, c.details, t.template_name
            FROM CERTIFICATES c
            JOIN USERS u ON c.user_id = u.user_id
            JOIN TEMPLATES t ON c.template_id = t.template_id
            WHERE u.user_id = ?  
            LIMIT ?, ?";

    $stmt = $conn->prepare($sql);
     $stmt->bind_param("iii", $user_id, $offset, $limit); // Bind the user ID
    $stmt->execute();
    $result = $stmt->get_result();

    $certificates = [];
    while ($row = $result->fetch_assoc()) {
        $certificates[] = $row;
    }

    echo json_encode(["success" => true, "data" => $certificates]);

} catch (Exception $e) {
    error_log("Error fetching certificates: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error retrieving certificates."]);
}

$stmt->close();
$conn->close();
?>