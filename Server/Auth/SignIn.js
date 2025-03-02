const passport = require('passport')
const { Strategy } = require('passport-local')
const Users = require('../Config/Models/UserAuthModels')
const bcrypt = require('bcrypt')

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await Users.findById(id)
        if(!findUser) return done(null, false, { message: 'user not found!' })
        done(null, findUser)
    } catch(err) {
        done(err, null)
    }
})


passport.use('signin-local', 
    new Strategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
        try {
            const user = await Users.findOne({email})
            if(!user) return done(null, false, { message: 'User not found, please register' })
            
            const checkPass = await bcrypt.compare(password, user.password)
            if(!checkPass) return done(null, false, { message: 'Incorrect Password entered' })
            
            done(null, user, { message: `Welcome ${user.firstName}` })
        } catch(err) {
            done(err, null)
        }
    })
)