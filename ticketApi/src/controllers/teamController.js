const teams = require('../data/teams');
const { convertToHttp } = require('../data/errorCodes');
const { sendErrorResponse, sendSuccessResponse } = require('./responseUtils')

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
  },
  changeUserRole: (req, res) => {
    teams.updateTeamMembership(req.params.teamId, req.params.userId, req.body.role).then((changedRowCount) => {
      sendSuccessResponse(res, { changedRows: changedRowCount })
  }).catch((err) => {
      sendErrorResponse(res, err)
  })
  },
  addUserToTeam: (req, res) => {
    teams.addTeamMembership(req.params.teamId, req.params.userId, req.body.role).then((changedRowCount) => {
      sendSuccessResponse(res, { changedRows: changedRowCount })
  }).catch((err) => {
      sendErrorResponse(res, err)
  })
  },
  deleteUserFromTeam: (req, res) => {
    teams.deleteTeamMembership(req.params.teamId, req.params.userId).then((changedRowCount) => {
      sendSuccessResponse(res, { changedRows: changedRowCount })
  }).catch((err) => {
      sendErrorResponse(res, err)
  })
  },
  getAbsentUsers: (req, res) => {
    teams.getAbsentUsersByTeam(req.params.teamId).then((userTeams) => {
      res.status(200).json({ code: 200, data: userTeams || [] })
    }).catch((err) => {
      let { status, message } = convertToHttp(err)
      res.status(status).json({ code: status, error: message })
    })
  }
}

module.exports = teamController;