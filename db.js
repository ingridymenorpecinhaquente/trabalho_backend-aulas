// npm i mysql2
// MYSQL2
const mysql = require("mysql2/promise")
require("dotenv").config
const pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
})
module.exports = Object.freeze({
    pool: pool
})