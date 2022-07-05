const auth = require('../data/auth');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');

const http = require('http')

const authController =  {
    handleOAuthLogin: (req, res) => {
        const body = req.body
        const query = req.query
        console.log(body, query)

        /*
            Warning this is a very janky function...
        */

        // We don't do anything with these yet
        const response_type = query.response_type || 'code' 
        const scope = query.scope || 'openid'

        // Make a request to the wayfarer api to login and get a jwt
        let auth_res_data = ''
        // post reqest to the ticketapi
        const req_opts = {
            hostname: 'wayfarer_ticketapi',
            port: 3001,
            path: '/authenticate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let http_req = http.request(req_opts, (http_res) => {
            http_res.setEncoding('utf-8')
            http_res.on('data', (chunk) => {
                auth_res_data += chunk
            })
            http_res.on('end', () => {
                // if we got a JWT back from the wayfarer api 
                // then continue the next part of the OAuth flow
                let auth_res = JSON.parse(auth_res_data)
                console.log(auth_res)
                // if we got a token back assume authed then redirect to 
                // {redirect_uri}/callback?code=<auth_code>&state=<state>
                if (auth_res.data.token) {
                    if (response_type === 'token') {
                        res.redirect(`${query.redirect_uri}#access_token=${auth_res.data.token}&token_type=Bearer&state=${query.state}`)
                    } else {
                        const code = authUtils.generateCode()
                        // store the code
                        auth.makeAuthCode(auth_res.data.userId, query.client_id, code, Date.now()+(24*60*60*1000))
                        .then((data) => {
                            if (data) {
                                res.redirect(`${query.redirect_uri}?code=${code}&state=${query.state}`)
                            }
                        }).catch(err => {
                            console.error(err)
                            res.send(err)
                        })
                    }
                } else {
                    console.log("Failure to login.")
                }
            })
        })
        http_req.on('error', (e) => {
            console.error(e.message)
            res.send(e.message)
        })
        http_req.write(JSON.stringify(req.body))
        http_req.end()
    },
    getUser: (req, res) => {
        const params = req.query;
        auth.getAuthCode(params.userId, params.clientId).then(data => {
            if (!data) res.status(200).json({ code: 200, data: null })
            else res.status(200).json({ code: 200, data: data.auth_code, expiresAt: data.expires_at })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    addUser: (req, res) => {
        const params = req.query;
        const code = authUtils.generateCode();
        const expiresAt = authUtils.generateExpiration(24 * 30); // expire after 30 days

        auth.makeAuthCode(params.userId, params.clientId, code, expiresAt).then(data => {
            res.status(200).json({ code: 200, data: code })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    validCode: (req, res, next) => {
        const params = req.body;
        const grantType = params.grant_type // this is also not used *yet*
        auth.validateCode(params.user_id, params.code, params.client_id, params.client_secret).then(data => {
            if (data) return next();
            res.status(401).json({ status: 401, error: 'Authorization code validation failed.', reauth: true })
        }).catch(err => {
            console.error(err)
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message})
        })
    },
    registerConnection: (req, res, next) => {
        /*
        Vulnerable endpoint to register an auth provider
            1. Shouldn't be exposed / implemented
            2. Is vulnerable to SSRF
        */
        res.status(501).send()
    }
}

module.exports = authController