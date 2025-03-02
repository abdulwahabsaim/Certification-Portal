<?php
$servername = "localhost"; // Change this if using a remote server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "certification_portal"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    //In production, you can also redirect to error page.
}

// Set character set to UTF-8 (Good practice for handling various characters)
mysqli_set_charset($conn, "utf8");

?>