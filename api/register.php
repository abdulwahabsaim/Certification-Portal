<?php
require_once "../db/config.php";

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];

    // Basic validation (you should add more robust validation)
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(["success" => false, "error" => "All fields are required."]);
        exit();
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
         echo json_encode(["success" => false, "error" => "Invalid Email Format."]);
          exit();
    }

    $name = mysqli_real_escape_string($conn, $name);
    $email = mysqli_real_escape_string($conn, $email);
    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash the password

    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(["success" => false, "error" => "Error preparing statement: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("sss", $name, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registration successful!"]);
    } else {
        // Check for duplicate email error (MySQL error code 1062)
        if ($conn->errno == 1062) {
             echo json_encode(["success" => false, "error" => "Email already registered."]);
        }
        else{
            echo json_encode(["success" => false, "error" => "Error: " . $stmt->error]);
        }
    }

    $stmt->close();
    $conn->close();
}
 else {
      echo json_encode(["success" => false, "error" => "Invalid Request."]);
}