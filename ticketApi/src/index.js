const express = require('express')
const cors = require('cors')

const app = express()

const userController = require('./controllers/userController')
const ticketController = require('./controllers/ticketController')
const teamController = require('./controllers/teamController')

const iam = require('./middleware/iam')

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

app.get('/user/:id', iam.validateTokenSig, userController.getUser)

app.get('/user/:userId/tickets', ticketController.getTicketsByUser)

app.get('/user/:userId/teams', iam.validateTokenSig, teamController.getTeamsByUser)

app.get('/team/:teamId', iam.validateTokenSig, teamController.getTeamById)

app.get('/team/:teamId/tickets', ticketController.getTicketsByTeam)

app.get('/ticket/:ticketId', iam.validateTokenSig, ticketController.getTicketDetailsById)

app.post('/ticket/:ticketId/assign', iam.validateTokenSig, ticketController.updateAssignee)

app.listen(3001)

console.log('listening')