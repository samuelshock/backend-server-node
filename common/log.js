const Log = require('log-to-file');

/**
 * Class for save logs in files for reviewed
 */
class LOG {

    /**
     * constructor - Contructor of class
     *
     * @param  {type} fileName = 'SERVER_MANAGER' Filename for save the logs.
     */
    constructor(fileName = 'SERVER_MANAGER') {
        this.fileName = fileName;
    }

    /**
     * save - Save information in the logs
     *
     * @param  {Express_response} response  This field is a instance of express response.
     */
    saveResponse(response) {
        let messageToSave = ['RESPONSE SERVER'];
        messageToSave.push('URL = ' + response.req.originalUrl);
        messageToSave.push('METHOD = ' + response.req.method);
        messageToSave.push('BODY = ' + JSON.stringify(response.req.body));
        messageToSave.push('HEADERS = ' + JSON.stringify(response.req.headers));
        messageToSave.push('STATUS CODE = ' + JSON.stringify(response.statusCode));
        let oldSend = response.send;
        let fileName = this.getFilename();
        response.send = function() {
            messageToSave.push('response:');
            try {
                let tmp = JSON.parse(arguments[0]);
                messageToSave.push(JSON.stringify(tmp));
            } catch (e) {
                messageToSave.push(arguments);
            }
            Log(messageToSave.join('\n'), fileName);
            oldSend.apply(response, arguments);
        };
    }

    /**
     * getFilename - description
     *
     * @return {strng}  Return a filename
     */
    getFilename() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        let fileName = './LOGS/' + this.fileName + '.' + dd + '-' + mm + '-' + yyyy + '.log';
        return fileName;
    }

    /**
     * saveMessage - Save a message in the logs.
     *
     * @param  {string} message Message to save in the logs, this field is of type string.
     */
    saveMessage(message) {
        let fileName = this.getFilename();
        Log(message, fileName);
    }
}

module.exports = LOG;