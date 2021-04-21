const users = require('../data/users');

const userController = {
    authenticate: async (req, res) => {
        users.authenticate(req.body.username, req.body.password).then((token) => {
            res.status(200).send({ code: 200, data: { token: token, refresh: 'notimplemented '}})
        }).catch((err) => {
            res.status(401).send({ code: 401, error: 'Invalid credentials' })
        })
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