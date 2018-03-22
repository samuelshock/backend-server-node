const HTTP_CODES = require('./http_response_codes');

/**
 * Class for create a template of responses.
 */
class Response {


    constructor(model) {
            this.model = model;
        }
        /**
         * @param  {} data      description
         * @param  {} code      description
         * @param  {} message   description
         */
    static response(response, data, code, message) {
        let resOption = getOptionResponse(code);
        let res = {
            [resOption.data]: data,
            [resOption.title]: title,
            ok: resOption.ok,
            message: message
        };
        response.status(code);
        response.json(res);

    }

    static getOptionResponse(code) {
        res = {
            data: null,
            title: null,
            ok: false
        };
        if (code >= 200 && code < 300) {
            res.ok = true;
            res.data = this.model;
            res.title = HTTP_CODES[code];
        } else {
            res.data = 'error';
            res.title = HTTP_CODES[code];
        }
    }

}

module.exports = Response;