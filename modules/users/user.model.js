var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contrasena es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    // google: { type: Boolean, required: true, default: false }
}, { collection: 'users', discriminatorKey: '_type' });

userSchema.plugin(uniqueValidator, { message: 'El {PATH} ya fue registrado.' });

module.exports = mongoose.model('users', userSchema);