import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    ProfilePicture: {
        type: String,
        default: 'default.jpg'
    },
    bannerPicture: {
        type: String,
        default: 'default_banner.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const User = mongoose.model('User', userSchema);

export default User;