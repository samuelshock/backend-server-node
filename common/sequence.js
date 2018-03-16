const mongoose = require('mongoose');

let CounterSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true,
		unique: true
	},
	seq: {
		type: Number,
		default: 0
	}
});

let Counter = mongoose.model('_Counter', CounterSchema);
/**
 *
 */
class Sequence {
	/**
	 *
	 */
	static model() {
		return Counter;
	}
	/**
	 * @param  {} schema
	 * @param  {} options
	 */
	static plugin(schema, options) {
		if (!options) {
			throw new Error('Plugin: require `options` parameter');
		}
		let opt = {
			_id: options.modelName || "sequence",
			seq: options.start || 0
		};
		let coun = new Counter(opt);
		coun.save();
		const fieldSchema = {};

		fieldSchema["_seq"] = {
			type: Number,
			require: true
		};

		schema.add(fieldSchema);

		schema.pre('save', function preSave(next) {
			let doc = this;
			Counter.findByIdAndUpdate({
				_id: opt._id
			}, {
				$inc: {
					seq: 1
				}
			},
			(error, count) => {
				if (error) {
					return next(error);

				}
				doc["_seq"] = count.seq;
				next();
			});
		});
	}

}
module.exports = Sequence;
