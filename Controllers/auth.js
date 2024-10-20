const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Sign-In (Registration) Controller
exports.signUp = async (req, res) => {
    try {
        const { name, 
                email, 
                phoneNumber, 
                password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !phoneNumber || !password){
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error', 
            error 
        });
    }
};


// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, 
                password } = req.body;

        // console.log("email -> ",email);
        // console.log("Passward -> ",password);

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'User not found' 
            });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Create payload for JWT token
        const payload = {
            userId: user._id,
            email: user.email,
            name: user.name,          
            phoneNumber: user.phoneNumber 
        };

        // Generate JWT token
        const token = jwt.sign(
            payload,                   // The payload created above
            process.env.JWT_SECRET,    // JWT secret from environment
            { expiresIn: '4h' }        // Token expiration time
        );

        user.token = token;
        user.password = undefined; 

        // Create cookies and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully"
        });

        // Return success response with the token
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error', 
            error 
        });
    }
};

