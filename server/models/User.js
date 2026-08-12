const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: '',
        maxlength: 500
    },
    gender: {
        type: String,
        enum: ['', 'Male', 'Female', 'Other', 'Prefer not to say'],
        default: ''
    },
    age: {
        type: Number,
        min: 0,
        max: 150
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
