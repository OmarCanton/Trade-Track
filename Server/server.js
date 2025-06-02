const express = require('express')
require('dotenv').config()
const cors = require('cors')
const connectToDB = require('./Config/ConnectDb')
const AuthRoutes = require('./Routes/AuthRoutes')
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

//routes
app.use(AuthRoutes)
app.use(AdminRoutes)
app.use(ProductsRoutes)
app.use(CategoryRoutes)

//starting the server with a log message
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
})