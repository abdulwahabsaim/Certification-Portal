<?php
require_once "../db/config.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $password = $data['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "error" => "Email and password are required."]);
        exit();
    }

    $email = mysqli_real_escape_string($conn, $email);

    $sql = "SELECT user_id, name, email, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["success" => false, "error" => "Error preparing statement: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            // Password is correct, start session (or set other login indicators)
            session_start();  //  IMPORTANT!  Start the session
            $_SESSION['user_id'] = $row['user_id']; // Store the user ID
            $_SESSION['user_email'] = $row['email']; // Store the email (optional)
            $_SESSION['user_name'] = $row['name'];   // Store the user's name

            echo json_encode(["success" => true, "email" => $row['email'], "name" => $row['name']]); // Return user data
        } else {
            echo json_encode(["success" => false, "error" => "Invalid password."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Invalid email."]);
    }

    $stmt->close();
    $conn->close();
} else {
     echo json_encode(["success" => false, "error" => "Invalid Request."]);
}