const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes');
const { response } = require('express');

let mockData = [
    { id: 1, name: 'helpdesk', members: [
        { userId: 1, role: 'owner' },
        { userId: 3, role: 'member' },
        { userId: 4, role: 'manager' }
    ]},
    {
       id: 2, name: 'customer support', members: [
           { userId: 2, role: 'owner' },
           { userId: 3, role: 'member' }
       ]
    }
]

const getNextId = (() => { 
    let seedId = mockData.length;
    return () => {
        seedId += 1;
        return seedId;
    }
})();

const teams = {
    getTeamDetails: (teamId) => {
        return new Promise((resolve, reject) => {
                Promise.all([
                    new Promise((resolve, reject) => {
                        // query the team itself
                        connectionPool.query('SELECT t.* FROM teams t WHERE t.id = ?', [teamId], (error, results, fields) => {
                            if(error) {
                                reject({ type: errorCodes.DBERR, details: error })
                            } else {
                                if(results.length == 0 ) {
                                    reject({ type: errorCodes.NOREC, details: 'No team found.' })
                                } else {
                                    resolve(results)
                                }
                            }
                        })
                    }),
                    new Promise((resolve, reject) => {
                        // query the members
                        connectionPool.query('SELECT u.id as user_id, u.name, m.role FROM team_memberships m RIGHT JOIN users u ON m.user_id = u.id WHERE m.team_id = ? ORDER BY m.role ASC', [teamId], (error, results, fields) => {
                            if(error) {
                                console.log('query2 err ', error)
                                reject({ type: errorCodes.DBERR, details: error })
                            } else {
                                console.log('resolve2')
                                resolve(results)
                            }
                        })
                    })
                ]).then(([team, members]) => {
                    // construct the object
                    team[0].members = members
                    resolve(team[0])
                }).catch((error) => {
                    // something failed, bubble the error.
                    reject(error)
                })
        })
    },
    getTeamsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT t.id, t.name, m.role FROM team_memberships m RIGHT JOIN teams t ON m.team_id = t.id WHERE m.user_id = ?', [userId], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results)
            })
        })
    },
    createTeam: (team) => {
      // TODO: validation - must have name and owner member
      team.id = getNextId();
      mockData.push(team);
      return team;
    },
    updateTeam: (team) => {
      let index = mockData.findIndex(teamRec => teamRec.id === team.id)
      if(index === -1) {
          return undefined;
      } else {
          // TODO: validation - must have name and owner member
          mockData[index] = team;
          return team;
      }
    },
      deleteTeam: (teamId) => {
        let index = mockData.findIndex(teamRec => teamRec.id === teamId)
        if(index === -1) {
            return false;
        } else {
            mockData.splice(index, 1)
            return true;
        }
    }
}

module.exports = teams;
