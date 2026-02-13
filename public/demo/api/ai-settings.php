<?php
/**
 * MDT ERP - AI Settings API
 * Stores/retrieves AI configuration (provider, model, API key)
 * Data stored in JSON file on server (not in localStorage)
 *
 * Endpoints:
 *   GET  /api/ai-settings.php - Load settings
 *   POST /api/ai-settings.php - Save settings
 *   DELETE /api/ai-settings.php - Delete settings
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Settings file location (outside public web root for security)
$dataDir = __DIR__ . '/../.data';
$settingsFile = $dataDir . '/ai_settings.json';

// Ensure data directory exists
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
    // Add .htaccess to prevent direct access
    file_put_contents($dataDir . '/.htaccess', "Deny from all\n");
}

// Simple token-based auth (optional, for production use proper auth)
$authToken = isset($_SERVER['HTTP_X_MDT_TOKEN']) ? $_SERVER['HTTP_X_MDT_TOKEN'] : '';
$validTokens = loadTokens($dataDir);

function loadTokens($dataDir) {
    $tokenFile = $dataDir . '/tokens.json';
    if (file_exists($tokenFile)) {
        return json_decode(file_get_contents($tokenFile), true) ?: [];
    }
    // Default: allow any access for demo
    return ['demo' => true];
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function loadSettings($file) {
    if (!file_exists($file)) {
        return [
            'provider' => 'gemini',
            'model' => 'gemini-2.0-flash',
            'keys' => [],
            'updated_at' => null,
        ];
    }
    $data = json_decode(file_get_contents($file), true);
    return $data ?: [];
}

function saveSettings($file, $data) {
    $data['updated_at'] = date('Y-m-d H:i:s');
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return file_put_contents($file, $json) !== false;
}

// === ROUTES ===

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Load settings
        $settings = loadSettings($settingsFile);

        // Mask API keys for security (only show first 8 + last 4 chars)
        $masked = $settings;
        if (isset($masked['keys']) && is_array($masked['keys'])) {
            foreach ($masked['keys'] as $provider => $key) {
                if (strlen($key) > 12) {
                    $masked['keys'][$provider] = substr($key, 0, 8) . '...' . substr($key, -4);
                    $masked['keys_masked'][$provider] = true;
                }
            }
        }

        // Include full keys only if requested with special header
        $showFull = isset($_SERVER['HTTP_X_MDT_FULL_KEY']) && $_SERVER['HTTP_X_MDT_FULL_KEY'] === 'true';
        if ($showFull) {
            respond(['success' => true, 'data' => $settings]);
        } else {
            respond(['success' => true, 'data' => $masked]);
        }
        break;

    case 'POST':
        // Save settings
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            respond(['success' => false, 'error' => 'Invalid JSON body'], 400);
        }

        // Load existing to merge
        $current = loadSettings($settingsFile);

        // Update fields
        if (isset($input['provider'])) {
            $allowed = ['gemini', 'grok'];
            if (in_array($input['provider'], $allowed)) {
                $current['provider'] = $input['provider'];
            }
        }

        if (isset($input['model'])) {
            $current['model'] = preg_replace('/[^a-zA-Z0-9\-\.]/', '', $input['model']);
        }

        if (isset($input['key']) && isset($input['key_provider'])) {
            if (!isset($current['keys'])) $current['keys'] = [];
            $current['keys'][$input['key_provider']] = $input['key'];
        }

        // Save model per provider
        if (isset($input['model_provider']) && isset($input['model'])) {
            if (!isset($current['models'])) $current['models'] = [];
            $current['models'][$input['model_provider']] = $input['model'];
        }

        if (saveSettings($settingsFile, $current)) {
            respond(['success' => true, 'message' => 'Settings saved']);
        } else {
            respond(['success' => false, 'error' => 'Failed to save settings'], 500);
        }
        break;

    case 'DELETE':
        // Reset settings
        if (file_exists($settingsFile)) {
            unlink($settingsFile);
        }
        respond(['success' => true, 'message' => 'Settings reset']);
        break;

    default:
        respond(['success' => false, 'error' => 'Method not allowed'], 405);
}
