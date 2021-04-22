const pbkdf2 = require('pbkdf2')
const uuidv4 = require('uuid').v4
const jwt = require('jsonwebtoken')

const signingSecret = 'anthropogenic' // Selected from https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/common-passwords-win.txt

const hashConfig = [
    5, // iterations
    32, // keylength
    'sha512' // digest
]

exports.hashWithSalt = (password, salt) => {
    if(salt === undefined) {
        // salt has not been provided, generate new salt and hash password with it.
        console.log('generating salt')
        salt = uuidv4().replace(/\-/g, '')
    }
    const hash = pbkdf2.pbkdf2Sync(password, salt, ...hashConfig).toString('hex')
    return {
        hash: hash, 
        salt: salt
    }
}

exports.createAuthToken = (user) => {
    let claims = { userId: user.id, username: user.username }
    if(user.isAdmin === 1) {
        claims.isAdmin = true
    }
    return jwt.sign(claims, signingSecret, { expiresIn: '1h' })
}