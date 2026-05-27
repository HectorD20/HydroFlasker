<?php
/* ==========================================================================
   HYDROFLASKER — API de Autenticación y Gestión de Usuarios (Correo/Contraseña)
   ========================================================================== */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Obtener payload (JSON o POST)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$action = isset($input['action']) ? trim($input['action']) : '';

if (empty($action)) {
    http_response_code(400);
    echo json_encode(["error" => "Acción no especificada."], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    switch ($action) {
        
        // ── 1. REGISTRO DE USUARIOS ──
        case 'register':
            $nombre   = isset($input['nombre']) ? trim($input['nombre']) : '';
            $email    = isset($input['email']) ? trim($input['email']) : '';
            $password = isset($input['password']) ? trim($input['password']) : '';
            
            if (empty($nombre) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(["error" => "Todos los campos son obligatorios."], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Verificar si el correo ya existe
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
            $stmt->execute(['email' => $email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(["error" => "El correo electrónico ya está registrado."], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Encriptar contraseña y guardar
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (:nombre, :email, :password, 'cliente')");
            $stmt->execute([
                'nombre'   => $nombre,
                'email'    => $email,
                'password' => $hash
            ]);
            
            $userId = $pdo->lastInsertId();
            
            echo json_encode([
                "success" => true,
                "message" => "Usuario registrado correctamente.",
                "user"    => [
                    "id"     => $userId,
                    "nombre" => $nombre,
                    "email"  => $email,
                    "rol"    => "cliente"
                ]
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        // ── 2. INICIO DE SESIÓN ──
        case 'login':
            $email    = isset($input['email']) ? trim($input['email']) : '';
            $password = isset($input['password']) ? trim($input['password']) : '';
            
            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(["error" => "Correo y contraseña son obligatorios."], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Buscar usuario
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($password, $user['password'])) {
                http_response_code(401);
                echo json_encode(["error" => "Correo electrónico o contraseña incorrectos."], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            echo json_encode([
                "success" => true,
                "user"    => [
                    "id"     => $user['id'],
                    "nombre" => $user['nombre'],
                    "email"  => $user['email'],
                    "rol"    => $user['rol']
                ]
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        // ── 3. OBTENER COMPRAS DEL USUARIO ──
        case 'get_purchases':
            $userId = isset($input['usuario_id']) ? intval($input['usuario_id']) : 0;
            
            if ($userId <= 0) {
                http_response_code(400);
                echo json_encode(["error" => "ID de usuario inválido."], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Consultar compras y asociar datos del producto
            $stmt = $pdo->prepare("
                SELECT c.id, c.cantidad, c.total, c.fecha_compra,
                       p.nombre AS producto_nombre, p.imagen_url, p.marca, p.precio AS precio_unitario
                FROM compras c
                INNER JOIN productos p ON c.producto_id = p.id
                WHERE c.usuario_id = :usuario_id
                ORDER BY c.fecha_compra DESC
            ");
            $stmt->execute(['usuario_id' => $userId]);
            $compras = $stmt->fetchAll();
            
            echo json_encode([
                "success" => true,
                "purchases" => $compras
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(["error" => "Acción no válida."], JSON_UNESCAPED_UNICODE);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Error interno en el servidor: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
