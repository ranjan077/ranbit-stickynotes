var mongoose =  require('mongoose');
var validator = require('validator');
var bcrypt   = require('bcrypt-nodejs');
var userSchema = new mongoose.Schema({
    
    local            : {
        name         : String,
	    email        :  {
				        type: String,
				        validate: [ validator.isEmail, 'invalid email' ]
				    },
	    username    : String,
	    password    : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    note:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local['password']);
};

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
