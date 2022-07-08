const auth = require("../data/auth");
const authUtils = require("../data/authUtils.js");
const { convertToHttp } = require("../data/errorCodes");
const connectionPool = require("../data/mysqlConnectionPool");

const axios = require("axios");
const http = require("http");

const authController = {
    registerOAuthConnection: (req, res, next) => {
        /*
        Vulnerable endpoint to register an auth provider. Is vulnerable to SSRF.
        
        POST /connect/register HTTP/1.1
        Content-Type: application/json
        Host: server.example.com
        Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJ ...

        {
          "application_type": "web",
          "redirect_uris": ["https://client.example.org/callback"],
          "client_name": "My Example",
          "logo_uri": "https://client.example.org/logo.png",
          "subject_type": "pairwise",
          "sector_identifier_uri": "https://example.org/rdrct_uris.json",
          "token_endpoint_auth_method": "client_secret_basic",
          "jwks_uri": "https://client.example.org/public_keys.jwks",
          "contacts": ["ve7jtb@example.org"],
          "request_uris": ["https://client.example.org/rf.txt"]
        }
        */
        // Shove the request body into the DB table
        connectionPool.query(
            `INSERT INTO clients(id, connection_info) VALUES (\'${req.body.client_name}\',?)`,
            JSON.stringify(req.body),
            (error, results, fields) => {
                if (error) {
                    res.status(500);
                    res.send(error);
                } else {
                    res.status(201);
                    res.send({"status": 201, "message": "OAuth client connection created"});
                }
            }
        );
    },
    getOAuthClientLogo: (req, res) => {
        connectionPool.query(
            `SELECT connection_info FROM clients WHERE id = \'${req.params.id}\'`,
            (error, results, fields) => {
                if (error) {
                    res.status(500);
                    return res.send(error);
                } else {
                    console.log(results);
                    if (results.length === 0) {
                        res.status(404);
                        return res.send();
                    }
                    let client_connection = JSON.parse(
                        results[0].connection_info
                    );
                    console.log(client_connection);
                    // SSRF vuln fetch the image without any checks on the domain or contents
                    return axios
                        .get(client_connection.logo_uri)
                        .then((response) => {
                            res.status(response.status);
                            res.set(response.headers);
                            res.send(response.data);
                        })
                        .catch((err) => {
                            res.status(500);
                            res.send("An error occured");
                        });
                }
            }
        );
    },
    handleOAuthLogin: (req, res) => {
        const body = req.body;
        const query = req.query;
        console.log(body, query);

        /*
            Warning this is a very janky function...
        */

        // We don't do anything with these yet
        const response_type = query.response_type || "code";
        const scope = query.scope || "openid";

        // Make a request to the wayfarer api to login and get a jwt
        let auth_res_data = "";
        // post reqest to the ticketapi
        const req_opts = {
            hostname: "wayfarer_ticketapi",
            port: 3001,
            path: "/authenticate",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };

        let http_req = http.request(req_opts, (http_res) => {
            http_res.setEncoding("utf-8");
            http_res.on("data", (chunk) => {
                auth_res_data += chunk;
            });
            http_res.on("end", () => {
                // if we got a JWT back from the wayfarer api
                // then continue the next part of the OAuth flow
                let auth_res = JSON.parse(auth_res_data);
                console.log(auth_res);
                // if we got a token back assume authed then redirect to
                // {redirect_uri}/callback?code=<auth_code>&state=<state>
                if (auth_res.data.token) {
                    if (response_type === "token") {
                        res.redirect(
                            `${query.redirect_uri}#access_token=${auth_res.data.token}&token_type=Bearer&state=${query.state}`
                        );
                    } else {
                        const code = authUtils.generateCode();
                        // store the code
                        auth.makeAuthCode(
                            auth_res.data.userId,
                            query.client_id,
                            code,
                            Date.now() + 24 * 60 * 60 * 1000
                        )
                            .then((data) => {
                                if (data) {
                                    res.redirect(
                                        `${query.redirect_uri}?code=${code}&state=${query.state}`
                                    );
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                                res.send(err);
                            });
                    }
                } else {
                    console.log("Failure to login.");
                }
            });
        });
        http_req.on("error", (e) => {
            console.error(e.message);
            res.send(e.message);
        });
        http_req.write(JSON.stringify(req.body));
        http_req.end();
    },
    getUser: (req, res) => {
        const params = req.query;
        auth.getAuthCode(params.userId, params.clientId)
            .then((data) => {
                if (!data) res.status(200).json({ code: 200, data: null });
                else
                    res.status(200).json({
                        code: 200,
                        data: data.auth_code,
                        expiresAt: data.expires_at,
                    });
            })
            .catch((err) => {
                let { status, message } = convertToHttp(err);
                res.status(status).json({ code: status, error: message });
            });
    },
    addUser: (req, res) => {
        const params = req.query;
        const code = authUtils.generateCode();
        const expiresAt = authUtils.generateExpiration(24 * 30); // expire after 30 days

        auth.makeAuthCode(params.userId, params.clientId, code, expiresAt)
            .then((data) => {
                res.status(200).json({ code: 200, data: code });
            })
            .catch((err) => {
                let { status, message } = convertToHttp(err);
                res.status(status).json({ code: status, error: message });
            });
    },
    validCode: (req, res, next) => {
        const params = req.body;
        const grantType = params.grant_type; // this is also not used *yet*
        auth.validateCode(
            params.user_id,
            params.code,
            params.client_id,
            params.client_secret
        )
            .then((data) => {
                if (data) return next();
                res.status(401).json({
                    status: 401,
                    error: "Authorization code validation failed.",
                    reauth: true,
                });
            })
            .catch((err) => {
                console.error(err);
                let { status, message } = convertToHttp(err);
                res.status(status).json({ code: status, error: message });
            });
    },
};

module.exports = authController;
