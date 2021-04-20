const express = require('express')
const app = express()

/*
const mysql = require('mysql')
let connection = mysql.createConnection({
    host: 'sqldb',
    user: 'ticketapp',
    password: 't1ck3tw1cket'
})

let dbStatus = 'No Data'

connection.connect(function(err) {
    if(err) {
        dbStatus = err
        return;
    }
    dbStatus = 'connected as id ' + connection.threadId
})
*/

app.get('/', (req, res) => {
    // This is probably leaking. 
    /*connection.connect(function(err) {
        if(err) {
            dbStatus = err
            return;
        }
        dbStatus = 'connected as id ' + connection.threadId
    })*/
  res.status(200).json({ message: 'hello world'})
})

app.listen(3000)