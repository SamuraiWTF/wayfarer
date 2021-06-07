const authUtils = require('./authUtils')
const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')

const removeKeys = (obj, keyArray) => {
    keyArray.forEach(key => delete obj[key])
    return obj
}

const users = {
    authenticate: (username, password, generateRefreshToken) => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT id, password, salt, username, isadmin FROM users WHERE username = ?', [username], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                } else {
                    if(results.length === 1) {
                        if(results[0].password === authUtils.hashWithSalt(password, results[0].salt).hash) {
                            let token = authUtils.createAuthToken(results[0])
                            let userId = results[0].id;
                            let payload = { token: token, userId, userId }
                            let refreshToken = null;
                            if(generateRefreshToken) {
                                refreshToken = authUtils.createRefreshCookie(results[0])
                            }
                            return resolve([payload, refreshToken])
                        }
                        // invalid password
                        return reject({ type: errorCodes.BADPASS, details: 'Invalid credentials' })
                    }
                    // invalid user
                    reject({ type: errorCodes.NOAUTH, details: 'Invalid credentials.' })
                }
            })
        })
    },
    setPassword: (id, password) => {
        return new Promise((resolve, reject) => {
            connectionPool.getConnection((err, connection) => {
                if(err) {
                    connection.release()
                    reject({ type: errorCodes.DBERR, details: err })
                } else {
                    connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results, fields) => {
                        if(error) {
                            connection.release()
                            return reject({ type: errorCodes.DBERR, details: err })
                        }
                        if(results.length === 0) {
                            connection.release()
                            return reject({ type: errorCodes.NOREC, details: 'No user found for supplied ID.' })
                        }
                        let {hash, salt} = authUtils.hashWithSalt(password)
                        connection.query('UPDATE users SET password = ?, salt = ? WHERE id = ?', [hash, salt, id], (error, results, fields) => {
                            connection.release()
                            if(error) {
                                return reject({ type: errorCodes.DBERR, details: error })
                            }
                            resolve(true)
                        })
                    })
                }
            })
        })
    },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT * FROM users WHERE id = ?', [id], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                if(results.length === 0) {
                    return reject({ type: errorCodes.NOREC, details: 'No user found for supplied ID.'})
                }
                resolve(removeKeys(results[0], ['password', 'salt']))
            })
        })
    }
}

module.exports = users
