const tickets = require('../data/tickets')
const { sendErrorResponse, sendSuccessResponse } = require('./responseUtils')

const ticketController = {
    getTicketsByUser: (req, res) => {
        tickets.getTicketsByAssignedUser(req.params.userId).then((tickets) => {
            sendSuccessResponse(res, tickets)
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    },
    getTicketsByTeam: (req, res) => {
        tickets.getTicketsByTeam(req.params.teamId).then((tickets) => {
            sendSuccessResponse(res, tickets)
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    },
    getTicketDetailsById: (req, res) => {
        tickets.getTicketDetailsById(req.params.ticketId).then((ticket) => {
            sendSuccessResponse(res, ticket)
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    },
    updateAssignee: (req, res) => {
        tickets.updateTicketAssignee(req.params.ticketId, req.body.assigneeId).then((changedRowCount) => {
            sendSuccessResponse(res, { changedRows: changedRowCount })
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    }
}

module.exports = ticketController;