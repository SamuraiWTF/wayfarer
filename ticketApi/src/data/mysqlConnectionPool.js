const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'sqldb',
    user: 'ticketapp',
    password: 't1ck3tw1ck3t',
    database: 'tickets'
})

module.exports = pool