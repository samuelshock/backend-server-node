const HTTP_CODES = require('./http_response_codes');

/**
 * Class for create a template of responses.
 */
class Response {

    /**
     * @param  {Object} data      Data to sent
     * @param  {Integer} code     Http Status code
     * @param  {String} message   Message to sent
     */
    static response(modelName, data, code, message, response) {
        let resOption = this.getOptionResponse(code, modelName);
        let res = {
            [resOption.data]: data,
            title: resOption.title,
            ok: resOption.ok,
            message: message
        };
        if (arguments.length > 5) {
            console.log(arguments[5]);
            res.total = arguments[5];
        }
        response.status(code).json(res);
    }

    static getOptionResponse(code, modelName) {
        let res = {
            data: null,
            title: null,
            ok: false
        };
        if (code >= 200 && code < 300) {
            res.ok = true;
            res.data = modelName;
            res.title = HTTP_CODES[code];
        } else {
            res.data = 'error';
            res.title = HTTP_CODES[code];
        }
        return res;
    }

}

module.exports = Response;