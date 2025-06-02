require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    const payload = {
        _id: user._id,
        role: user.role
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 2 * 365 * 24 * 60 * 60 * 1000
    })
} 

module.exports = { generateToken }