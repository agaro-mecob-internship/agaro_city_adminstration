<?php
// api_media.php - Public media listing and admin image uploads
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$allowedKeys = [
    'gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5', 'gallery-6',
    'mayor', 'cab-1', 'cab-2', 'cab-3', 'cab-4', 'cab-5',
    'mesob-center', 'services-leader-1', 'services-leader-2'
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDB();
        if (!$db) {
            throw new RuntimeException('Database connection unavailable');
        }

        $rows = $db->query('SELECT asset_key, asset_type, image, updated_at FROM media_assets ORDER BY id')->fetchAll();
        $profiles = $db->query('SELECT asset_key, name, task, location, email, image, updated_at FROM government_profiles')->fetchAll();
        echo json_encode(['success' => true, 'data' => $rows, 'government' => $profiles]);
    } catch (Throwable $error) {
        error_log('Media listing failed: ' . $error->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Unable to load media']);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$assetKey = trim((string) ($_POST['asset_key'] ?? ''));
if (!in_array($assetKey, $allowedKeys, true)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Invalid media asset']);
    exit();
}

$isGovernment = $assetKey === 'mayor' || str_starts_with($assetKey, 'cab-') || str_starts_with($assetKey, 'services-leader-') || $assetKey === 'mesob-center';
$name = trim((string) ($_POST['name'] ?? ''));
$task = trim((string) ($_POST['task'] ?? ''));
$location = trim((string) ($_POST['location'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));

if ($isGovernment && ($name === '' || strlen($name) > 255 || strlen($task) > 5000 || strlen($location) > 255 || strlen($email) > 255)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Name is required and one or more fields are too long']);
    exit();
}

if (!$isGovernment && (!isset($_FILES['image_file']) || $_FILES['image_file']['error'] !== UPLOAD_ERR_OK)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Please select an image']);
    exit();
}

$file = $_FILES['image_file'] ?? null;
$relativePath = null;

if ($file && $file['error'] === UPLOAD_ERR_OK) {
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Image must be smaller than 5 MB']);
    exit();
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif'
];
if (!isset($extensions[$mime])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => 'Only JPG, PNG, WEBP, and GIF images are allowed']);
    exit();
}
}

try {
    $db = getDB();
    if (!$db) {
        throw new RuntimeException('Database connection unavailable');
    }

    if ($file && $file['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/media/';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true)) {
            throw new RuntimeException('Unable to create media directory');
        }

        $fileName = $assetKey . '-' . bin2hex(random_bytes(6)) . '.' . $extensions[$mime];
        $targetPath = $uploadDir . $fileName;
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new RuntimeException('Unable to save uploaded image');
        }
        $relativePath = 'uploads/media/' . $fileName;
    }

    if ($isGovernment) {
        if ($relativePath === null) {
            $existing = $db->prepare('SELECT image FROM government_profiles WHERE asset_key = ?');
            $existing->execute([$assetKey]);
            $relativePath = $existing->fetchColumn() ?: null;
        }
        $stmt = $db->prepare(
            'INSERT INTO government_profiles (asset_key, name, task, location, email, image) VALUES (?, ?, ?, ?, ?, ?) '
            . 'ON DUPLICATE KEY UPDATE name = VALUES(name), task = VALUES(task), location = VALUES(location), email = VALUES(email), image = VALUES(image), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([$assetKey, $name, $task, $location, $email, $relativePath]);
    } else {
        $stmt = $db->prepare(
            'INSERT INTO media_assets (asset_key, asset_type, image) VALUES (?, ?, ?) '
            . 'ON DUPLICATE KEY UPDATE image = VALUES(image), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([$assetKey, 'gallery', $relativePath]);
    }

    echo json_encode(['success' => true, 'asset_key' => $assetKey, 'image' => $relativePath, 'name' => $name, 'task' => $task, 'location' => $location, 'email' => $email]);
} catch (Throwable $error) {
    error_log('Media upload failed: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Unable to save image']);
}
?>