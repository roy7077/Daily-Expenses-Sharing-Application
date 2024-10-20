const Expense = require('../Models/Expense');
const Group = require('../Models/Group');
const User = require('../Models/User');
const { Parser } = require('json2csv');
const fs = require('fs');

/*----------------------------- Controller to add an expense----------------*/
exports.addExpense = async (req, res) => {
    try {
        const { 
            desc, 
            amount, 
            splitType, 
            group, 
            participants } = req.body;

        const userId = req.user.userId; // Get the ID of the logged-in user
        //console.log(userId);

        // Validate required fields
        if (!desc || !amount || !splitType || !group || !participants || participants.length === 0) {
            return res.status(400).json({ 
                message: 'All fields are required.' 
            });
        }

        // console.log("desc -> ", desc);
        // console.log("amount -> ", amount);
        // console.log("splitType -> ", splitType);
        // console.log("group -> ", group);
        // console.log("participants -> ", participants);

        // Create an expense object
        const newExpense = new Expense({
            desc,
            amount,
            splitType,
            group,
            splitedAmount: []
        });

        // Split logic
        let totalOwed = 0;

        if (splitType === 'equal') {
            const amountPerPerson = amount / participants.length; // Split among participants only

            // Set amounts for participants (including the payer)
            for (const participant of participants) {
                if (participant.user) {
                    if (participant.user.toString() === userId.toString()) {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: amount-amountPerPerson // The user who paid
                        });
                    } else {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: -amountPerPerson // Others owe this amount
                        });
                    }
                } else {
                    console.error('Participant user is undefined:', participant);
                }
            }
            totalOwed = amount;

        } else if (splitType === 'exact') {
            const totalExactOwed = participants.reduce((sum, participant) => sum + participant.amount, 0);
            if (totalExactOwed !== amount) {
                return res.status(400).json({ 
                    message: 'Exact amounts do not match the total amount.' 
                });
            }

            for (const participant of participants) {
                if (participant.user) {
                    if (participant.user.toString() === userId.toString()) {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: amount-participant.amount // The user who paid
                        });
                    } else {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: -participant.amount // Exact amount owed
                        });
                    }
                } else {
                    console.error('Participant user is undefined:', participant);
                }
            }
            totalOwed = amount;

        } else if (splitType === 'percentage') {
            const totalPercentage = participants.reduce((sum, participant) => {
                return participant.percentage ? sum + participant.percentage : sum;
            }, 0);

            if (totalPercentage !== 100) {
                return res.status(400).json({ 
                    message: 'Percentages must add up to 100.' 
                });
            }

            for (const participant of participants) {
                if (participant.user) {
                    const owedAmount = (participant.percentage / 100) * amount;
                    if (participant.user.toString() === userId.toString()) {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: amount-owedAmount // The user who paid
                        });
                    } else {
                        newExpense.splitedAmount.push({
                            user: participant.user,
                            amount: -owedAmount // Owed amount by percentage
                        });
                    }
                } else {
                    console.error('Participant user is undefined:', participant);
                }
            }
            totalOwed = amount;
        }

        // console.log("line 113");
        //console.log(newExpense);
        // Save the expense
        await newExpense.save();

        // Add the expense to the group's expense array
        const groupData = await Group.findById(group);
        if (groupData) {
            groupData.expenses.push(newExpense._id); // Add expense ID to group
            for (const split of newExpense.splitedAmount) {
                const participant = groupData.participants.find(p => p.user.toString() === split.user.toString());
                if (participant) {
                    //console.log("yes");
                    participant.amount += split.amount; // Update participant amount
                }
            }
            await groupData.save(); // Save updated group
        } else {
            return res.status(404).json({ 
                message: 'Group not found' 
            });
        }

        // console.log("line 129");

        // Update each user's expense list and amounts
        for (const split of newExpense.splitedAmount) {
            const user = await User.findById(split.user);
            if (user) {
                //console.log(user._id);
                if (split.amount > 0) {
                    user.moneyOwed += split.amount; // Increase amount owed to the user
                } else {
                    user.moneyOwes += Math.abs(split.amount);; // Increase the amount the user owes
                }
                //user.expenses.push(newExpense._id); // Add the expense ID to the user's expense array
                await user.save();
            } else {
                console.error('User not found for split:', split.user);
            }
        }

        // console.log("line 147");
        res.status(201).json({ 
            message: 'Expense added successfully!', 
            expense: newExpense 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'An error occurred while adding the expense.', 
            error: error.message 
        });
    }
};

/*----------------Controller to fetch money owed and owes for a specific user in each group----------------*/
exports.getUserGroupMoneyStatus = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user and populate the enrolled groups
        const user = await User.findById(userId).populate({
            path: 'groupEnrolled',
            select: 'name participants', // Populate only the fields we need (name and participants)
            populate: {
                path: 'participants.user', // Populate user data in participants
                select: 'name' // Get user name to validate participant's presence
            }
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found.' 
            });
        }

        // Check if the user is enrolled in any groups
        if (user.groupEnrolled.length === 0) {
            return res.status(200).json({ 
                message: 'No groups found for this user.' 
            });
        }

        // Array to hold group-specific money owed/owes
        const userGroupData = [];

        // Loop through each group the user is enrolled in
        for (const group of user.groupEnrolled) {
            // Find the specific user's entry in the participants array
            const userParticipantData = group.participants.find(
                participant => (
                    //console.log(participant);
                    participant.user._id.toString() === userId.toString()
                )
            );

            //console.log(userParticipantData);
            // If the user is found in the participants array, extract the amount
            if (userParticipantData) {
                //console.log("yes");
                const moneyStatus = {
                    groupName: group.name, // Group name
                    moneyOwed: userParticipantData.amount > 0 ? userParticipantData.amount : 0, // If the amount is positive, the user is owed money
                    moneyOwes: userParticipantData.amount < 0 ? Math.abs(userParticipantData.amount) : 0 // If the amount is negative, the user owes money
                };

                userGroupData.push(moneyStatus);
            }
        }

        // Return the data in the desired format
        return res.status(200).json({
            message: 'User money status for groups retrieved successfully!',
            userGroupData
        });

    } catch (error) {
        console.error('Error retrieving user money status for groups:', error);
        return res.status(500).json({ 
            message: 'An error occurred while retrieving the data.', 
            error: error.message 
        });
    }
};

/*---------------Controller to fetch overall expenses of a specific group-------------------*/
exports.getGroupExpenses = async (req, res) => {
    try {
        const groupId = req.params.id;

        // Find the group and populate the expenses
        const group = await Group.findById(groupId).populate({
            path: 'expenses', // Populate the expenses array
            select: 'desc amount paidBy participants' // Select necessary fields, including 'desc' (description)
        });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ 
                message: 'Group not found.' 
            });
        }

        // If no expenses are found, return an empty array
        if (group.expenses.length === 0) {
            return res.status(200).json({ 
                message: 'No expenses found for this group.', 
                expenses: [] 
            });
        }

        // Calculate total expenses for the group
        let totalExpenses = 0;
        group.expenses.forEach(expense => {
            totalExpenses += expense.amount; // Summing up the total amount for all expenses
        });

        // Return the group details along with expenses
        return res.status(200).json({
            message: `Expenses for group '${group.name}' retrieved successfully.`,
            groupName: group.name,
            totalExpenses, // Total expenses for the group
            expenses: group.expenses // Detailed list of expenses with desc and amount
        });

    } catch (error) {
        console.error('Error retrieving group expenses:', error);
        return res.status(500).json({ 
            message: 'An error occurred while retrieving the expenses.', 
            error: error.message 
        });
    }
};

// Controller to download the balance sheet for a specific group
exports.downloadGroupBalanceSheet = async (req, res) => {
    try {
        const groupId = req.params.id;

        // Fetch group and populate expenses along with participants (splitedAmount.user)
        const group = await Group.findById(groupId).populate({
            path: 'expenses',
            populate: {
                path: 'splitedAmount.user', // Correct path to populate user details inside splitedAmount
                select: 'name email' // Only select name and email
            }
        });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ 
                message: 'Group not found.' 
            });
        }

        // Check if there are expenses in the group
        if (group.expenses.length === 0) {
            return res.status(200).json({ 
                message: 'No expenses found for this group.' 
            });
        }

        // Create array to hold data for CSV
        const csvData = [];
        
        // Initialize totalExpenses to keep track of total amount
        let totalExpenses = 0;
        
        // Object to hold total contributions for each user
        const userTotals = {};

        // Loop through each expense
        group.expenses.forEach(expense => {
            // Store contributions for each participant in the expense
            let expenseContributions = {};
            expense.splitedAmount.forEach(participant => {
                const userName = participant.user.name;
                expenseContributions[userName] = participant.amount; // Store user contributions
                
                // Update the user's total contributions
                if (!userTotals[userName]) {
                    userTotals[userName] = 0;
                }
                userTotals[userName] += participant.amount; // Aggregate user's contributions
            });

            // Push the data for this expense to the CSV data array
            csvData.push({
                Description: expense.desc, // Description of the expense
                Amount: expense.amount, // Total amount for the expense
                ...expenseContributions // Contributions of all participants
            });

            // Add to total expenses
            totalExpenses += expense.amount;
        });

        // Add the final total row for the total expenses
        csvData.push({
            Description: 'Total', // Final row for totals
            Amount: totalExpenses
        });

        // Add total contributions for each user
        Object.keys(userTotals).forEach(userName => {
            csvData.push({
                Description: `Total contributed by ${userName}`, // Description for user totals
                Amount: userTotals[userName] // User's total contribution
            });
        });

        // Define fields for CSV
        const fields = ['Description', 'Amount', ...Object.keys(csvData[0]).filter(key => key !== 'Description' && key !== 'Amount')];
        const json2csvParser = new Parser({ fields });

        // Convert the data to CSV
        const csv = json2csvParser.parse(csvData);

        // Save the CSV to a file
        const filePath = `./balance-sheet-${groupId}.csv`;
        fs.writeFileSync(filePath, csv);

        // Send the CSV file as a response for download
        res.download(filePath, `balance-sheet-${groupId}.csv`, err => {
            if (err) {
                console.error('Error while sending CSV file:', err);
                return res.status(500).json({ message: 'Error occurred while downloading the file.' });
            }

            // Remove the file after it's sent
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error generating balance sheet:', error);
        return res.status(500).json({ 
            message: 'An error occurred while generating the balance sheet.', 
            error: error.message 
        });
    }
};