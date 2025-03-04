const express = require('express')
require('dotenv').config()
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const connectToDB = require('./Config/ConnectDb')
const UserAuthRoutes = require('./Routes/UserAuthRoutes')
const AdminRoutes = require('./Routes/AdminRoutes')
const ProductsRoutes = require('./Routes/ProductsRoutes')
const CategoryRoutes = require('./Routes/CategoryRoutes')
const app = express()

//setup cors
app.use(cors({
    origin: process.env.FRONT_END_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))

//connect to the database
connectToDB()

//parse JSON files
app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', 1)

//setup cookie
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true, 
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10 /* Store session for 10 years */
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}))

//iniitializing passport with session
app.use(passport.initialize())
app.use(passport.session())


//routes
app.use(UserAuthRoutes)
app.use(AdminRoutes)
app.use(ProductsRoutes)
app.use(CategoryRoutes)

//starting the server with a log message
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})