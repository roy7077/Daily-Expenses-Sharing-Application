const Group = require('../Models/Group'); 
const User = require('../Models/User'); 

// Controller to create a new group
exports.createNewGroup = async (req, res) => {
    try {
        // Destructure the request body to get group details
        const { name, desc, participants } = req.body;

        // Basic validation for name
        if (!name || typeof name !== 'string' || name.length < 3 || name.length > 50) {
            return res.status(400).json({ 
                message: 'Name is required and should be between 3 and 50 characters long.' 
            });
        }

        // Basic validation for description
        if (!desc || typeof desc !== 'string' || desc.length > 200) {
            return res.status(400).json({ 
                message: 'Description is required and should not exceed 200 characters.' 
            });
        }

        // Basic validation for participants
        if (!Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ 
                message: 'Participants should be a non-empty array.' 
            });
        }

        // Check if all participants exist in the User model
        const userIds = participants.map(participant => participant.user);
        const usersExist = await User.find({ _id: { $in: userIds } });

        if (usersExist.length !== participants.length) {
            return res.status(404).json({ 
                message: 'Some participants do not exist.' 
            });
        }

        // Create a new group
        const newGroup = new Group({
            name,
            desc,
            participants
        });

        // Save the group to the database
        await newGroup.save();

        // Add the group ID to each user's groupEnrolled array
        await User.updateMany(
            { _id: { $in: userIds } }, // Match users who are participants
            { $addToSet: { groupEnrolled: newGroup._id } } // Add group ID to groupEnrolled
        );

        // Return a success response with the newly created group
        res.status(201).json({ 
            message: 'Group created successfully!', 
            group: newGroup 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'An error occurred while creating the group.', 
            error: error.message 
        });
    }
};


// Controller to add a new participant to an existing group
exports.addMemberToGroup = async (req, res) => {
    try {
        const { 
            groupId, 
            userId, 
            amount } = req.body; // Extract groupId, userId, and amount from request body

        // Validate groupId, userId, and amount
        if (!groupId || !userId ) {
            return res.status(400).json({
                message: 'groupId, userId, and a valid positive amount are required.',
            });
        }

        // Find the group by ID
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ 
                message: 'Group not found.' 
            });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found.' 
            });
        }

        // Check if the user is already a participant in the group
        const isAlreadyParticipant = group.participants.some((participant) =>
            participant.user.equals(userId)
        );
        if (isAlreadyParticipant) {
            return res.status(400).json({ 
                message: 'User is already a participant in the group.' 
            });
        }

        // Add the user to the group with the specified amount
        group.participants.push({
            user: userId,
            amount: amount,
        });

        // Save the updated group
        await group.save();

        // Add the group to the user's groupEnrolled array
        user.groupEnrolled.push(groupId);
        await user.save();

        res.status(200).json({
            message: 'User added to the group successfully.',
            group,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while adding the member to the group.',
            error: error.message,
        });
    }
};


// Controller to retrieve all groups
exports.getAllGroups = async (req, res) => {
    try {
        // Fetch all groups from the database and populate participants and expenses
        const groups = await Group.find()
            .populate('participants.user', 'name email') // Populating participants with user details (name and email)
            .populate('expenses'); // Populating the expenses array

        // Check if there are any groups
        if (!groups || groups.length === 0) {
            return res.status(404).json({
                message: 'No groups found'
            });
        }

        // Return the list of groups
        res.status(200).json({
            message: 'Groups retrieved successfully',
            groups
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving groups',
            error: error.message
        });
    }
};


exports.getGroupById = async (req, res) => {
    try {
        const groupId = req.params.id;

        // Fetch the group by ID and populate participants and expenses
        const group = await Group.findById(groupId)
            .populate('participants.user', 'name email') // Populating participants with user details (name and email)
            .populate('expenses'); // Populating the expenses array

        // Check if the group exists
        if (!group) {
            return res.status(404).json({
                message: 'Group not found'
            });
        }

        // Return the group details
        res.status(200).json({
            message: 'Group retrieved successfully',
            group
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving the group',
            error: error.message
        });
    }
};