-- ==========================================================================
-- HYDROFLASKER — Script de Base de Datos para Hostinger
-- Copia e importa este archivo en la pestaña SQL de phpMyAdmin
-- ==========================================================================

-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100) NOT NULL,      -- Ej: 'yeti', 'stanley', 'hydroflask', 'owala'
    capacidad VARCHAR(50) NOT NULL,   -- Ej: '30 oz', '32 oz', '40 oz', '20 oz', '24 oz'
    color VARCHAR(50) NOT NULL,       -- Ej: 'Negro Mate', 'Blanco Ártico', 'Crema', 'Azul Marino'
    precio DECIMAL(10, 2) NOT NULL,   -- Ej: 35.00
    imagen_url VARCHAR(500),          -- URL de la imagen del termo
    stock INT DEFAULT 10,             -- Cantidad disponible
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- Contraseña encriptada
    rol VARCHAR(20) DEFAULT 'cliente', -- 'cliente' o 'admin'
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Compras
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    total DECIMAL(10, 2) NOT NULL,     -- Precio total de la compra
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
-- ==========================================================================
-- HYDROFLASKER — Script de Base de Datos para Hostinger
-- Copia e importa este archivo en la pestaña SQL de phpMyAdmin
-- ==========================================================================

-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    marca VARCHAR(100) NOT NULL,      -- Ej: 'yeti', 'stanley', 'hydroflask', 'owala'
    capacidad VARCHAR(50) NOT NULL,   -- Ej: '30 oz', '32 oz', '40 oz', '20 oz', '24 oz'
    color VARCHAR(50) NOT NULL,       -- Ej: 'Negro Mate', 'Blanco Ártico', 'Crema', 'Azul Marino'
    precio DECIMAL(10, 2) NOT NULL,   -- Ej: 35.00
    imagen_url VARCHAR(500),          -- URL de la imagen del termo
    stock INT DEFAULT 10,             -- Cantidad disponible
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- Contraseña encriptada
    rol VARCHAR(20) DEFAULT 'cliente', -- 'cliente' o 'admin'
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Compras
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    total DECIMAL(10, 2) NOT NULL,     -- Precio total de la compra
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ==========================================================================
-- INSERCIÓN DE PRODUCTOS INICIALES (Datos del catálogo actual)
-- ==========================================================================

INSERT INTO productos (nombre, marca, capacidad, color, precio, imagen_url, stock) VALUES
('The Commuter 30oz', 'stanley', '30 oz', 'Negro Mate', 699.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMmgTJG17iNWyp2Tk_ZbNybk3FmB7WRESWF1AmAaPQmXNVr1k3n_oNUEGmnWDLGZFMT10V4SFOanFMVrQZSPtmTnJz9mHJnoq6jH6XAE1BPsK3Enj4nhwkLp4iIX-C6zZgf85ML1a4jSE_-Dli_LeP0GN2EFOW1_KtokrmP13j0bnqoBef5TajMk_2oUMgCouT1ZzFuyQnEpciV6D1FxamGF29Rgy7n7GmwPYVdriTHPNEszkMr7FGO7w-X-jjaBOmxzch3Dln7o', 15),
('Basecamp Flask 40oz', 'hydroflask', '40 oz', 'Blanco Ártico', 899.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg462SB--TbsuEiS2ns8KIEReup8LlAEiOPVffj7fQ-uLkLSQhcOmjvXXGAZXm5Ast6bJFi7g4XgJNIiFjxQvG4qyzcBdxtF-dnne6h-L72jHKnbjSh5l1gHSmzZQyftgnX2859_poApNfWRlqtasmHaYSSdR79BrQ1BFnr8g2d89z26RvWNhodtwcBz-xPCqRqzyZ8n-KRcxjpxUYMzOWHr0mS38O5CX8M015hcrS300eg9vWrCXoWu-_9FydVh-n1JwHJ6MERx0', 12),
('Trailblazer 20oz', 'hydroflask', '20 oz', 'Naranja Fuego', 549.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqGIMtk4qhd5_JQyv3ToiiiOzmdr7gVCTqBFxWsEnN1PZM0G1qf_PChDv-YksK5pL8e9qK9VTdotHFNj4a2Y4RhWmgXrg9kVpqoBceQ71rs0hY4lPjE6v1qywcOM-XBUc434o-paydLR6z-4iwZqaikn3ysiqeo85e4yFNsO_F3WqD9UlL2BV9AJtGB2byxcvJi5k6WBSOGrq5AFhh_MmL2A0yRFr2cbsV4sWjSnv3mFF3IY-RhseAoy7ziqdK_nw7cwXqhMADtvM', 8),
('Yeti Rambler 20 oz', 'yeti', '20 oz', 'Azul Marino', 699.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fdHdhpueYGWSKk3cGulsWZGMjt2-LUtHmNUORuX_eO31d3t4tZsBsQIsULIt5gHe-K_aAmH5wq8jP8xBNKU3T6AukrRos5b4D_ZSjyfm2QZCBitFvt2ma6g_n8Gpo_On1bpDute57G2VLqoBPBd6gmDExAUojOKLkb6L1cJb_RPiU6wHagQmyj8b1uFHipXh2vRRWo2e-BIn39P3Dk2NIt1_R_BG2HTLtr3VSf34dnS0t9WDs1HTSJwsW2Tzc3jGSlw0DACsECA', 25),
('Hydro Flask Wide Mouth 32 oz', 'hydroflask', '32 oz', 'Pacífico', 889.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RhSJtiO9TZNoEtM_5ScvXTttYtynrCzfJ_e0QfIHM3uWCYceO8-qViBEgBUb7ZRTRNIxhkUauUJytrMKNKF6g_yk2Uv3izIDpH6_LqS4Pvb32r5it3P9sFSgsE0PiyjEsz9I05WL109SWqy_cL6nsFZhPXtq5qYiRP7FnRVmUTPVpTdus1exqyTYk7bHY7Om103Cm5hqNlhpThdAXJQfBQwC3c0ybNk2gcjh5IWjFk5u50P5FNC65H57ObXewFVzNmptrCdhjVA', 18),
('Stanley Quencher H2.0 40 oz', 'stanley', '40 oz', 'Crema', 699.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2dT3YeEOr6mVoDRHJfVOICol2zkym_3Z5Q6aql4n5_THtwJHzuLQHD4-ZwtIfu9oIMSMrg-l5s7CIzjwtUmx5iR4rVRY7suyUO4mGLtC0xz3gQN0RwwnXmdXiQFb4jAYTOFMRAbT0I5pje3hq3utvS3CKsEybeSdi5Z_PiNHZmVcM13E2ne9nE5tN_Scu4D5ggHxm4tr4f3or41Z24FrZGqBkx7x7vdfsqTn9N_GfO0SUNJtTBytmxK8VUfqXA0j0H5YLc1c7SY', 30),
('Owala FreeSip 24 oz', 'owala', '24 oz', 'Malvavisco Tímido', 549.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSbsH_DCG0WTQY4u7UIejp4Tk2C6zTzpSnk59JyKUkViPv6BUyU4zVL6wzBZ2hP7SBlLE4mgiHFZe2brkIWY19z21SwKc9ZX4J5JGfQUpCifd9SMdyX3slo5coD-9ld4CUhw1xu6YcAu_qJiIWlQ50qbAF20F5PDhSR9rp031_xWuHuhikafMA4YLXoRnkRyChMFYvS6HmEzowYbkq-_zOEM4MI4kygYKD_FmI70jGegTID0N9dhR8b06ppgxQakT53SplDfpluJ4', 20);

-- Insertar accesorio ID 8 (Tapa Deportiva) para soportar el carrito por defecto
INSERT INTO productos (id, nombre, marca, capacidad, color, precio, imagen_url, stock) 
VALUES (8, 'Tapa Deportiva Aislada', 'hydroflask', '1 oz', 'Negro', 249.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6cbKHvrzWs3pbNhYfgD-pEIegQTJd9bIKuu19wVJyX8tIWfoxj4JNrG7x0l9ropTKYQDonrG_jgms-C18Wp7kFrJ0bePR6M_6nnjmXvpP7Ym9Hh7exnQ-OpLUHS8diSACh96unGd69NBWqnoC1s0fh6F2wW77RZeYQ39nr549V1f5x-3optlSdEISgJQEWyz5XuwdmSRjNXe_zsI5iZlIx3RM4ozHNR5Mxe57GgnSygX_spFoVHpyzChB35Q7wY_Oju1cUO2wHDU', 50)
ON DUPLICATE KEY UPDATE nombre=nombre;
