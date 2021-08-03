//enum
const errorCodes = {
    NOAUTH: 1,
    DBERR: 2,
    NOREC: 3,
    BADPASS: 4
}

const convertToHttp = ({ type, details }) => {
    switch(type) {
        case errorCodes.NOAUTH: // Correctly code and passthrough details for client errors
            return { status: 401, message: details }
        case errorCodes.BADPASS:
            return { status: 401, message: details }
        case errorCodes.NOREC:
            return { status: 404, message: details }
        default: // Suppress details from any that are server errors
            return { status: 500, message: 'A server error occurred. Try again later.' }
    }
}

exports.convertToHttp = convertToHttp
exports.errorCodes = errorCodes