const pbkdf2 = require('pbkdf2')

const hashConfig = [
    5, // iterations
    32, // keylength
    'sha512' // digest
]

const generateSalt = () => {
    // awful salt generator
    return String.fromCharCode(...'      '.split('').map(char => Math.ceil(Math.random() * 26) + 96));
}

const removeKeys = (obj, keyArray) => {
    keyArray.forEach(key => delete obj[key])
    return obj
}

let mockData = [
    { id: 1, name: 'Captain Beard', username: 'beard@wayfarertf.test', salt: undefined, password: undefined }
]

const users = {
    authenticate: (username, password) => {
        let userRec = mockData.find(user => user.username === username)
        if(userRec) {
            let comparisonHash = pbkdf2.pbkdf2Sync(password, userRec.salt, ...hashConfig).toString('hex')
            if(comparisonHash === userRec.hash) {
                // Generate token
                return true;
            }
        }
        // Either not found our bad password.
        return false;
    },
    setPassword: (id, password) => {
        let userIndex = mockData.findIndex(user => user.id = id)
        if(userIndex !== -1) {
          let salt = generateSalt();
          mockData[userIndex].password = pbkdf2.pbkdf2Sync(password, salt, ...hashConfig).toString('hex')
          mockData[userIndex].salt = salt;
          return true
        }
        return false
    },
    getUserById: (id) => {
        let user = mockData.find(userRec => userRec.id == id)
        return user && removeKeys(user, ['password', 'salt'])
    }
}

users.setPassword(1, 'Space Parrots arrr!')

module.exports = users
