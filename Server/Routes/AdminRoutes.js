const { Router } = require('express')
const Users = require('../Config/Models/UserAuthModels')
const router = Router()

router.get('/getAllEmployees/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const users = await Users.find({_id: {$ne: userId}})
        if(users) {
            res.json({success: true, users})
        }
    } catch(err) {
        consoel.log(err)
        res.json({error: err})
    }
})
router.post('/grantAccess', async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findById(id)
        if(user) {
            user.canAccess = true
            user.save()
        }
        res.json({success: true, message: `Access granted to ${user.firstName}`})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/removeAccess', async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findById(id)
        if(user) {
            user.canAccess = false
            user.save()
        }
        res.json({success: true, message: `Access denied to ${user.firstName}`})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/delAcc', async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findByIdAndDelete(id)
        if(user) {
            res.json({success: true, message: 'Account removed successfully' })
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
module.exports = router