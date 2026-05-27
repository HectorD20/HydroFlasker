<?php
/* ==========================================================================
   HYDROFLASKER — API de Pago y Registro de Compras
   ========================================================================== */

// Reporte de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Obtener payload
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!$input) {
    $input = $_POST;
}

// Loguear petición para depuración
file_put_contents(__DIR__ . '/checkout_debug.log', "[" . date('Y-m-d H:i:s') . "] RAW INPUT: " . $rawInput . "\n", FILE_APPEND);

$usuarioId = isset($input['usuario_id']) ? intval($input['usuario_id']) : 0;
$items     = isset($input['items']) ? $input['items'] : [];

if ($usuarioId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Debes iniciar sesión para realizar una compra."], JSON_UNESCAPED_UNICODE);
    exit;
}

if (empty($items) || !is_array($items)) {
    http_response_code(400);
    echo json_encode(["error" => "El carrito de compras está vacío."], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Iniciar una transacción de base de datos
    $pdo->beginTransaction();

    $insertStmt = $pdo->prepare("
        INSERT INTO compras (usuario_id, producto_id, cantidad, total) 
        VALUES (:usuario_id, :producto_id, :cantidad, :total)
    ");

    $updateStockStmt = $pdo->prepare("
        UPDATE productos 
        SET stock = GREATEST(0, stock - :cantidad) 
        WHERE id = :producto_id
    ");

    $checkProductStmt = $pdo->prepare("
        SELECT nombre, stock FROM productos WHERE id = :producto_id
    ");

    foreach ($items as $item) {
        $itemId = isset($item['id']) ? strval($item['id']) : '';
        $qty    = isset($item['qty']) ? intval($item['qty']) : 1;
        $price  = isset($item['price']) ? floatval($item['price']) : 0.0;

        // Extraer ID real de la base de datos (Ej: "5-32-azul" -> ID de producto: 5)
        $idParts = explode('-', $itemId);
        $productId = intval($idParts[0]);

        if ($productId <= 0) {
            throw new Exception("ID de producto inválido en el carrito: " . $itemId);
        }

        // Verificar si el producto existe
        $checkProductStmt->execute(['producto_id' => $productId]);
        $product = $checkProductStmt->fetch();

        if (!$product) {
            throw new Exception("El producto con ID $productId no existe en la base de datos.");
        }

        // Calcular el total para este artículo
        $totalItem = $price * $qty;

        // Insertar en la tabla de compras
        $insertStmt->execute([
            'usuario_id'  => $usuarioId,
            'producto_id' => $productId,
            'cantidad'    => $qty,
            'total'       => $totalItem
        ]);

        // Actualizar el stock del producto
        $updateStockStmt->execute([
            'cantidad'    => $qty,
            'producto_id' => $productId
        ]);
    }

    // Confirmar todos los cambios
    $pdo->commit();

    // Registrar éxito en el log de depuración
    file_put_contents(__DIR__ . '/checkout_debug.log', "[" . date('Y-m-d H:i:s') . "] ÉXITO: Compra registrada para usuario $usuarioId\n", FILE_APPEND);

    echo json_encode([
        "success" => true,
        "message" => "¡Compra registrada con éxito en la base de datos!"
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Si algo falla, revertimos todos los cambios
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    // Registrar error en el log de depuración
    file_put_contents(__DIR__ . '/checkout_debug.log', "[" . date('Y-m-d H:i:s') . "] ERROR: " . $e->getMessage() . "\n", FILE_APPEND);

    http_response_code(500);
    echo json_encode([
        "error" => "Error al procesar la compra: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
