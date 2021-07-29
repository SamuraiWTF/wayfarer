const token = require('../data/token');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');

const tokenController =  {
    getToken: (req, res) => {
        const authToken = authUtils.generateToken();
        const expiresAt = authUtils.generateExpiration(1); // expire after one hour

        token.addToken(authToken, expiresAt, req.query.userId).then(data => {
            res.status(200).json({ code: 200, data: authToken })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = tokenController