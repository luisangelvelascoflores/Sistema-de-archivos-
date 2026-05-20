const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

app.use(express.static("public"));

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

app.listen(3000, () => {
    console.log("Servidor funcionando");
});