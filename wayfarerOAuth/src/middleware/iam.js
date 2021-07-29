const { validateTokenSig, getClaims } = require('../data/authUtils')

exports.validateTokenSig = function(req, res, next) {
    const header = req.get('Authorization')
    if(header) {
        const [scheme, token] = header.split(' ')
        if(token) {
            const claims = validateTokenSig(token)
            if(claims) {
                req.claims = claims
                return next()
            }
        }
    }
    res.status(401).json({ status: 401, error: 'Invalid token signature.', reauth: true })
}

exports.tokenClaims = function(req, res, next) {

}