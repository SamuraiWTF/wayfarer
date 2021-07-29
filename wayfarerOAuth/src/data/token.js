const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const token = {
    addToken: (token, expiresAt, userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`INSERT INTO tokens(token, expires_at, client_id, user_id) VALUES (\'${token}\', ${expiresAt}, 'wayfarer', ${userId})
            ON DUPLICATE KEY UPDATE token = \'${token}\', expires_at = ${expiresAt}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    return resolve({ authToken: token })
                }
            })
        })
    }
}

module.exports = token
