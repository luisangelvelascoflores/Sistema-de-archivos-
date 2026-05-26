const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads");

    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage });

const conexion = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "angelflores2005",
    database: "sistema"

});

conexion.connect((err) => {

    if(err){

        console.log("Error conexión");

    }else{

        console.log("Conectado a MySQL");

    }

});

app.post("/login", (req, res) => {

    const correo = req.body.correo;

    const password = req.body.password;

    const sql = `

    SELECT 
        usuarios.id,
        usuarios.correo,
        roles.nombre_rol

    FROM usuarios

    INNER JOIN roles
    ON usuarios.rol_id = roles.id

    WHERE correo = ? AND password = ?

    `;

    conexion.query(sql, [correo, password], (err, resultado) => {

        if(err){

            return res.json({
                mensaje: "Error servidor"
            });

        }

        if(resultado.length > 0){

            res.json({

                mensaje: "Login correcto",

                usuario: resultado[0]

            });

        }else{

            res.json({
                mensaje: "Correo o contraseña incorrectos"
            });

        }

    });

});

app.post("/subir", upload.single("archivo"), (req, res) => {

    const nombreArchivo = req.file.filename;

    const rutaArchivo = req.file.path;

    const sql = `

    INSERT INTO documentos(

        nombre_archivo,
        ruta_archivo,
        estado_id

    )

    VALUES (?, ?, ?)

    `;

    conexion.query(

        sql,

        [
            nombreArchivo,
            rutaArchivo,
            1
        ],

        (err) => {

            if(err){

                return res.json({
                    mensaje: "Error al subir archivo"
                });

            }

            res.json({
                mensaje: "Archivo subido correctamente"
            });

        }

    );

});

app.get("/documentos", (req, res) => {

    const sql = `

    SELECT 
        documentos.id,
        documentos.nombre_archivo,
        documentos.fecha_subida,
        estados.nombre_estado

    FROM documentos

    INNER JOIN estados
    ON documentos.estado_id = estados.id

    `;

    conexion.query(sql, (err, resultado) => {

        if(err){

            return res.json([]);

        }

        res.json(resultado);

    });

});

app.put("/aprobar/:id", (req, res) => {

    const id = req.params.id;

    const sql = `

    UPDATE documentos

    SET estado_id = 2

    WHERE id = ?

    `;

    conexion.query(sql, [id], (err) => {

        if(err){

            return res.json({
                mensaje: "Error al aprobar"
            });

        }

        res.json({
            mensaje: "Documento aprobado"
        });

    });

});

app.put("/rechazar/:id", (req, res) => {

    const id = req.params.id;

    const sql = `

    UPDATE documentos

    SET estado_id = 3

    WHERE id = ?

    `;

    conexion.query(sql, [id], (err) => {

        if(err){

            return res.json({
                mensaje: "Error al rechazar"
            });

        }

        res.json({
            mensaje: "Documento rechazado"
        });

    });

});

app.delete("/eliminar/:id", (req, res) => {

    const id = req.params.id;

    const sqlBuscar = `

    SELECT * FROM documentos

    WHERE id = ?

    `;

    conexion.query(sqlBuscar, [id], (err, resultado) => {

        if(err){

            return res.json({
                mensaje: "Error"
            });

        }

        const archivo = resultado[0];

        fs.unlink(archivo.ruta_archivo, (err) => {

            if(err){

                console.log(err);

            }

        });

        const sqlEliminar = `

        DELETE FROM documentos

        WHERE id = ?

        `;

        conexion.query(sqlEliminar, [id], (err) => {

            if(err){

                return res.json({
                    mensaje: "Error eliminando"
                });

            }

            res.json({
                mensaje: "Archivo eliminado"
            });

        });

    });

});

app.listen(3000, () => {

    console.log("Servidor funcionando");

});