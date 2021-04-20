const express = require('express')
const cors = require('cors')

const app = express()

const userController = require('./controllers/userController')
const ticketController = require('./controllers/ticketController')

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key']
}

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

app.use(cors(corsOptions))


app.options('*', cors(corsOptions))

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

app.get('/user/:id', userController.getUser)

app.get('/user/:userId/tickets', ticketController.getTicketsByUser)

app.listen(3001)

console.log('listening')