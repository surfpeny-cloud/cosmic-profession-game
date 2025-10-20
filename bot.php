<?php
$BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
$WEBAPP_URL = "https://your-domain.com/index.html";

$input = file_get_contents('php://input');
$update = json_decode($input, true);

if (isset($update['message'])) {
    $chat_id = $update['message']['chat']['id'];
    $text = $update['message']['text'];
    
    if ($text === '/start') {
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 ОТКРЫТЬ КОСМИЧЕСКУЮ ИГРУ',
                        'web_app' => ['url' => $WEBAPP_URL]
                    ]
                ]
            ]
        ];
        
        sendMessage($chat_id, 
            "🌌 <b>КОСМИЧЕСКОЕ ПУТЕШЕСТВИЕ К ПЛАНЕТЕ ПРОФЕССИЙ</b>\n\n" .
            "Привет, будущий космический специалист! 👨‍🚀\n\n" .
            "В этой игре тебя ждет:\n" .
            "⭐ Создание уникальной профессии будущего\n" .
            "🪐 Путешествие по 15 удивительным планетам\n" .
            "🎯 Интересные задания и головоломки\n" .
            "🏆 Возможность стать первым в своей профессии!\n\n" .
            "Нажми кнопку ниже чтобы начать приключение!",
            $keyboard
        );
    }
}

function sendMessage($chat_id, $text, $keyboard = null) {
    global $BOT_TOKEN;
    
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    
    $url = "https://api.telegram.org/bot{$BOT_TOKEN}/sendMessage";
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}
