const mysql = require('mysql')
const pool = mysql.createPool({
    host: process.env.DB_HOST ? process.env.DB_HOST : 'sqldb',
    user: 'ticketapp',
    password: 't1ck3tw1ck3t',
    database: 'tickets'
})

module.exports = pool