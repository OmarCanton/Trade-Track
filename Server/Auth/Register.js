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
        if(!findUser) return done(null, false, { message: 'User not found'})
        done(null, findUser)
    } catch(err) {
        done(err, null)
    }
})

passport.use('register-local', 
    new Strategy({passReqToCallback: true, usernameField: 'email', passwordField: 'password'}, async(req, email, password, done) => {
        const { firstName, lastName, confPassword, sex } = req.body
        try {
            if(!firstName) return done(null, false, {message: 'First Name is required'})
            if(!lastName) return done(null, false, {message: 'Last Name is required'})
            if(!confPassword) return done(null, false, {message: 'Confirm Password'})
            if(!sex || sex === 'none') return done(null, false, {message: 'Your gender is required'})

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
            if(!passwordRegex.test(password)) {
                return done(null, false, {message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' })
            }

            //taking care of already existing credentials at signup
            const existingAcc = await Users.findOne({email})
            if(existingAcc) return done(null, false, {message: 'Account already exist, please sign in'})

            //hashing user password for security sake
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPassword = await bcrypt.hash(password, salt)
            const hashedConfPassword = await bcrypt.hash(confPassword, salt)

            //Comparing confirm password and password
            if(hashedConfPassword !== hashedPassword) return done(null, false, {message: 'Passwords do not match'})

            // All users are automatically set to regular user
            const newUser = new Users({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                sex
            })

            //Get Kudus' email to set him as an admin

            if(email === 'abdulaiumar20@gmail.com') {
                newUser.isAdmin = true,
                newUser.canAccess = true
            }
            await newUser.save()
            done(null, newUser, {message: 'Singup successful'})
        } catch (err) {
            console.log(err)
        }
    })
)

module.exports = passport