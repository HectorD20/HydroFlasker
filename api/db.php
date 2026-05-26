<?php
/* ==========================================================================
   HYDROFLASKER — Conexión a Base de Datos (PDO)
   Configura estos valores con las credenciales de tu base de datos en Hostinger.
   ========================================================================== */

define('DB_HOST', 'localhost');                  // Servidor de BD (usualmente localhost en Hostinger)
define('DB_NAME', 'u123456789_hydroflasker');   // Nombre de la base de datos creada en Hostinger
define('DB_USER', 'u123456789_hecto');          // Usuario de la base de datos en Hostinger
define('DB_PASS', 'TuContraseñaSegura123');     // Contraseña del usuario de la base de datos

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    // Si la conexión falla, retornamos error en formato JSON para el frontend
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        "error" => "Error de conexión con la base de datos: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
