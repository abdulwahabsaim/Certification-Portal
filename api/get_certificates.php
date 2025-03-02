<?php
require_once "../db/config.php";

header('Content-Type: application/json');
session_start();

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

if (!$user_id) {
    echo json_encode(["success" => false, "error" => "User not logged in."]);
    exit();
}

// --- Sorting ---
// Default values: Sort by issue_date, descending
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'issue_date';
$sort_order = isset($_GET['sort_order']) ? $_GET['sort_order'] : 'desc';

// Validate sort_by and sort_order to prevent SQL injection
$allowed_sort_columns = ['certificate_name', 'issue_date', 'template_name']; // Fixed 'name' to 'certificate_name'
$allowed_sort_orders = ['asc', 'desc'];

// Use in_array for correct validation
if (!in_array($sort_by, $allowed_sort_columns)) {
    $sort_by = 'issue_date'; // Default to issue_date if invalid
}
if (!in_array(strtolower($sort_order), $allowed_sort_orders)) {
    $sort_order = 'desc';  // Default to descending if invalid
}

// --- Filtering ---
$filter_by = isset($_GET['filter_by']) ? $_GET['filter_by'] : '';
$filter_value = isset($_GET['filter_value']) ? $_GET['filter_value'] : '';

// Validate filter_by to prevent SQL injection
$allowed_filter_columns = ['certificate_name', 'template_name']; // Fixed 'name' to 'certificate_name'
if (!in_array($filter_by, $allowed_filter_columns)) {
    $filter_by = ''; // Disable filtering if invalid
    $filter_value = '';
}

// --- Pagination ---
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10; // Default 10 per page
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0; // Default start at 0

try {
    // Base query. This selects ALL the needed information, including template_image
    $sql = "SELECT c.certificate_id, c.certificate_name, c.issue_date, c.signature, c.details, t.template_name, t.template_image
            FROM certificates c
            JOIN templates t ON c.template_id = t.template_id
            WHERE c.user_id = ?";  // Always filter by the logged-in user

    // Add WHERE clause for filtering (if filter is applied)
    if ($filter_by && $filter_value) {
        if ($filter_by === 'certificate_name') {
            $sql .= " AND c.certificate_name LIKE ?";
        } else {
            $sql .= " AND t.template_name LIKE ?";
        }
        $filter_value = "%" . $filter_value . "%"; // Add wildcards
    }

    // Add ORDER BY clause for sorting
    $sql .= " ORDER BY " . $sort_by . " " . strtoupper($sort_order);

    // Add LIMIT and OFFSET for pagination
    $sql .= " LIMIT ?, ?";

    $stmt = $conn->prepare($sql);

    // Bind parameters based on whether filtering is applied
    if ($filter_by && $filter_value) {
        $stmt->bind_param("isii", $user_id, $filter_value, $offset, $limit); // i for integer, s for string
    } else {
        $stmt->bind_param("iii", $user_id, $offset, $limit); // i for integer
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $certificates = [];
    while ($row = $result->fetch_assoc()) {
        $certificates[] = $row;
    }

    // Get total count of certificates (for pagination)
    $count_sql = "SELECT COUNT(*) as total FROM certificates c";
    
    if ($filter_by && $filter_value) {
        $count_sql .= " JOIN templates t ON c.template_id = t.template_id WHERE c.user_id = ? AND ";
        if ($filter_by === 'certificate_name') {
            $count_sql .= " c.certificate_name LIKE ?";
        } else {
            $count_sql .= " t.template_name LIKE ?";
        }
    } else {
        $count_sql .= " WHERE c.user_id = ?"; // Basic WHERE clause for user_id
    }

    $count_stmt = $conn->prepare($count_sql);
    
    if ($filter_by && $filter_value) {
        $count_stmt->bind_param("is", $user_id, $filter_value); // Bind parameters with filter
    } else {
        $count_stmt->bind_param("i", $user_id); // Bind parameter without filter
    }
    
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total_certificates = $count_result->fetch_assoc()['total'];
    $count_stmt->close();

    echo json_encode([
        "success" => true,
        "data" => $certificates,
        "total" => $total_certificates, // Total count *before* LIMIT/OFFSET
        "limit" => $limit,  // Send limit back to the client
        "offset" => $offset // Send offset back to client
    ]);

} catch (Exception $e) {
    error_log("Error fetching certificates: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Error retrieving certificates: " . $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>