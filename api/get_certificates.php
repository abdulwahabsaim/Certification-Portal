<?php
require_once "../db/config.php";

$sql = "SELECT c.certificate_id, u.name, c.certificate_name, c.issue_date, c.signature, c.details
        FROM CERTIFICATES c
        JOIN USERS u ON c.user_id = u.user_id";
$result = $conn->query($sql);

$certificates = [];
while ($row = $result->fetch_assoc()) {
    $certificates[] = $row;
}

header('Content-Type: application/json');
echo json_encode($certificates);
$conn->close();
?>
