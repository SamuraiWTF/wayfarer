const tickets = require('../data/tickets')
const users = require('../data/users')
const teams = require('../data/teams')

const ticketController = {
    getTicketsByUser: (req, res) => {
        let ticketData = tickets.getTicketsByAssignedUser(req.params.userId)
        ticketData = JSON.parse(JSON.stringify(ticketData))
        if(ticketData.length > 0) {
          let user = users.getUserById(req.params.userId)
          let teamResolver = ticketData.reduce((teams, ticket) => { teams[ticket.team] = 0; return teams; }, {})
          Object.keys(teamResolver).forEach(key => {
              // TODO: Parallelize
              teamResolver[key] = teams.getTeamDetails(key)
          })
          ticketData = ticketData.map(ticket => {
              let teamData = teamResolver[ticket.team]
              ticket.team = { id: teamData?.id, name: teamData?.name }
              ticket.assignedTo = { id: user.id, name: user.name }
              return ticket;
          })
        }
        res.status(200).json({ code: 200, data: ticketData })
    }
}

module.exports = ticketController;