const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const token = {
    addToken: (isAdmin, expiresAt, userId, clientId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`INSERT INTO tokens(is_admin, expires_at, client_id, user_id) VALUES (${isAdmin}, ${expiresAt}, \'${clientId}\', ${userId})
            ON DUPLICATE KEY UPDATE expires_at = ${expiresAt}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    return resolve({ is_admin: isAdmin, client_id: clientId, user_id: userId })
                }
            })
        })
    }
}

module.exports = token
