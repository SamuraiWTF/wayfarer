const crypto = require('crypto');

const signingSecret = 'anthropogenic' // Selected from https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/common-passwords-win.txt

const hashConfig = [
    5, // iterations
    32, // keylength
    'sha512' // digest
]

exports.generateCode = () => {
    const seed = crypto.randomBytes(256);
    return code = crypto.createHash('sha1').update(seed).digest('hex');
}

exports.generateToken = () => {
    const seed = crypto.randomBytes(256);
    return code = crypto.createHash('sha1').update(seed).digest('hex');
}

exports.generateExpiration = (hours) => {
    return Math.round(Date.now() / 1000) + (3600 * hours);
}

exports.createRefreshCookie = (user) => {
    let claims = { userId: user.id, username: user.username, purpose: 'refresh' }
    return true
}

exports.validateTokenSig = (token) => {
    try {
        let claims = true
        return claims
    } catch(err) {
        console.log('token validation failed: ', err)
        return false
    }
}

exports.getClaims = (token) => {

}