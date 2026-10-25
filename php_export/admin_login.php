<?php
// admin_login_db.php - Database-based admin authentication

header('Content-Type: application/json');
session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax',
]);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originParts = parse_url($origin);
$requestHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
$isAllowedDevelopmentOrigin = is_array($originParts)
    && strtolower($originParts['host'] ?? '') === $requestHost
    && ($originParts['port'] ?? null) === 3000
    && ($originParts['scheme'] ?? '') === ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
if ($isAllowedDevelopmentOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    exit();
}

$username = trim((string) ($input['username'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($username !== AGARO_ADMIN_USERNAME || !password_verify($password, AGARO_ADMIN_PASSWORD_HASH)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid username or password'
    ]);
    exit();
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
session_regenerate_id(true);
$_SESSION['agaro_admin_authed'] = true;
$_SESSION['admin_logged_in'] = true;
$_SESSION['admin_username'] = AGARO_ADMIN_USERNAME;
$_SESSION['login_time'] = time();

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'username' => AGARO_ADMIN_USERNAME,
        'role' => 'admin'
    ]
]);
?>