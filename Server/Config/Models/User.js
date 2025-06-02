const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    sex: { 
        type: String,
        required: true
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    canAccess:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'worker',
        enum: ['admin', 'worker']
    },
    verificationCode: String,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date
}, { timestamps: true })

const Users = mongoose.model('Users', UserSchema)

module.exports = Users