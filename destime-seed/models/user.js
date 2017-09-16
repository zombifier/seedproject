var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    // non-local users don't have passwords
    password: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    facebookID: {type: String, required: false},
    googleID: {type: String, required: false}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
