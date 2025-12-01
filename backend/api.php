<?php
require_once 'vendor/autoload.php';
require_once 'config.php'; // Connexion MySQL

use GuzzleHttp\Client;

$term = $_GET['term'] ?? '';
$location = $_GET['location'] ?? '';
$limit = $_GET['limit'] ?? 10;

if (!$term || !$location) {
    echo json_encode(['error' => 'Paramètres manquants']);
    exit;
}

$apiKey = '2eab4d07bcc9454eabcc674bb9152fb0'; // Ta clé Geoapify
$client = new Client();

try {
    $response = $client->request('GET', 'https://api.geoapify.com/v2/places', [
        'query' => [
            'categories' => 'commercial',
            'filter' => "city:{$location}",  // on va changer cette ligne
            'text' => $term,
            'limit' => $limit,
            'apiKey' => $apiKey
        ]
    ]);

    $data = json_decode($response->getBody(), true);
    $results = [];

    foreach ($data['features'] ?? [] as $feature) {
        $props = $feature['properties'] ?? [];
        $name = $props['name'] ?? '';
        $address = implode(', ', array_filter([
            $props['street'] ?? '',
            $props['housenumber'] ?? '',
            $props['postcode'] ?? '',
            $props['city'] ?? '',
            $props['state'] ?? '',
            $props['country'] ?? ''
        ]));
        $phone = $props['phone'] ?? '';
        $website = $props['website'] ?? '';
        $created_at = date('Y-m-d H:i:s');

        // Éviter les doublons
        $stmt = $pdo->prepare("SELECT id FROM businesses WHERE name=:name AND address=:address LIMIT 1");
        $stmt->execute(['name'=>$name,'address'=>$address]);
        if ($stmt->rowCount() == 0) {
            $insert = $pdo->prepare("INSERT INTO businesses (name,address,phone,website,created_at) VALUES (:name,:address,:phone,:website,:created_at)");
            $insert->execute([
                'name'=>$name,
                'address'=>$address,
                'phone'=>$phone,
                'website'=>$website,
                'created_at'=>$created_at
            ]);
        }

        $results[] = [
            'name'=>$name,
            'address'=>$address,
            'phone'=>$phone,
            'website'=>$website
        ];
    }

    echo json_encode(['businesses'=>$results]);

} catch (\GuzzleHttp\Exception\RequestException $e) {
    echo json_encode(['error'=>$e->getMessage()]);
}
