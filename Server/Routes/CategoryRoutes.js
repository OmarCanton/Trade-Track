const { Router }  = require('express')
const Category = require('../Config/Models/CategoryModel')
const router = Router()

router.get('/getAllCategory', async (req, res) => {
    try {
        const categories = await Category.find()
        res.json({success: true, categories})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/newCategory', async (req, res) => {
    const { cat_name } = req.body
    try {
        if(cat_name === '') return res.json({success: false, error: 'Field is empty'})
        const existingCat = await Category.findOne({name: cat_name})
        if(existingCat) return res.json({success: false, error: 'Category already exist'})

        const newCategory = new Category({
            name: cat_name
        })
        await newCategory.save()
        res.json({success: true, message: 'Saved successfully'})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})

router.post('/deleteCategory', async (req, res) => {
    const { cat_name_del } = req.body
    try {
        if(cat_name_del === '') return res.json({success: false, error: 'Field is empty'})
        const delCat = await Category.findOne({name: cat_name_del})
        if(!delCat) return res.json({success: false, error: `Category ${cat_name_del} not found`})
        await Category.deleteOne({name: cat_name_del})
        res.json({success: true, message: 'Category removed'})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})


module.exports = router