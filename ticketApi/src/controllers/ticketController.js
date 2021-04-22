const tickets = require('../data/tickets')
const users = require('../data/users')
const teams = require('../data/teams')
const { convertToHttp } = require('../data/errorCodes')

const ticketController = {
    getTicketsByUser: (req, res) => {
        tickets.getTicketsByAssignedUser(req.params.userId).then((tickets) => {
            res.status(200).json({ code: 200, data: tickets })
        }).catch((err) => {
            console.log('error ', err)
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    },
    getTicketsByTeam: (req, res) => {
        tickets.getTicketsByTeam(req.params.teamId).then((tickets) => {
            res.status(200).json({ code: 200, data: tickets })
        }).catch((err) => {
            console.log('error ', err)
            let { status, message } = convertToHttp(err)
            res.status(status).json({ code: status, error: message })
        })
    }
}

module.exports = ticketController;