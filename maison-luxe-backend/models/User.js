const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  region: { type: String, default: 'US' }
}, { timestamps: true })

userSchema.pre('save', function(next) {
  if (this.email) this.email = this.email.toLowerCase()
  next()
})

userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: String(email).toLowerCase() })
}

module.exports = mongoose.model('User', userSchema)