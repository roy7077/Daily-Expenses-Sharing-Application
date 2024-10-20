const User = require('../Models/User');

/*------------------------ Controller to retrieve all user details------------------*/
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users and populate the groupEnrolled field
        const users = await User.find().populate('groupEnrolled').exec();

        // Return success response with the list of users
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users.map(user => ({
                id: user._id, // Including the user ID for reference
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                groupEnrolled: user.groupEnrolled, // Populate group details
                moneyOwes: user.moneyOwes,
                moneyOwed: user.moneyOwed
            }))
        });
    } catch (error) {
        // Return error response in case of failure
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};


/*----------------------- Controller to retrieve specific user details by ID----------------------*/
exports.getUserById = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.id; 

        // Find user by ID in the database and populate groupEnrolled field
        const userDetails = await User.find({ _id: userId }).populate('groupEnrolled').exec();

        // Check if the user exists
        if (userDetails.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Since `find` returns an array, we take the first element
        const user = userDetails[0];

        // Return success response with the user details
        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                id: user._id, // Including the user ID for reference
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                groupEnrolled: user.groupEnrolled, // Populate group details
                moneyOwes: user.moneyOwes,
                moneyOwed: user.moneyOwed
            }
        });
    } catch (error) {
        // Return error response in case of failure
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

