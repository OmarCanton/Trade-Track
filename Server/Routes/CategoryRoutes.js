const { Router }  = require('express')
const { 
    getCategories, 
    add_new_category, 
    deleteCategory 
} = require('../Controllers/CategoryController')
const { verifyToken, verifyRole } = require('../Utils/verifyToken')

const router = Router()

router.get('/getAllCategory', verifyToken, getCategories)
router.post('/addCategory', verifyToken, verifyRole(['admin']), add_new_category)
router.post('/deleteCategory', verifyToken, verifyRole(['admin']), deleteCategory)


module.exports = router