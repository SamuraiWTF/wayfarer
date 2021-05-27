const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes');

const teams = {
    getTeamDetails: (teamId, requestorUserId) => {
        return new Promise((resolve, reject) => {
                Promise.all([
                    new Promise((resolve, reject) => {
                        // query the team itself
                        connectionPool.query(`SELECT t.id, t.name, 
                                count(tixo.id) as 'stats_open', 
                                count(tixc.id) as 'stats_closed',
                                count(tixod.id) as 'stats_overdue',
                                count(tixu.id) as 'stats_unassigned',
                                m.role
                            FROM teams t 
                            LEFT OUTER JOIN tickets tixo ON t.id = tixo.team_id AND tixo.status = 'open'
                            LEFT OUTER JOIN tickets tixc ON t.id = tixc.team_id AND tixc.status = 'closed'
                            LEFT OUTER JOIN tickets tixod ON t.id = tixod.team_id AND CURDATE() > tixod.due_date
                            LEFT OUTER JOIN tickets tixu ON t.id = tixu.team_id AND (tixu.assigned_to IS NULL) 
                            LEFT OUTER JOIN team_memberships m ON t.id = m.team_id AND m.user_id = ? 
                            WHERE t.id = ? 
                            GROUP BY t.id`, [requestorUserId, teamId], (error, results, fields) => {
                            if(error) {
                                console.log('error - ', error)
                                reject({ type: errorCodes.DBERR, details: error })
                            } else {
                                if(results.length == 0 ) {
                                    reject({ type: errorCodes.NOREC, details: 'No team found.' })
                                } else {
                                    let details = results[0]
                                    resolve({
                                        id: details.id,
                                        name: details.name,
                                        role: details.role,
                                        stats: {
                                            open: details.stats_open,
                                            closed: details.stats_closed,
                                            unassigned: details.stats_unassigned,
                                            overdue: details.stats_overdue
                                        }
                                    })
                                }
                            }
                        })
                    }),
                    new Promise((resolve, reject) => {
                        // query the members
                        connectionPool.query(`SELECT u.id as user_id, 
                                u.name, m.role, COUNT(tix.id) AS 'open_tickets' 
                            FROM team_memberships m 
                            RIGHT JOIN users u ON m.user_id = u.id 
                            LEFT OUTER JOIN tickets tix ON tix.assigned_to = u.id AND tix.status = 'open'
                            WHERE m.team_id = ? GROUP BY u.id ORDER BY m.role ASC`, [teamId], (error, results, fields) => {
                            if(error) {
                                reject({ type: errorCodes.DBERR, details: error })
                            } else {
                                resolve(results)
                            }
                        })
                    })
                ]).then(([team, members]) => {
                    // construct the object
                    team.members = members
                    resolve(team)
                }).catch((error) => {
                    // something failed, bubble the error.
                    console.log('error - ', error)
                    reject(error)
                })
        })
    },
    getTeamsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT t.id, t.name, m.role, 
            COUNT(tio.id) as open_tickets, 
            COUNT(tic.id) as closed_tickets,
            COUNT(tiu.id) as user_tickets 
            FROM team_memberships m 
            RIGHT JOIN teams t ON m.team_id = t.id 
            LEFT JOIN tickets tio ON (tio.team_id = t.id AND tio.status = \'open\') 
            LEFT JOIN tickets tic ON (tic.team_id = t.id AND tic.status = \'closed\') 
            LEFT JOIN tickets tiu ON (tiu.team_id = t.id AND tiu.assigned_to = ? AND tiu.status = \'open\')
            WHERE m.user_id = ? GROUP BY t.id`, [userId, userId], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results)
            })
        })
    },
    createTeam: (team) => {
      // TODO: validation - must have name and owner member
      /*team.id = getNextId();
      mockData.push(team);
      return team;*/
    },
    updateTeam: (team) => {
      /*let index = mockData.findIndex(teamRec => teamRec.id === team.id)
      if(index === -1) {
          return undefined;
      } else {
          // TODO: validation - must have name and owner member
          mockData[index] = team;
          return team;
      }*/
    },
      deleteTeam: (teamId) => {
        /*let index = mockData.findIndex(teamRec => teamRec.id === teamId)
        if(index === -1) {
            return false;
        } else {
            mockData.splice(index, 1)
            return true;
        }*/
    }
}

module.exports = teams;
