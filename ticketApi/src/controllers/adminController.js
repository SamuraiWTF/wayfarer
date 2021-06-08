const admin = require('../data/admin')

const adminController =  {
    getUsers: (req, res) => { 
        admin.getUsers().then(data => {
            res.status(200).send({ data: data })
        }).catch(error => {
            res.status(500).send({ error: error })
        })
    },
    addUser: (req, res) => {
        admin.addUser(req.body).then(data => {
            console.log(data)
            res.status(200).send({ message: 'created' })
        }).catch(error => {
            res.status(500).send({ error: error })
        })
    }
}

module.exports = adminController