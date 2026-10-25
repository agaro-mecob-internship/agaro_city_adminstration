<?php
session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Lax',
]);

require_once __DIR__ . '/config.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$isAuthenticated = (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)
    || (isset($_SESSION['agaro_admin_authed']) && $_SESSION['agaro_admin_authed'] === true);
$feedbackItems = [];
$loadError = '';
$actionError = '';
$successMessage = '';
$db = null;

if (!$isAuthenticated) {
    http_response_code(403);
} else {
    if (empty($_SESSION['feedback_csrf_token'])) {
        $_SESSION['feedback_csrf_token'] = bin2hex(random_bytes(32));
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['mark_reviewed'])) {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!is_string($csrfToken) || !hash_equals($_SESSION['feedback_csrf_token'], $csrfToken)) {
            http_response_code(403);
            $actionError = 'Your session could not be verified. Refresh the page and try again.';
        } else {
            $rawFeedbackId = $_POST['feedback_id'] ?? '';
            $feedbackId = is_string($rawFeedbackId) && preg_match('/\A[1-9][0-9]*\z/', $rawFeedbackId)
                ? filter_var($rawFeedbackId, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
                : false;

            if ($feedbackId === false) {
                http_response_code(400);
                $actionError = 'The selected feedback message is invalid.';
            } else {
                $db = getDB();
                if (!$db) {
                    $actionError = 'The feedback status could not be updated because the database is unavailable.';
                } else {
                    try {
                        $update = $db->prepare(
                            "UPDATE contact_feedback SET status = 'reviewed' WHERE id = ? AND status = 'new'"
                        );
                        $update->execute([$feedbackId]);

                        if ($update->rowCount() === 1) {
                            header('Location: feadback.php?reviewed=1', true, 303);
                            exit();
                        }

                        $actionError = 'This feedback message is already reviewed or could not be found.';
                    } catch (PDOException $error) {
                        error_log('Admin feedback review update failed: ' . $error->getMessage());
                        $actionError = 'The feedback status could not be updated. Please try again later.';
                    }
                }
            }
        }
    }

    if (isset($_GET['reviewed']) && $_GET['reviewed'] === '1') {
        $successMessage = 'Feedback marked as reviewed.';
    }

    $db = $db ?: getDB();
    if (!$db) {
        $loadError = 'Feedback could not be loaded because the database is unavailable.';
    } else {
        try {
            $stmt = $db->query(
                'SELECT id, name, phone, email, subject, message, status, created_at
                 FROM contact_feedback
                 ORDER BY created_at DESC, id DESC'
            );
            $feedbackItems = $stmt->fetchAll();
        } catch (PDOException $error) {
            error_log('Admin feedback list failed: ' . $error->getMessage());
            $loadError = 'Feedback could not be loaded. Please try again later.';
        }
    }
}

function escapeFeedbackValue($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$newFeedbackCount = count(array_filter(
    $feedbackItems,
    static fn(array $item): bool => ($item['status'] ?? '') === 'new'
));
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Inbox | Agaro City Administration</title>
    <style>
        :root {
            color-scheme: light;
            font-family: Arial, sans-serif;
            background: #f3f6f4;
            color: #17211b;
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 20px max(24px, calc((100% - 1120px) / 2));
            background: #075c3b;
            color: #fff;
        }
        header h1 { margin: 0; font-size: 21px; }
        header a { color: #fff; font-weight: 700; }
        main { max-width: 1120px; margin: 32px auto; padding: 0 24px; }
        .intro { margin-bottom: 24px; }
        .intro h2 { margin: 0 0 8px; font-size: 28px; }
        .intro p { margin: 0; color: #526158; }
        .summary { display: flex; gap: 14px; margin-bottom: 22px; }
        .summary-card, .feedback-card, .notice {
            background: #fff;
            border: 1px solid #dce5de;
            border-radius: 12px;
            box-shadow: 0 3px 12px rgba(20, 50, 32, .04);
        }
        .summary-card { min-width: 150px; padding: 16px 20px; }
        .summary-card strong { display: block; font-size: 24px; }
        .summary-card span { color: #526158; font-size: 13px; }
        .feedback-list { display: grid; gap: 14px; }
        .feedback-card { padding: 20px; }
        .feedback-heading {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 14px;
        }
        .feedback-heading h3 { margin: 0 0 6px; font-size: 18px; }
        .feedback-meta { color: #65736a; font-size: 13px; line-height: 1.6; }
        .feedback-status-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 8px;
        }
        .status {
            flex-shrink: 0;
            padding: 5px 10px;
            border-radius: 999px;
            background: #eaf1ec;
            color: #344a3b;
            font-size: 12px;
            font-weight: 700;
        }
        .status-new { background: #fff2cc; color: #805b00; }
        .status-reviewed { background: #dcfce7; color: #166534; }
        .review-form { margin: 0; }
        .review-button {
            border: 0;
            border-radius: 8px;
            padding: 8px 12px;
            background: #15803d;
            color: #fff;
            font: inherit;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: background-color .15s ease, box-shadow .15s ease;
        }
        .review-button:hover { background: #166534; }
        .review-button:focus-visible { outline: 3px solid #86efac; outline-offset: 2px; }
        .feedback-message {
            margin: 0;
            padding-top: 14px;
            border-top: 1px solid #edf1ed;
            line-height: 1.65;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }
        .notice { padding: 18px 20px; color: #526158; }
        .notice.error { border-color: #f2c5c5; color: #9b2929; }
        .notice.success { margin-bottom: 16px; border-color: #bbf7d0; color: #166534; }
        @media (max-width: 600px) {
            header { align-items: flex-start; flex-direction: column; }
            main { margin-top: 24px; padding: 0 16px; }
            .feedback-heading { flex-direction: column; }
            .feedback-status-actions { justify-content: flex-start; }
        }
    </style>
</head>
<body>
    <header>
        <h1>Agaro City Administration</h1>
        <a href="http://10.232.85.134:3000/">Back to Admin</a>
    </header>
    <main>
        <section class="intro">
            <h2>Feedback Inbox</h2>
            <p>Messages submitted by visitors through the city website.</p>
        </section>

        <?php if (!$isAuthenticated): ?>
            <div class="notice error" role="alert">
                You must sign in as an administrator to view submitted feedback.
            </div>
        <?php elseif ($loadError !== ''): ?>
            <?php if ($actionError !== ''): ?>
                <div class="notice error" role="alert"><?php echo escapeFeedbackValue($actionError); ?></div>
            <?php endif; ?>
            <div class="notice error" role="alert"><?php echo escapeFeedbackValue($loadError); ?></div>
        <?php else: ?>
            <?php if ($successMessage !== ''): ?>
                <div class="notice success" role="status"><?php echo escapeFeedbackValue($successMessage); ?></div>
            <?php endif; ?>
            <?php if ($actionError !== ''): ?>
                <div class="notice error" role="alert"><?php echo escapeFeedbackValue($actionError); ?></div>
            <?php endif; ?>

            <section class="summary" aria-label="Feedback summary">
                <div class="summary-card">
                    <strong><?php echo count($feedbackItems); ?></strong>
                    <span>Total messages</span>
                </div>
                <div class="summary-card">
                    <strong><?php echo $newFeedbackCount; ?></strong>
                    <span>New messages</span>
                </div>
            </section>

            <?php if ($feedbackItems === []): ?>
                <div class="notice">No feedback has been submitted yet.</div>
            <?php else: ?>
                <section class="feedback-list" aria-label="Submitted feedback">
                    <?php foreach ($feedbackItems as $item): ?>
                        <?php
                        $status = (string) ($item['status'] ?? 'new');
                        $subject = trim((string) ($item['subject'] ?? ''));
                        $createdAt = (string) ($item['created_at'] ?? '');
                        $timestamp = $createdAt !== '' ? strtotime($createdAt) : false;
                        $formattedDate = $timestamp !== false ? date('M j, Y · g:i A', $timestamp) : '';
                        $isNew = $status === 'new';
                        $statusLabel = $status === 'reviewed' ? 'Reviewed' : ($isNew ? 'New' : ucfirst($status));
                        ?>
                        <article class="feedback-card">
                            <div class="feedback-heading">
                                <div>
                                    <h3><?php echo escapeFeedbackValue($subject !== '' ? $subject : 'Feedback message'); ?></h3>
                                    <div class="feedback-meta">
                                        <strong><?php echo escapeFeedbackValue($item['name'] ?? ''); ?></strong>
                                        <?php if (!empty($item['email'])): ?>
                                            · <a href="mailto:<?php echo escapeFeedbackValue($item['email']); ?>"><?php echo escapeFeedbackValue($item['email']); ?></a>
                                        <?php endif; ?>
                                        <?php if (!empty($item['phone'])): ?>
                                            · <?php echo escapeFeedbackValue($item['phone']); ?>
                                        <?php endif; ?>
                                        <?php if ($formattedDate !== ''): ?>
                                            <br><?php echo escapeFeedbackValue($formattedDate); ?>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="feedback-status-actions">
                                    <span class="status <?php echo $isNew ? 'status-new' : ($status === 'reviewed' ? 'status-reviewed' : ''); ?>">
                                        <?php echo escapeFeedbackValue($statusLabel); ?>
                                    </span>
                                    <?php if ($isNew): ?>
                                        <form class="review-form" method="post" action="feadback.php">
                                            <input type="hidden" name="csrf_token" value="<?php echo escapeFeedbackValue($_SESSION['feedback_csrf_token']); ?>">
                                            <input type="hidden" name="feedback_id" value="<?php echo escapeFeedbackValue($item['id']); ?>">
                                            <button class="review-button" type="submit" name="mark_reviewed" value="1">
                                                ✓ Mark as Reviewed
                                            </button>
                                        </form>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <p class="feedback-message"><?php echo escapeFeedbackValue($item['message'] ?? ''); ?></p>
                        </article>
                    <?php endforeach; ?>
                </section>
            <?php endif; ?>
        <?php endif; ?>
    </main>
</body>
</html>
