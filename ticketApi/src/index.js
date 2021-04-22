const express = require('express')
const cors = require('cors')

const app = express()

const userController = require('./controllers/userController')
const ticketController = require('./controllers/ticketController');
const teamController = require('./controllers/teamController');

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key']
}

app.use(cors(corsOptions))
app.use(express.json())

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

app.post('/authenticate', userController.authenticate)

app.get('/user/:id', userController.getUser)

app.get('/user/:userId/tickets', ticketController.getTicketsByUser)

app.get('/user/:userId/teams', teamController.getTeamsByUser)

app.get('/team/:teamId', teamController.getTeamById)

app.listen(3001)

console.log('listening')