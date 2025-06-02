const { Router } = require('express')
const { 
    signup, 
    verifyCode, 
    resend_verification_code, 
    signin, 
    forgot_password, 
    reset_password, 
    can_access
} = require('../Controllers/AuthController')
const { verifyToken } = require('../Utils/verifyToken')

const router = Router()

router.post('/auth/register-send-code', signup)

router.post('/auth/register-verify-code/:id', verifyCode)

router.post('/auth/resend-code/:id', resend_verification_code)

router.post('/auth/signin', signin)

router.post('/forgot-password', forgot_password)

router.post('/reset-password/:token', reset_password)

router.get('/can_access', verifyToken, can_access)

module.exports = router