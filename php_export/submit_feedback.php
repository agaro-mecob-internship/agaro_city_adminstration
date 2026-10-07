<?php
// submit_feedback.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    exit();
}

$name = trim((string) ($input['name'] ?? ''));
$phone = trim((string) ($input['phone'] ?? ''));
$email = trim((string) ($input['email'] ?? ''));
$subject = trim((string) ($input['subject'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($name === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Name and message are required']);
    exit();
}

if (strlen($name) > 150 || strlen($phone) > 50 || strlen($email) > 255 || strlen($subject) > 255 || strlen($message) > 10000) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'One or more fields are too long']);
    exit();
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address']);
    exit();
}

try {
    $db = getDB();
    if (!$db) {
        throw new RuntimeException('Database connection unavailable');
    }

    $stmt = $db->prepare(
        'INSERT INTO contact_feedback (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $phone, $email, $subject, $message]);

    echo json_encode([
        'success' => true,
        'message' => 'Feedback submitted successfully',
        'id' => $db->lastInsertId()
    ]);
} catch (Throwable $error) {
    error_log('Contact feedback submission failed: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Unable to save feedback']);
}
?>
