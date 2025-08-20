const ResultStatus = {
    OK: 'OK',
    FAIL: 'FAIL'
};

class Result {
    constructor(status = ResultStatus.OK, code = 200, data = null, errors = []) {
        this.status = status;
        this.code = code;
        this.data = data;
        this.errors = errors;
    }

    static ok(data = null, code = 200) {
        return new Result(ResultStatus.OK, code, data);
    }

    static fail(errors = [], code = 400) {
        return new Result(ResultStatus.FAIL, code, null, errors);
    }

    static notFound(message = 'Not found') {
        return new Result(ResultStatus.FAIL, 404, null, [message]);
    }

    static unauthorized(message = 'Unauthorized') {
        return new Result(ResultStatus.FAIL, 401, null, [message]);
    }

    static serverError(message = 'Internal server error') {
        return new Result(ResultStatus.FAIL, 500, null, [message]);
    }
}

module.exports = { Result, ResultStatus };