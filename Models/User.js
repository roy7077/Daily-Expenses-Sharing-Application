const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Array of groups user is enrolled in
  groupEnrolled: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  // Total money the user owes to other participants
  moneyOwes: {
    type: Number,
    default: 0
  },
  // Total money the user is owed by other participants
  moneyOwed: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// User model
const User = mongoose.model('User', userSchema);
module.exports = User;
