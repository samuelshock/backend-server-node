const NOT_FOUND = 404;
const SUCCESSFULL = 200;
const INTERNAL_SERVER_ERROR = 500;

const ErrorList = {
	401: "Unauthorized",
	200: "success",
	500: "server error",
	404: "not Found"
};

/**
 * Class for create a template of responses.
 */
class Response {
	/**
	 * @param  {} data      description
	 * @param  {} code      description
	 * @param  {} title     description
	 * @param  {} message   description
	 */
	static response(response, data, title, code, message) {
		let tmpCode = 500;
		if(code && code >= 200){
			tmpCode = code;
		}
		let res = {
			'data': data,
			'code': tmpCode,
			'title': title,
			'message': message
		};
		response.status(tmpCode);
		response.json(res);

	}

	/**
	 * Return the code 200(Successful)
	 */
	static successful() {
		return SUCCESSFULL;
	}
	/**
	 * Return the code 404(Not Found)
	 */
	static notFound() {
		return NOT_FOUND;
	}

	/**
	 * Return the code 500(Internal server error)
	 */
	static internalServerError() {
		return INTERNAL_SERVER_ERROR;
	}

	/**
	 * Method to handleError
	 * @param {} error
	 */
	static responseError(error) {
		return {
			"status": error.statusCode,
			"error": ErrorList[error.statusCode]
		};
	}
}

module.exports = Response;
