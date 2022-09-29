const token = require('../data/token');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');

const tokenController =  {
    getToken: (req, res) => {
        const params = req.body
        const isAdmin = params.is_admin || false // bug here in which an attacker could possibly elevate to admin
        const expiresAt = authUtils.generateExpiration(1); // expire after one hour
        const authToken = authUtils.generateToken(params.userId, params.username, params.clientId, isAdmin, expiresAt);

        token.addToken(isAdmin, expiresAt, params.user_id, params.client_id).then(data => {
            res.status(200).json({ code: 200, data: authToken })
        }).catch(err => {
            console.error(err)
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = tokenController