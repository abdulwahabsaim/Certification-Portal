<?php
// Start the session (if not already started)
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Send a success response (optional)
header('Content-Type: application/json');
echo json_encode(["success" => true, "message" => "Logged out successfully"]);

?>