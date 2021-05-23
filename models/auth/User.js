const {Schema, model} = require('mongoose');

const User = new Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = model('Users', User);