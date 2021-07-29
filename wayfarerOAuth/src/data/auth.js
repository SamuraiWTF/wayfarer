const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const auth = {
    getAuthCode: (userId, clientId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT * FROM auth_codes WHERE user_id = ${userId} AND client_id = \'${clientId}\'`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    if (results.length === 0) return resolve(null); 
                    return resolve(JSON.parse(JSON.stringify(results[0])))
                }
            })
        })
    },
    makeAuthCode: (userId, clientId, code, expiresAt) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`INSERT INTO auth_codes(auth_code, expires_at, client_id, user_id) VALUES (\'${code}\', ${expiresAt}, \'${clientId}\', ${userId})
            ON DUPLICATE KEY UPDATE auth_code = \'${code}\', expires_at = ${expiresAt}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    return resolve({ authCode: code })
                }
            })
        })
    },
    validateCode: (userId, code, clientId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT * FROM
            (SELECT * FROM clients, auth_codes WHERE clients.id = auth_codes.client_id) as tableA
            WHERE auth_code = \'${code}\' AND client_id = \'${clientId}\' AND user_id = ${userId}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    if (results.length === 0) return resolve(false); 
                    return resolve(true);
                }
            })
        })
    }
}

module.exports = auth
