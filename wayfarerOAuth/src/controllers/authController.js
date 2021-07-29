const auth = require('../data/auth');
const authUtils = require('../data/authUtils.js');
const { convertToHttp } = require('../data/errorCodes');
const { sendErrorResponse, sendSuccessResponse } = require('./responseUtils')

const authController =  {
    getUser: (req, res) => {
        auth.getAuthCode(req.query.userId).then(data => {
            if (!data) res.status(200).json({ code: 200, data: null })
            else res.status(200).json({ code: 200, data: data.auth_code, expiresAt: data.expires_at })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    addUser: (req, res) => {
        const code = authUtils.generateCode();
        const expiresAt = authUtils.generateExpiration();

        auth.makeAuthCode(req.query.userId, code, expiresAt).then(data => {
            res.status(200).json({ code: 200, data: code })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    updateUser: (req, res) => {
        const code = authUtils.generateCode();
        const expiresAt = authUtils.generateExpiration();
        auth.updateAuthCode(req.query.userId, code, expiresAt).then(data => {
            res.status(200).json({ code: 200, data: code })
        }).catch(err => {
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = authController