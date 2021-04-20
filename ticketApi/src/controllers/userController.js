const users = require('../data/users');

const userController = {
    authenticate: (req, res) => {
        let authToken = users.authenticate(req.body.username, req.body.password)
        if(authToken) {
            res.status(200).send({ code: 200, data: { token: 'notimplemented', refresh: 'notimplemented '}})
        } else {
            res.status(401).send({ code: 401, error: 'Invalid credentials' })
        }
    },
    getUser: (req, res) => {
        let user = users.getUserById(req.params.id)
        if(user) {
            res.status(200).send({ code: 200, data: user })
        } else {
            res.status(404).send({ code: 404, error: 'User not found'})
        }
    }
}

module.exports = userController;