const fs = require("fs");
const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "angelflores2005",
    multipleStatements: true
});

const sql = fs.readFileSync("./database/sistema.sql").toString();

conexion.query(sql, (error, resultados) => {

    if(error){
        console.log("Error:", error);
    }else{
        console.log("Base de datos creada correctamente");
    }

    conexion.end();

});