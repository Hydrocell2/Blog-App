const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.register = (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    return User.findOne({ 
        $or: [{ email }, { username }] 
    })
    .then(existingUser => {
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
        const newUser = new User({
            email,
            username,
            password: hashedPassword
        });

        return newUser.save();
    })
    .then(newUser => {
        return res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            }
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Registration failed', details: error.message });
    });
};

module.exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    let foundUser;

    return User.findOne({ email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        foundUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isPasswordValid => {
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: foundUser._id, 
                email: foundUser.email,
                username: foundUser.username,
                isAdmin: foundUser.isAdmin,
                profilePicture: foundUser.profilePicture || ''
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );

        return res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: foundUser._id,
                email: foundUser.email,
                username: foundUser.username,
                isAdmin: foundUser.isAdmin,
                bio: foundUser.bio,
                gender: foundUser.gender,
                age: foundUser.age,
                profilePicture: foundUser.profilePicture
            }
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Login failed', details: error.message });
    });
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id).select('-password')
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ 
            message: 'Profile retrieved successfully',
            user
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to retrieve profile', details: error.message });
    });
};

module.exports.updateProfile = (req, res) => {
    const { bio, gender, age, profilePicture } = req.body;

    return User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (bio !== undefined) user.bio = bio;
        if (gender !== undefined) user.gender = gender;
        if (age !== undefined) user.age = age;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        return user.save();
    })
    .then(updatedUser => {
        return res.status(200).json({ 
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                username: updatedUser.username,
                bio: updatedUser.bio,
                gender: updatedUser.gender,
                age: updatedUser.age,
                profilePicture: updatedUser.profilePicture,
                isAdmin: updatedUser.isAdmin
            }
        });
    })
    .catch(error => {
        return res.status(500).json({ error: 'Failed to update profile', details: error.message });
    });
};
