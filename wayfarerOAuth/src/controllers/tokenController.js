const token = require('../data/token');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');

const tokenController =  {
    getToken: (req, res) => {
        const params = req.query;
        const expiresAt = authUtils.generateExpiration(1); // expire after one hour
        const authToken = authUtils.generateToken(params.userId, params.clientId, params.isAdmin, expiresAt, params.clientSecret);

        token.addToken(params.isAdmin, expiresAt, params.userId, params.clientId).then(data => {
            res.status(200).json({ code: 200, data: authToken })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = tokenController