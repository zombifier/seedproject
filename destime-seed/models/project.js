// models/project.js
//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    files: {type: Array},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});
/*
schema.post('remove', function (message) {
    User.findById(message.user, function (err, user) {
        user.messages.pull(message);
        user.save();
    });
});
*/
module.exports = mongoose.model('Project', schema);
