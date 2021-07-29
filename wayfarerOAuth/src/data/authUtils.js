const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const signingSecret = 'anthropogenic' // Selected from https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/common-passwords-win.txt

exports.generateCode = () => {
    const seed = crypto.randomBytes(256);
    return code = crypto.createHash('sha1').update(seed).digest('hex');
}

exports.generateToken = (userId, clientId, isAdmin, expiresAt) => {
    const claims = {
        sub: userId,
        iss: clientId,
        adm: isAdmin,
        exp: expiresAt
    }
    return jwt.sign(claims, signingSecret)
}

exports.generateExpiration = (hours) => {
    return Math.round(Date.now() / 1000) + (3600 * hours);
}
/* NOT FUNCTIONAL YET
exports.createRefreshCookie = (user) => {
    let claims = { userId: user.id, username: user.username, purpose: 'refresh' }
    return true
}
*/