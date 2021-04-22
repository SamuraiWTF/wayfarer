const users = require('../data/users');
const { convertToHttp } = require('../data/errorCodes');

const userController = {
    authenticate: async (req, res) => {
        users.authenticate(req.body.username, req.body.password).then((token) => {
            res.status(200).send({ code: 200, data: { token: token }})
        }).catch((err) => {
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