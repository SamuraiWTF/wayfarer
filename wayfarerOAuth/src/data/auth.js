const authUtils = require('./authUtils')
const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const auth = {
    getAuthCode: (userId) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`SELECT * FROM auth_codes WHERE user_id = ${userId}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    if (results.length === 0) return resolve(null); 
                    return resolve(JSON.parse(JSON.stringify(results[0])))
                }
            })
        })
    },
    makeAuthCode: (userId, code, expiresAt) => {
        return new Promise((resolve, reject) => {
            connectionPool.query(`INSERT INTO auth_codes(auth_code, expires_at, client_id, user_id) VALUES (\'${code}\', ${expiresAt}, 'wayfarer', ${userId})`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    return resolve({ authCode: code })
                }
            })
        })
    },
    updateAuthCode: (userId, code, expiresAt) => {
        console.log(`UPDATE auth_codes SET auth_code = \'${code}\', expires_at = ${expiresAt} WHERE user_id = ${userId})`)
        return new Promise((resolve, reject) => {
            connectionPool.query(`UPDATE auth_codes SET auth_code = \'${code}\', expires_at = ${expiresAt} WHERE user_id = ${userId}`, (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    return resolve({ authCode: code })
                }
            })
        })
    }
}

module.exports = auth
