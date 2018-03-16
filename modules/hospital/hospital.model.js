var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'usuarios' }
}, { collection: 'hospitales' });
module.exports = mongoose.model('Hospital', hospitalSchema);