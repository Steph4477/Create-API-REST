const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

/*
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')
const passwordValidator = require('password-validator')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const schema = new passwordValidator()
        schema.is().min(8)
        .is().max(20)
        .has().uppercase()
        .has().lowercase()
        .has().not().spaces()
        return schema.validate(v)
      },
      message: 'Invalid password'
    }
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)*/
