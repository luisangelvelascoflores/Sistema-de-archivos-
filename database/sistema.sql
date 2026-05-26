CREATE DATABASE IF NOT EXISTS sistema;

USE sistema;

CREATE TABLE IF NOT EXISTS roles(

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre_rol VARCHAR(100),

    cantidad_usuarios INT

);

CREATE TABLE IF NOT EXISTS usuarios(

    id INT AUTO_INCREMENT PRIMARY KEY,

    correo VARCHAR(100),

    password VARCHAR(100),

    rol_id INT,

    FOREIGN KEY (rol_id) REFERENCES roles(id)

);

CREATE TABLE IF NOT EXISTS estados(

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre_estado VARCHAR(100)

);

CREATE TABLE IF NOT EXISTS documentos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT,

    nombre_archivo VARCHAR(255),

    ruta_archivo VARCHAR(500),

    estado_id INT,

    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),

    FOREIGN KEY (estado_id) REFERENCES estados(id)

);

CREATE TABLE IF NOT EXISTS revisiones (

    id INT AUTO_INCREMENT PRIMARY KEY,

    documento_id INT,

    revisor_id INT,

    comentario TEXT,

    accion ENUM('VALIDADO', 'RECHAZADO'),

    fecha_revision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (documento_id) REFERENCES documentos(id),

    FOREIGN KEY (revisor_id) REFERENCES usuarios(id)

);

INSERT INTO roles(nombre_rol, cantidad_usuarios)
SELECT * FROM (

    SELECT 'CI', 10
    UNION ALL
    SELECT 'ACA', 2
    UNION ALL
    SELECT 'D', 10
    UNION ALL
    SELECT 'DG', 1
    UNION ALL
    SELECT 'AG', 1

) AS nuevos_roles

WHERE NOT EXISTS (
    SELECT nombre_rol FROM roles WHERE nombre_rol = 'CI'
);

INSERT INTO estados(nombre_estado)
SELECT * FROM (

    SELECT 'Pendiente'
    UNION ALL
    SELECT 'Aprobado'
    UNION ALL
    SELECT 'Rechazado'

) AS nuevos_estados

WHERE NOT EXISTS (
    SELECT nombre_estado FROM estados WHERE nombre_estado = 'Pendiente'
);

INSERT INTO usuarios(correo, password, rol_id)
VALUES

('director@gmail.com', '1234', 4),

('academico1@gmail.com', '1234', 2),
('academico2@gmail.com', '1234', 2),

('admingeneral@gmail.com', '1234', 5),

('ci1@gmail.com', '1234', 1),
('ci2@gmail.com', '1234', 1),
('ci3@gmail.com', '1234', 1),
('ci4@gmail.com', '1234', 1),
('ci5@gmail.com', '1234', 1),
('ci6@gmail.com', '1234', 1),
('ci7@gmail.com', '1234', 1),
('ci8@gmail.com', '1234', 1),
('ci9@gmail.com', '1234', 1),
('ci10@gmail.com', '1234', 1),

('direccion1@gmail.com', '1234', 3),
('direccion2@gmail.com', '1234', 3),
('direccion3@gmail.com', '1234', 3),
('direccion4@gmail.com', '1234', 3),
('direccion5@gmail.com', '1234', 3),
('direccion6@gmail.com', '1234', 3),
('direccion7@gmail.com', '1234', 3),
('direccion8@gmail.com', '1234', 3),
('direccion9@gmail.com', '1234', 3),
('direccion10@gmail.com', '1234', 3);