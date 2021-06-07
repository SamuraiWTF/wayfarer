const express = require('express')
const cors = require('cors')

const app = express()

const userController = require('./controllers/userController')
const ticketController = require('./controllers/ticketController')
const teamController = require('./controllers/teamController')

const cookieParser = require('cookie-parser')

const iam = require('./middleware/iam')

function generateCorsOptions(type, policy) {
  let originPolicy;
  switch(type.toLowerCase()) {
    case 'literal':
      originPolicy = [policy]
      break
    case 'regex':
      originPolicy = new RegExp(policy)
      break
    default:
      throw new Error('Invalid API_CORS_TYPE env variable specified: ' + type)
  }
  return {
    origin: originPolicy,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
    credentials: true
  }
}

const appConfig = {
  listenPort: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3001,
  corsPolicy: process.env.API_CORS_POLICY || 'http://localhost:3000',
  corsType: process.env.API_CORS_TYPE || 'literal'
}


console.log('appConfig ', JSON.stringify(appConfig))

const corsOptions = generateCorsOptions(appConfig.corsType, appConfig.corsPolicy)

console.log('corsOptions ', corsOptions)

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

app.get('/team/:teamId/absent', iam.validateTokenSig, teamController.getAbsentUsers)

app.get('/team/:teamId', iam.validateTokenSig, teamController.getTeamById)

app.get('/team/:teamId/tickets', iam.validateTokenSig, ticketController.getTicketsByTeam)

app.get('/ticket/:ticketId', iam.validateTokenSig, ticketController.getTicketDetailsById)

app.get('/options/filtering', iam.validateTokenSig, ticketController.getFilteringOptions)

app.post('/ticket/:ticketId/assign', iam.validateTokenSig, ticketController.updateAssignee)

app.patch('/ticket/:ticketId', iam.validateTokenSig, ticketController.partialUpdate)

app.post('/ticket/create', iam.validateTokenSig, ticketController.create)

app.patch('/team/:teamId/update/:userId', iam.validateTokenSig, teamController.changeUserRole)

app.post('/team/:teamId/add/:userId', iam.validateTokenSig, teamController.addUserToTeam)

app.delete('/team/:teamId/delete/:userId', iam.validateTokenSig, teamController.deleteUserFromTeam)

app.listen(appConfig.listenPort)

console.log(`listening on ${appConfig.listenPort}`)