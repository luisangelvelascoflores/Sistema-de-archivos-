const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const fs = require("fs");

const app = express();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads");

    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage });

app.use(express.json());

app.use(express.static("public"));

app.use("/uploads", express.static("uploads"));

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

    const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";

    conexion.query(sql, [correo, password], (err, resultado) => {

        if(err){

            return res.json({
                mensaje: "Error servidor"
            });

        }

        if(resultado.length > 0){

            res.json({
                mensaje: "Login correcto"
            });

        }else{

            res.json({
                mensaje: "Correo o contraseña incorrectos"
            });

        }

    });

});

app.post("/subir", upload.single("archivo"), (req, res) => {

    if(!req.file){

        return res.json({
            mensaje: "No se subió ningún archivo"
        });

    }

    const sql = `

    INSERT INTO documentos(
        usuario_id,
        nombre_archivo,
        ruta_archivo,
        estado_id
    )

    VALUES (?, ?, ?, ?)

    `;

    conexion.query(

        sql,

        [
            1,
            req.file.filename,
            req.file.path,
            1
        ],

        (err, resultado) => {

            if(err){

                console.log(err);

                return res.json({
                    mensaje: "Error al guardar documento"
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

            console.log(err);

            return res.json({
                mensaje: "Error al obtener documentos"
            });

        }

        res.json(resultado);

    });

});

app.delete("/eliminar/:id", (req, res) => {

    const id = req.params.id;

    const sqlBuscar = "SELECT * FROM documentos WHERE id = ?";

    conexion.query(sqlBuscar, [id], (err, resultado) => {

        if(err){

            return res.json({
                mensaje: "Error al buscar archivo"
            });

        }

        if(resultado.length === 0){

            return res.json({
                mensaje: "Archivo no encontrado"
            });

        }

        const archivo = resultado[0];

        fs.unlink(archivo.ruta_archivo, (err) => {

            if(err){

                console.log(err);

            }

            const sqlEliminar = "DELETE FROM documentos WHERE id = ?";

            conexion.query(sqlEliminar, [id], (err) => {

                if(err){

                    return res.json({
                        mensaje: "Error al eliminar"
                    });

                }

                res.json({
                    mensaje: "Archivo eliminado"
                });

            });

        });

    });

});

app.listen(3000, () => {

    console.log("Servidor funcionando en puerto 3000");

});