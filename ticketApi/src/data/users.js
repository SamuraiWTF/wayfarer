const authUtils = require('./authUtils')
const connectionPool = require('./mysqlConnectionPool')

const removeKeys = (obj, keyArray) => {
    keyArray.forEach(key => delete obj[key])
    return obj
}

let mockData = [
    { id: 1, name: 'Captain Beard', username: 'beard@wayfarertf.test', salt: undefined, password: undefined }
]

const users = {
    authenticate: (username, password) => {
        return new Promise((resolve, reject) => {
            connectionPool.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
                if(error) {
                    reject({ type: 'DBERR', details: error})
                } else {
                    if(results.length === 1 && results[0].password === authUtils.hashWithSalt(password, results[0].salt).hash) {
                        let token = authUtils.createAuthToken(results[0])
                        resolve(token)
                    }
                    // invalid user or password
                    reject({ type: 'NOAUTH', details: 'Invalid credentials.' })
                }
            })
        })
    },
    setPassword: (id, password) => {
        let userIndex = mockData.findIndex(user => user.id = id)
        if(userIndex !== -1) {
          let storedCreds = authUtils.hashWithSalt(password);
          mockData[userIndex].password = storedCreds.hash;
          mockData[userIndex].salt = storedCreds.salt;
          return true
        }
        return false
    },
    getUserById: (id) => {
        let user = mockData.find(userRec => userRec.id == id)
        return user && removeKeys(user, ['password', 'salt'])
    }
}

module.exports = users
