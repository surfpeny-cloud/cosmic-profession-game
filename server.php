<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? $_GET['action'] ?? '';

$response = ['success' => false, 'message' => 'Unknown action'];

switch ($action) {
    case 'save_game':
        $response = saveGameData($data);
        break;
    case 'load_game':
        $response = loadGameData($data);
        break;
    case 'get_leaderboard':
        $response = getLeaderboard();
        break;
    case 'create_session':
        $response = createMultiplayerSession($data);
        break;
    case 'join_session':
        $response = joinMultiplayerSession($data);
        break;
}

echo json_encode($response);

function saveGameData($data) {
    $filename = 'saves/' . $data['playerId'] . '.json';
    file_put_contents($filename, json_encode($data));
    return ['success' => true, 'message' => 'Game saved'];
}

function loadGameData($data) {
    $filename = 'saves/' . $data['playerId'] . '.json';
    if (file_exists($filename)) {
        $savedData = json_decode(file_get_contents($filename), true);
        return ['success' => true, 'data' => $savedData];
    }
    return ['success' => false, 'message' => 'No saved game found'];
}

function getLeaderboard() {
    // Демо-данные для рейтинга
    return [
        'success' => true,
        'leaderboard' => [
            ['name' => 'Космонавт Алекс', 'stars' => 156, 'level' => 5],
            ['name' => 'Звездная Мария', 'stars' => 142, 'level' => 5],
            ['name' => 'Галактический Макс', 'stars' => 128, 'level' => 4]
        ]
    ];
}

function createMultiplayerSession($data) {
    $sessionId = uniqid('session_');
    $sessionData = [
        'sessionId' => $sessionId,
        'host' => $data['host'],
        'players' => [$data['host']],
        'status' => 'waiting',
        'created' => time()
    ];
    
    file_put_contents('sessions/' . $sessionId . '.json', json_encode($sessionData));
    return ['success' => true, 'sessionId' => $sessionId];
}

function joinMultiplayerSession($data) {
    $sessionFile = 'sessions/' . $data['sessionId'] . '.json';
    if (file_exists($sessionFile)) {
        $sessionData = json_decode(file_get_contents($sessionFile), true);
        $sessionData['players'][] = $data['playerId'];
        file_put_contents($sessionFile, json_encode($sessionData));
        return ['success' => true, 'session' => $sessionData];
    }
    return ['success' => false, 'message' => 'Session not found'];
}
?>
