<?php
// Start the session (if not already started)
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Send a success response and redirect
header('Content-Type: application/json'); // Add this for consistency
echo json_encode(["success" => true, 'redirect' => 'index.html']); // Send redirect
exit; // Very important! Stop script execution after the redirect

?>