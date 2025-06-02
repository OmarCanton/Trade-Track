const { Router } = require('express')
const { 
    getAllEmployees, 
    grantAccessToWorkers,
    revokeAccess,
    deleteWorkerAccount,
} = require('../Controllers/AdminController')
const { verifyToken, verifyRole } = require('../Utils/verifyToken')

const router = Router()

router.get('/getAllEmployees', verifyToken, verifyRole(['admin']), getAllEmployees)
router.post('/grantAccess', verifyToken, verifyRole(['admin']), grantAccessToWorkers)
router.post('/removeAccess', verifyToken, verifyRole(['admin']), revokeAccess)
router.post('/delAcc', verifyToken, verifyRole(['admin']), deleteWorkerAccount)

module.exports = router