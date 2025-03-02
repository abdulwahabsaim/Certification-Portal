<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    // User is logged in
    echo json_encode(["loggedIn" => true, "userName" => $_SESSION['user_name']]);
} else {
    // User is not logged in
    echo json_encode(["loggedIn" => false]);
}
?>