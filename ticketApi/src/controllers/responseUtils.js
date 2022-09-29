exports.sendErrorResponse = function(res, err) {
    console.log('request error: ', err)
    let { status, message } = convertToHttp(err)
    res.status(status).json({ code: status, error: message })
}

exports.sendSuccessResponse = function(res, data) {
    res.status(200).json({ code: 200, data: data })
}

exports.sendErrorResponseHTML = function(res, err) {
    /*
        Used for the CSP API course demo / lab
        This allows for a query param to toggle the CSP off for demonstration sake.
        This will also reflect the API params into the error resonse HTML body and return with Content-Type text/html
        allowing for XSS on the API when the CSP is disabled. When it's enabled the XSS attack should not execute. 
    */ 
}