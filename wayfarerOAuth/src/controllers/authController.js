const auth = require('../data/auth');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');

const authController =  {
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
    updateUser: (req, res) => {
        const params = req.query;
        const code = authUtils.generateCode();
        const expiresAt = authUtils.generateExpiration(24 * 30); // expire after 30 days

        auth.updateAuthCode(params.userId, params.clientId, code, expiresAt).then(data => {
            res.status(200).json({ code: 200, data: code })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    validCode: (req, res, next) => {
        const params = req.query;
        auth.validateCode(params.userId, params.code, params.clientId, params.clientSecret).then(data => {
            if (data) return next();
            res.status(401).json({ status: 401, error: 'Authorization code validation failed.', reauth: true })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = authController