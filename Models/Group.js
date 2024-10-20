const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Group Model Schema
const groupSchema = new Schema({
    name: {
        type: String,
        required: true // Name of the group
    },
    desc: {
        type: String,
        required: true // Short description of the group
    },
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true // Reference to the User model
        },
        amount: {
            type: Number,
            required: true // Amount the user owes or is owed
        }
    }],
    expenses: [{
        type: Schema.Types.ObjectId,
        ref: 'Expense' // Reference to the Expense model
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the Group model
module.exports = mongoose.model('Group', groupSchema);
