let JSONAPISerializer = require('jsonapi-serializer').Serializer;
let JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

/**
 * Class for wrapper the services responses.
 */
class Serializer {

	/**
	 * constructor - description
	 *
	 * @param  {String} modelName It's the name of model to wrapper.
	 * @param  {ObjectJson} fields    It's the fields configuration of a model.
	 */
	constructor(modelName, fields) {
		this._model_fields = fields;
		this._serialize = new JSONAPISerializer(modelName, {
			attributes: Object.keys(fields)
		});
		this._deserialize = new JSONAPIDeserializer();
	}

	/**
	 * serialize - the Json data
	 *
	 * @param  {Array<Object>} data list of objects to serialize.
	 * @return {Object}      Returns Json api serialized.
	 */
	serialize(data) {
		return this._serialize.serialize(data);
	}

	/**
	 * deserialize
	 *
	 * @param  {Array<Object>} jsonapi data
	 * @return {Object}         dictionary of data
	 */
	deserialize(jsonapi) {
		this._deserialize.deserialize(jsonapi, (err, data) => {
			return err ? err : data;
		});
	}

	/**
	 * jsonParseData - description
	 *
	 * @param  {Array<APIjson>} data   Object with api Json format.
	 * @param  {Object} result callback
	 */
	jsonParseData(data, result) {
		let newData = [];
		for (let i in data) {
			let aux = {};
			for (let j in this._model_fields) {
				if(typeof(this._model_fields[j]) == "object") {
					for(let field in this._model_fields[j]) {
						if(data[i][this._model_fields[j][field]]) {
							aux[j] = data[i][this._model_fields[j][field]];
						}
					}
				} else {
					aux[j] = data[i][this._model_fields[j]];
				}
			}
			newData.push(aux);
		}
		let parsed = this._serialize.serialize(newData);
		result(null, parsed);
	}

	/**
	 * jsonApiParser - description
	 *
	 * @param  {Array<Json>} data     Object with Json format.
	 * {Object} result callback
	 */
	jsonApiParser(data, response) {

		this._deserialize.deserialize(data, (error, result) => {
			if (error) {
				response(error, null);
			} else {
				response(null, result);
			}
		});
	}

}

module.exports = Serializer;
