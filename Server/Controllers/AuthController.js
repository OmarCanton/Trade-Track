const bcrypt = require('bcrypt')
const sendMails = require('../Utils/sendMail')
const Users = require('../Config/Models/User')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { generateToken } = require('../Utils/token')


//signup and send otp-code
const signup = async (req, res) => {
    const { email, password, firstName, lastName, confPassword, sex } = req.body
    try {
        if(!firstName) return res.status(400).json({ message: 'Your First Name is required' })
        if(!lastName) return res.status(400).json({ message: 'Your Last Name is required' })
        if(!confPassword) return res.status(400).json({ message: 'Confirm password' })
        if(!sex || sex === 'none') return res.status(400).json({ message: 'Your Gender is required' })

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
        if(!passwordRegex.test(password)) {
            return res.status(409).json({message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' })
        }

        //taking care of already existing credentials at signup
        const existingAcc = await Users.findOne({email})
        if(existingAcc) return res.status(400).json({ message: 'Account already exist, please sign in' })

        //hashing user password for security sake
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedConfPassword = await bcrypt.hash(confPassword, salt)

        //Comparing confirm password and password
        if(hashedConfPassword !== hashedPassword) return res.status(409).json({message: 'Passwords do not match'})

        // All users are automatically set to workers
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            sex
        })

        //Get Kudus' email to set him as an admin

        if(email.toLowerCase() === 'abdulkudus427@gmail.com' || email.toLowerCase() === 'abdulaiumar20@gmail.com') {
            newUser.role = 'admin'
            newUser.canAccess = true
        }

        //generate the random code for verification
        //generate 6-digit random code
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString()

        //hashing the random code
        const rand_saltRounds = 10
        const rand_salt = await bcrypt.genSalt(rand_saltRounds)
        const code = await bcrypt.hash(randomCode, rand_salt)

        newUser.verificationCode = code
        newUser.verificationCodeExpire = Date.now() + 5 * 60 * 1000 //Store token for 5 minutes

        //save the user for successful registration
        await newUser.save()
    
        await sendMails(newUser, res, randomCode)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const verifyCode = async (req, res) => {
    const {id} = req.params
    const { otpCode } = req.body

    try {
        const findUser = await Users.findById(id)

        if(!findUser) return res.status(404).json({message: 'User not found, please sign up'})
        
        const isCodeEqual = await bcrypt.compare(otpCode, findUser.verificationCode)

        const codeNotExpired = findUser.verificationCodeExpire > Date.now()
        if(isCodeEqual && codeNotExpired) {
            findUser.verificationCode = undefined
            findUser.verificationCodeExpire = undefined
            findUser.isAuthenticated = true
            await findUser.save()
            res.status(200).json({message: 'Sign Up successful, sign in now'})
        } else {
            return res.status(400).json({message: 'Invalid or expired code'})
        }
    } catch (err) {
        res.status(500).json({ message: err?.message })
    }
} 

const resend_verification_code = async (req, res) => {
    const { id } = req.params
    try {
        const user = await Users.findById(id)
        if(!user) return res.json({success: false, error: 'User not found'})

        //generate code for user
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString()
        //hashing the random code
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const code = await bcrypt.hash(randomCode, salt)

        user.verificationCode = code
        user.verificationCodeExpire = Date.now() + 5 * 60 * 1000 //Store token for 5 minutes
        await user.save()

        await sendMails(user, res, randomCode)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        if(!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await Users.findOne({ email })
        if(!user) return res.status(404).json({ message: 'User not found, please register' })
        
        const checkPass = await bcrypt.compare(password, user.password)
        if(!checkPass) return res.status(409).json({ message: 'Incorrect Password entered' })
        
        if(!user.isAuthenticated) return res.status(401).json({isAuth: false,  message: 'Please verify your account to login'})

        const token = generateToken(user)

        const loggedInUser = await Users.findOne({ email: user.email }).lean().select('-password')
        
        res.status(200).json({ token, user: loggedInUser, message: `Welcome ${user.firstName}` })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const forgot_password = async (req, res) => {
    const { resetEmail } = req.body
    try {
        if(!resetEmail || resetEmail === '' || resetEmail === null) return res.status(400).json({ message: 'Enter email' })
        const user = await Users.findOne({email: resetEmail})
        if(!user) return res.status(404).json({ message: 'User not found' })
        
        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        user.resetPasswordToken = hashedToken
        user.resetPasswordTokenExpires = Date.now() + 3600000
        await user.save()

        //send mail
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'campusgadgetshub@gmail.com',
                pass: process.env.PASS
            }
        })

        const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`
        const  message = `<h2>You requested for a password reset, click on the link below to reset password, expires in 1 hour</h2><a href=${resetUrl}>Click Here to reset password</a>`

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset',
                html: message
            })
            res.status(200).json({message: 'Reset link sent to your email'}) 
        } catch (err) {
            user.resetPasswordToken = undefined
            user.resetPasswordTokenExpires = undefined
            await user.save()
            res.status(401).json({success: false, error: 'Reset link could not be sent, try again'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const reset_password = async () => {
    const { token } = req.params
    const { newPassword, confNewPassword } = req.body
    
    try {
        if(!newPassword) return res.status(400).json({ message: 'Password required' })
        if(!confNewPassword) return res.status(400).json({ message: 'Confirm new password' })

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await Users.findOne({
            resetPasswordToken: hashedToken, 
            resetPasswordTokenExpires: { $gt: Date.now() }
        })

        if(!user) return res.status(404).json({ message: 'Invalid or expired token' })
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
        if(!passwordRegex.test(newPassword)) {
            return res.status(401).json({ message: 'Password must contain at least a uppercase, a number, a special character and must be at least 8 characters long ' })
        }

        if(newPassword !== confNewPassword) {
            return res.status(409).json({ message: 'Passwords do not match' })
        }

        const compareWithExistingForgottenPassword = await bcrypt.compare(newPassword, findUser.password) 
        if(compareWithExistingForgottenPassword) return res.status(400).json({ message: 'You recently used this password, choose a different one'})

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const newUserPassword = await bcrypt.hash(newPassword, salt)
        user.password = newUserPassword
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpires = undefined

        await user.save()
        
        res.status(200).json({ message: 'Password reset successful, please login' })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: err?.message })
    }
}
const can_access = async (req, res) => {
    const { _id } = req.user
    try {
        const user = await Users.findById(_id)
        if(!user) return res.status(404).json({ message: 'User not found '})
        
        res.status(200).json({ canAccess: user.canAccess })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

module.exports = {
    signup,
    verifyCode,
    resend_verification_code,
    signin,
    forgot_password,
    reset_password,
    can_access
}