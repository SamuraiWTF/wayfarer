const tickets = require('../data/tickets')
const { sendErrorResponse, sendSuccessResponse } = require('./responseUtils')

const ticketController = {
    getTicketsByUser: (req, res) => {
        tickets.getTicketsByAssignedUser(req.params.userId, req.query.user, req.query.team, req.query.status, req.query.due).then((tickets) => {
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
    },
    partialUpdate: (req, res) => {
        tickets.partialUpdateTicket(req.params.ticketId, req.body).then((changedRowCount) => {
            sendSuccessResponse(res, { changedRows: changedRowCount })
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    },
    getFilteringOptions: (req, res) => {
        tickets.getFilterOptions(req.claims.userId).then((options) => {
            sendSuccessResponse(res, options)
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    },
    create: (req, res) => {
        tickets.createTicket(req.body).then((changedRowCount) => {
            sendSuccessResponse(res, { changedRows: changedRowCount })
        }).catch((err) => {
            sendErrorResponse(res, err)
        })
    }
}

module.exports = ticketController;