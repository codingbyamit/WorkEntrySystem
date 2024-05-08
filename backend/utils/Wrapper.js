function success(statusCode, message, result) {
    return {
        status: "OK",
        statusCode,
        message,
        result,
    };
}

function error(statusCode, message) {
    return {
        status: "Error",
        statusCode,
        message,
    };
}

module.exports = { success, error };
