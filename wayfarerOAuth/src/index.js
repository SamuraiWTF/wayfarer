const express = require('express')
const cors = require('cors')

const app = express()

const authController = require("./controllers/authController.js")
const tokenController = require("./controllers/tokenController.js")

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
    listenPort: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3002,
    corsPolicy: process.env.API_CORS_POLICY || 'http://localhost:3000',
    corsType: process.env.API_CORS_TYPE || 'literal'
}


console.log('appConfig ', JSON.stringify(appConfig))

const corsOptions = generateCorsOptions(appConfig.corsType, appConfig.corsPolicy)

console.log('corsOptions ', corsOptions)

app.use(cors(corsOptions))
app.use(express.json())

app.options('*', cors(corsOptions))

const clientSecret = 'mys3cr3t'

app.get('/', (req, res) => {
    res.status(200).json({ message: 'hello world'})
})

app.get('/authenticate', authController.getUser)

app.get('/authenticate/new', authController.addUser)

app.get('/authenticate/update', authController.updateUser)

app.get('/token', authController.validCode, tokenController.getToken);

app.listen(appConfig.listenPort)

console.log(`listening on ${appConfig.listenPort}`)