const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Expense Schema
const expenseSchema = new Schema({
  desc: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  splitType: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    required: true
  },
  // Reference to the group in which the expense occurred
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  // Array of objects to store how much each participant owes
  splitedAmount: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

// Expense model
const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
