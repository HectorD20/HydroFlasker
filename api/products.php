<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Incluir la conexión a la base de datos
require_once __DIR__ . '/db.php';

try {
    // Consultar todos los productos de la base de datos MySQL
    $stmt = $pdo->query("SELECT * FROM productos ORDER BY id ASC");
    $dbProducts = $stmt->fetchAll();

    $products = [];
    foreach ($dbProducts as $p) {
        // Mapear nombres de color a códigos hexadecimales comunes para mantener la estética premium
        $colorHex = getColorHex($p['color']);

        // Generar badges de forma inteligente y dinámica basándonos en la BD
        $badges = [];
        if (intval($p['stock']) <= 10) {
            $badges[] = ["label" => "Poco Stock", "type" => "sold"];
        }
        
        // Mantener coherencia con los bestsellers de la demo anterior
        $isBestseller = in_array(intval($p['id']), [4, 5, 6, 7]);
        if ($isBestseller && intval($p['id']) === 6) {
            $badges[] = ["label" => "Oferta", "type" => "sale"];
        } else if ($isBestseller) {
            $badges[] = ["label" => "Más Vendido", "type" => "info"];
        }

        // Descripciones consistentes y premium
        $desc = "Termo de hidratación premium marca " . ucfirst($p['marca']) . " de " . $p['capacidad'] . ", color " . $p['color'] . ". Diseñado con acero inoxidable duradero y tecnología de aislamiento de temperatura avanzada.";

        // Extraer la capacidad numérica
        preg_match('/\d+/', $p['capacidad'], $matches);
        $sizeNum = isset($matches[0]) ? intval($matches[0]) : 30;

        $products[] = [
            "id" => strval($p['id']), // Convertir ID a string para compatibilidad completa
            "name" => $p['nombre'],
            "brand" => strtolower($p['marca']),
            "variant" => $p['color'] . " — " . $p['capacidad'],
            "price" => floatval($p['precio']),
            "img" => $p['imagen_url'],
            "sizes" => [$sizeNum],
            "colors" => [$colorHex],
            "badges" => $badges,
            "moreColors" => 0,
            "bestseller" => $isBestseller,
            "description" => $desc
        ];
    }

    echo json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener productos: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

// Función auxiliar para mapear nombres de colores comunes a códigos HEX estéticos
function getColorHex($colorName) {
    $colorsMap = [
        'negro mate' => '#1e293b',
        'blanco ártico' => '#f5f5f5',
        'naranja fuego' => '#ff5722',
        'azul marino' => '#1e3a5f',
        'pacífico' => '#4cd7f6',
        'crema' => '#e3dfd3',
        'malvavisco tímido' => '#f4d9df',
        'cuarzo rosa' => '#f4d9df',
        'eucalipto' => '#d2dbd5',
        'negro' => '#2a2d34'
    ];
    
    $cleanName = strtolower(trim($colorName));
    return isset($colorsMap[$cleanName]) ? $colorsMap[$cleanName] : '#7f8c8d'; // Gris por defecto
}
