const mysql = require('mysql')
const pool = mysql.createPool({
    host: process.env.DB_HOST ? process.env.DB_HOST : 'sqloauthdb',
    port: 3307,
    user: 'ticketapp',
    password: 't1ck3t0auth',
    database: 'oauth'
})

module.exports = pool