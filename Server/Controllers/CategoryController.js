const Categories = require('../Config/Models/Category')

const getCategories = async (req, res) => {
    try {
        const categories = await Categories.find()
        res.status(200).json({categories})
    } catch(err) {
        console.error(err)
        res.status(200).json({ message: err?.message })
    }
}

const add_new_category = async (req, res) => {
    const { cat_name } = req.body
    try {
        if(cat_name === '') return res.status(400).json({ message: 'Field is empty' })
        const existingCat = await Categories.findOne({ name: cat_name })
        if(existingCat) return res.status(409).json({ message: 'Category already exist' })

        const newCategory = new Categories({
            name: cat_name
        })
        await newCategory.save()
        res.status(200).json({ message: 'Saved successfully' })
    } catch(err) {
        console.error(err)
        res.json({ message: err?.message})
    }
}

const deleteCategory = async (req, res) => {
    const { cat_name_del } = req.body
    try {
        if(cat_name_del === '') return res.status(400).json({ message: 'Field is empty'})
        const delCat = await Categories.findOne({name: cat_name_del})
        if(!delCat) return res.status(404).json({ message: `Category ${cat_name_del} not found`})
        await Categories.deleteOne({name: cat_name_del})
        res.status(200).json({ message: 'Category removed'})
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err})
    }
}

module.exports = {
    getCategories,
    add_new_category,
    deleteCategory
}