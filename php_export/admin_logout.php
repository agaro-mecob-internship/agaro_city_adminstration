<?php
// admin_logout.php - Admin logout endpoint

header('Content-Type: application/json');
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
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Clear all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>