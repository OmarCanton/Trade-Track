require('dotenv').config()
const mongoose = require('mongoose')

const connectToDB = async () => {
    const MONGODB_URL = process.env.MONGODB_URL
    try {
        const connected = await mongoose.connect(MONGODB_URL)
        if(connected) console.log('Database connection established')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectToDB