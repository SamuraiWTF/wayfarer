const { convertToHttp } = require('../data/errorCodes')

exports.sendErrorResponse = function(res, err) {
    console.log('request error: ', err)
    let { status, message } = convertToHttp(err)
    res.status(status).json({ code: status, error: message })
}

exports.sendSuccessResponse = function(res, data) {
    res.status(200).json({ code: 200, data: data })
}