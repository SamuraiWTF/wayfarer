const teams = require('../data/teams');

const teamController = {
  getTeamById: (req, res) => {
    let team = teams.getTeamById(req.params.teamId);
    if(team) {
        req.status(200).json({ code: 200, data: team })
    } else {
        res.status(404).json({ code: 404, error: 'Team not found.' })
    }
  },
  getTeamsByUser: (req, res) => {
    let userTeams = teams.getTeamsByUser(req.params.userId)
    req.status(200).json({ code: 200, data: userTeams || [] })
  }
}

module.exports = teamController;