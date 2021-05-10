const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const tickets = {
    getTicketsByAssignedUser: (userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT BIN_TO_UUID(ti.id, 1) as id, ti.title, ti.body, 
            ti.team_id, t.name AS team_name, ti.assigned_to, ua.name AS assigned_to_name, ti.status,
             ti.created_by, uc.name AS created_by_name, ti.created_date, ti.due_date 
             FROM tickets ti 
             RIGHT JOIN users ua ON ti.assigned_to = ua.id 
             RIGHT JOIN users uc ON ti.created_by = uc.id
             RIGHT JOIN teams t ON ti.team_id = t.id
             WHERE ti.assigned_to = ?`, [ userId ], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results)
            })
        })
    },
    getTicketsByTeam: (teamId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT BIN_TO_UUID(ti.id, 1) as id, ti.title, 
            ti.team_id, t.name AS team_name, ti.assigned_to, ua.name AS assigned_to_name, ti.status,
             ti.created_by, uc.name AS created_by_name, ti.created_date, ti.due_date 
             FROM tickets ti 
             RIGHT JOIN users ua ON ti.assigned_to = ua.id 
             RIGHT JOIN users uc ON ti.created_by = uc.id
             RIGHT JOIN teams t ON ti.team_id = t.id
             WHERE ti.team_id = ?`, [ teamId ], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results)
            })
        })
    },
    getTicketDetailsById: (ticketId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT BIN_TO_UUID(ti.id, 1) as id, ti.team_id, ti.assigned_to, ti.title, ti.body, ti.status
            FROM tickets ti
            WHERE BIN_TO_UUID(ti.id, 1) = ?`, [ticketId], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                if(results.length === 0) {
                    return reject({ type: errorCodes.NOREC, details: `No ticket found for id: ${ticketId}`})
                }
                resolve(results[0])
            })
        })
    },
    updateTicketAssignee: (ticketId, userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`UPDATE tickets SET assigned_to = ? WHERE BIN_TO_UUID(tickets.id, 1) = '${ticketId}'`, [userId], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results.changedRows)
            })
        })
    },
    partialUpdateTicket: (ticketId, fields) => {
        return new Promise((resolve, reject) => {
            let fieldset = Object.keys(fields).filter((key) => 
            // This filter can be used to use an allowlist to strip fields that don't exist or should never be part of a partial update.
            true).reduce((set, key) => {
                set.keys.push(key);
                set.vals.push(fields[key]);
                return set;
            }, { keys: [], vals: []  });
            let setters = fieldset.keys.map(key =>  
                `${key} = ?`
             ).join(', ');
            connectionPool.query(`UPDATE tickets SET ${setters} WHERE BIN_TO_UUID(tickets.id, 1) = ?`, [...fieldset.vals, ticketId], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results.changedRows)
            })
        })
    }
}

module.exports = tickets;