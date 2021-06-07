const users = require('../data/users');
const { convertToHttp, errorCodes } = require('../data/errorCodes');

const userController = {
    authenticate: async (req, res) => {
        let invalidAttempts = req.signedCookies.loginAttempts || 0
        if(invalidAttempts >= 5) {
            res.cookie('loginAttempts', invalidAttempts, { signed: true, httpOnly: true, maxAge: (60000 * 20 ) })
            return res.status(401).send({ code: 401, error: 'Too many login attempts. Account locked.'})
        }
        users.authenticate(req.body.username, req.body.password, req.body.stayLoggedIn).then(([data, refreshCookie]) => {
            if(req.body.stayLoggedIn) {
                res.cookie('refreshToken', refreshCookie, { signed: true, httpOnly: true, secure: true, sameSite: 'none', maxAge: (60000 * 60 * 24 * 30) })
            } 
            res.status(200).send({ code: 200, data: data})
        }).catch((err) => {
            if(err.type === errorCodes.BADPASS) {
                invalidAttempts++
                console.log('invalid attempts ', invalidAttempts)
                res.cookie('loginAttempts', invalidAttempts, { signed: true, httpOnly: true, maxAge: (60000 * 20 ) })
            }
            let { status, message } = convertToHttp(err)
            res.status(status).send({ code: status, error: message })
        })
    },
    getUser: (req, res) => {
        users.getUserById(req.params.id).then((user) => {
            res.status(200).send({ code: 200, data: user })
        }).catch((err) => {
            let { status, message } = convertToHttp(err)
            res.status(status).send({ code: status, error: message })
        })
    }
}

module.exports = userController;