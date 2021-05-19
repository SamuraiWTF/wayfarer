const teams = require('../data/teams');
const { convertToHttp } = require('../data/errorCodes');

const teamController = {
  getTeamById: (req, res) => {
    teams.getTeamDetails(req.params.teamId, req.claims.userId).then((team) => {
      console.log('team role ', typeof team.role)
      res.status(200).json({ code: 200, data: team })
    }).catch((err) => {
      let { status, message } = convertToHttp(err)
      res.status(status).json({ code: status, error: message })
    })
  },
  getTeamsByUser: (req, res) => {
    teams.getTeamsByUser(req.params.userId).then((userTeams) => {
      res.status(200).json({ code: 200, data: userTeams || [] })
    }).catch((err) => {
      let { status, message } = convertToHttp(err)
      res.status(status).json({ code: status, error: message })
    })
  }
}

module.exports = teamController;