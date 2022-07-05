const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const path = require("path");

const app = express();

const authController = require("./controllers/authController.js");
const tokenController = require("./controllers/tokenController.js");

const iam = require("./middleware/iam");

function generateCorsOptions(type, policy) {
    let originPolicy;
    switch (type.toLowerCase()) {
        case "literal":
            originPolicy = [policy];
            break;
        case "regex":
            originPolicy = new RegExp(policy);
            break;
        default:
            throw new Error(
                "Invalid API_CORS_TYPE env variable specified: " + type
            );
    }
    return {
        origin: originPolicy,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
        credentials: true,
    };
}

const appConfig = {
    listenPort: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3002,
    corsPolicy: process.env.API_CORS_POLICY || "http://localhost:3000",
    corsType: process.env.API_CORS_TYPE || "literal",
};

console.log("appConfig ", JSON.stringify(appConfig));

const corsOptions = generateCorsOptions(
    appConfig.corsType,
    appConfig.corsPolicy
);

console.log("corsOptions ", corsOptions);

app.use(cors(corsOptions));
app.use(express.json());

app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
    res.status(200).json({ message: "hello world" });
});

/*
    1. client sends request to authenticate
        http://server/authorization?client_id=foo&redirect_uri=https://foo.com/callback&response_type=code&scope=openid%20profile&state=12345678
*/

app.get("/authorization", (req, res) => {
    // Serve the OAuth login page
    // Which will make a POST to /authorization with username password and other OAuth URI params
    res.status(200)
    res.set('Content-Type', 'text/html')
    res.sendFile(path.join(__dirname, '/oauth.html'))
});

app.post("/authorization", authController.handleOAuthLogin);

app.post("/token", authController.validCode, tokenController.getToken);

// Allow client apps to register themselves to be able to use the Wayfarer OAuth as a auth service
app.post("/connect/register", authController.registerConnection);

app.listen(appConfig.listenPort);

console.log(`listening on ${appConfig.listenPort}`);
