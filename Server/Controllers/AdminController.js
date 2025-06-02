const Users = require("../Config/Models/User")

const getAllEmployees = async (req, res) => {
    const id = req.user._id
    try {
        const users = await Users.find({_id: {$ne: id}})
        if(users) {
            res.status(200).json({users})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message})
    }
}

const grantAccessToWorkers = async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findById(id)
        if(user) {
            user.canAccess = true
            user.save()
        }
        res.status(200).json({ message: `Access granted to ${user.firstName}`})
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const revokeAccess = async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findById(id)
        if(user) {
            user.canAccess = false
            user.save()
        }
        res.status(200).json({ message: `Access denied to ${user.firstName}` })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const deleteWorkerAccount = async (req, res) => {
    const { id } = req.body
    try {
        const user = await Users.findByIdAndDelete(id)
        if(user) {
            res.status(200).json({ message: 'Account removed successfully' })
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err })
    }
}

module.exports = {
    getAllEmployees,
    grantAccessToWorkers,
    revokeAccess,
    deleteWorkerAccount,
}