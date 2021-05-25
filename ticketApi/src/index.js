const express = require('express')
const cors = require('cors')

const app = express()

const userController = require('./controllers/userController')
const ticketController = require('./controllers/ticketController')
const teamController = require('./controllers/teamController')

const cookieParser = require('cookie-parser')

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
  res.status(200).json({ message: 'hello world'})
})

app.post('/authenticate', cookieParser('Use a strong secret'), userController.authenticate)

app.get('/user/:id', iam.validateTokenSig, userController.getUser)

app.get('/user/:userId/tickets', ticketController.getTicketsByUser)

app.get('/user/:userId/teams', iam.validateTokenSig, teamController.getTeamsByUser)

app.get('/team/:teamId', iam.validateTokenSig, teamController.getTeamById)

app.get('/team/:teamId/tickets', iam.validateTokenSig, ticketController.getTicketsByTeam)

app.get('/ticket/:ticketId', iam.validateTokenSig, ticketController.getTicketDetailsById)

app.get('/options/filtering', iam.validateTokenSig, ticketController.getFilteringOptions)

app.post('/ticket/:ticketId/assign', iam.validateTokenSig, ticketController.updateAssignee)

app.patch('/ticket/:ticketId', iam.validateTokenSig, ticketController.partialUpdate)

app.post('/ticket/create', iam.validateTokenSig, ticketController.create)

app.listen(3001)

console.log('listening')