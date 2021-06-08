const connectionPool = require('./mysqlConnectionPool')
const { errorCodes } = require('./errorCodes')
const { hashWithSalt } = require('./authUtils')

// Copied and pasted from data/users  - modularize
const removeKeys = (obj, keyArray) => {
    keyArray.forEach(key => delete obj[key])
    return obj
}

const admin = {
    getUsers: () => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT * FROM users ORDER BY name ASC', [], (error, results, fields) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results.map(result => removeKeys(result, ['password', 'salt'])))
            })
        })
    },
    addUser: ({ name, username, password, isadmin }) => {
        const { hash, salt } = hashWithSalt(password)
        return new Promise((resolve, reject) => {
            connectionPool.query(`INSERT INTO users (name, username, salt, password, isadmin) VALUES (
                ?, 
                ?, 
                ?, 
                ?, 
                ?
            )`, [name, username, salt, hash, isadmin || false], (error, results, fileds) => {
                if(error) {
                    return reject({ type: errorCodes.DBERR, details: error })
                }
                resolve(results)
            })
        })
    }
}

module.exports = admin;