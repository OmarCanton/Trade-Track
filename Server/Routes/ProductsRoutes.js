const { Router } = require('express')
const Products = require('../Config/Models/ProductsModels')
const History = require('../Config/Models/HistoryModel')
const Action = require('../Config/Models/ActionsModel')
const Users = require('../Config/Models/UserAuthModels')
const router = Router()

router.post('/addProduct' , async (req, res) => {
    const { name, category, quantity, price } = req.body
    try {
        if(!name) return res.json({success: false, error: 'Name required'})
        if(!category || category === 'None') return res.json({success: false, error: 'Select Category of the product'})
        if(!quantity) return res.json({success: false, error: 'Quantity required'})
        if(!price) return res.json({success: false, error: 'Price of product required'})

        const existingProduct = await Products.findOne({name, category})
        if(existingProduct) {
            res.json({success: false, error: 'Product already in the catalogue'})
        } else {
            const newProduct = new Products({
                name,
                category,
                quantity,
                price
            })
            await newProduct.save()
            res.json({success: true, newProduct, message: 'Item added to the Shop'})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/getAllProducts', async (req, res) => {
    try {
        const products = await Products.find({}).sort({createdAt: -1})
        if(products) res.json({success: true, products, total: products.length})
    } catch(err) {
        res.json({success: false, error: err})
    }
})
router.get('/getItemsTotal', async (req, res) => {
    try {
        const products = await Products.find()
        let total = 0
        products.forEach(product => {
            total += product.quantity
        })
        res.json({success: true, total})
    } catch(err) {
        res.json({success: false, error: err})
    }
})
router.get('/recentSelectedProducts', async (req, res) => {
    try {
        const recentProducts = await Products.find({}).sort({updatedAt: -1}).limit(5)
        if(recentProducts) res.json({success: true, recentProducts})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/searchProd/:name', async (req, res) => {
    const { name } = req.params
    try {
        const searchResults = await Products.find({ name: {$regex: name, $options: 'i'} })
        if(!searchResults) {
            res.json({msg: `No results for '${name}'`})
        } else{
            res.json({searchResults, name})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/fetchFilteredProducts/:filterKey', async (req, res) => {
    const { filterKey } = req.params
    try {
        const filteredResults = await Products.find({category: filterKey})
        if(!filteredResults) {
            res.json({msg: 'No results for this for this category'})
        } else {
            res.json({filteredResults})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/getTotalPriceIems', async (req, res) => {
    try {
        const products = await Products.find()
        if(products) {
            let tot_Price = 0;
            const totalPrice = products.map(product => product.quantity * product.price)
            for(let i = 0; i < totalPrice.length; i++) {
                tot_Price += totalPrice[i]
            }
            res.json({success: true, totalPrice: tot_Price})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    } 
})

router.post('/record', async (req, res) => {
    const { userId, name, quantity_sold, product_Id, product_price } = req.body
    try {
        const product = await Products.findById(product_Id)
        const today = new Date().toISOString().split('T')[0]
        if(product) {
            if (quantity_sold > product.quantity) return res.json({success: false, error: 'Quantity sold exceeds available stock!'})
            if(product.quantity === 0) return res.json({success: false, error: `${product.name} out of stock!`})
            product.quantity -= quantity_sold
            product.save()
            const findPrdHistory = await History.findOne({userId, name, category: product.category, date: today})
            if(findPrdHistory) {
                findPrdHistory.quantity += Number(quantity_sold)
                findPrdHistory.price += quantity_sold * product_price
                findPrdHistory.save()
            } else {
                const newHistory = new History({
                    userId,
                    name,
                    category: product.category,
                    quantity: quantity_sold,
                    price: quantity_sold * product_price,
                    status: 'Sold',
                    date: today
                })
                await newHistory.save()
            }

            res.json({success: true, message: 'Record made, Thank you!'})
        }
    } catch(err) {
        console.log(err) 
        res.json({success: false, error: err})
    }
})
router.get('/getHistory/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const history = await History.find({userId})
        const itemsSoldOverallArr = history.map(hist => hist.quantity)
        const amountOverallArr = history.map(hist => hist.price)
        let itemsSoldOverall = 0
        let amountOverall = 0
        itemsSoldOverallArr.forEach(item => {
            itemsSoldOverall += item
        })
        amountOverallArr.forEach(amount => {
            amountOverall += amount
        })
        res.json({success: true, history, itemsSoldOverall, amountOverall})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/todaySales/:userId', async (req, res) => {
    const { userId } = req.params
    const today = new Date().toISOString().split('T')[0]
    try {
        const history = await History.find({userId, date: today})
        if(history) {
            const quantitySoldArr = history.map(hist => hist.quantity)
            const amountObtainedArr = history.map(hist => hist.price)

            let quantitySold = 0
            let amountObtained = 0

            quantitySoldArr.forEach(quant => quantitySold += quant)
            amountObtainedArr.forEach(amount => amountObtained += amount)
            
            res.json({success: true, history, quantitySold, amountObtained})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/getWorkersHistory/:adminUserId', async (req, res) => {
    const { adminUserId } = req.params
    try {
        if(adminUserId) {
            const otherHistories = await History.aggregate([
                //excluding the admin's records
                { $match: {
                    userId: {$ne: adminUserId}
                }},
                //grouping with userIds
                { $group: {
                    _id: '$userId',
                    totalQuantity: {$sum: '$quantity'}, 
                    totalAmount: {$sum: '$price'}, 
                    // items: { $push: '$$ROOT'} this will include the rest of the fields which is not needed
                }},
                //convert the _id string field in the grouped object returned to mongoDB object Id
                { $addFields: {
                    userId: {
                        $toObjectId: "$_id"
                    }
                }},
                { $lookup: { 
                    from: 'users', //Name of the collection/model
                    localField: "userId", //Converted _id String ofthe grouped data into MongoDB objectId to match with the user model _id data type
                    foreignField: "_id", //Field you want to send as a query to the model to fetch its data
                    as: 'userProfile' //Field to save the data to in the grouped data 
                }},
                { $addFields: {
                    firstName: {
                        $arrayElemAt: ['$userProfile.firstName', 0] //Add field firstName and select any first object's fisrtname that matches the sent _id the lookup
                    },
                    lastName: {
                        $arrayElemAt: ['$userProfile.lastName', 0] //Add field lastname and select any first object's lastname that matches the sent _id the lookup
                    }
                }},
                { $project: {
                    userProfile: 0 //after everything, delete the object (userProfile) since it's not needed
                }}

            ])
            res.json({success: true, otherHistories})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    } 
})
router.get('/getWorkersTodaySales/:adminUserId', async (req, res) => {
    const { adminUserId } = req.params
    const today = new Date().toISOString().split('T')[0]
    try {
        if(adminUserId) {
            const otherHistories = await History.aggregate([
                { $match: {
                    userId: { $ne: adminUserId },
                    date: today
                }},
                { $group: {
                    _id: '$userId',
                    totalQuantity: {$sum: '$quantity'}, 
                    totalAmount: {$sum: '$price'}, 
                }},
                { $addFields: {
                    userId: {
                        $toObjectId: "$_id"
                    }
                }},
                { $lookup: { 
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id", 
                    as: 'userProfile'
                }},
                { $addFields: {
                    firstName: {
                        $arrayElemAt: ['$userProfile.firstName', 0]
                    },
                    lastName: {
                        $arrayElemAt: ['$userProfile.lastName', 0]
                    }
                }},
                { $project: {
                    userProfile: 0
                }}

            ])
            res.json({success: true, otherHistories})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    } 
})
//delete a record/history
router.post('/deleteHistory', async (req, res) => {
    const { userId, id, name, quantitySold, totalPrice, reason } = req.body
    const date = new Date().toDateString()
    try {
        const findUser = await Users.findById(userId)
        if(findUser.isAdmin === false && reason === '') {
            return res.json({success: false, error: 'Please provide a reason for the action'})
        }
        if(id) {
            const newAction = new Action({
                userId,
                action: 'deleted history',
                reason,
                name, 
                quantitySold, 
                totalPrice,
                date
            })
            await newAction.save()

            if(newAction) await History.findByIdAndDelete(id)

            res.json({success: true, message: 'History deleted'})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/deleteAllHistory', async (req, res) => {
    const { userId } = req.body
    const date = new Date().toDateString()
    try {
        const newAction = new Action({
            userId,
            action: 'deleted all history',
            reason: null,
            name: null,
            quantitySold: null,
            totalPrice: null,
            date
        })
        await newAction.save()
        if(newAction) {
            await History.deleteMany({userId})
            res.json({success: true, message: 'History Cleared'})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.get('/getActions/:userId', async (req, res) => {
    const { userId }= req.params
    try {
        const actions = await Action.aggregate([
            {$match: {
                userId: { $ne: userId }
            }},
            { $addFields: {
                userId: {
                    $toObjectId: "$userId"
                }
            }},
            { $lookup: { 
                from: 'users',
                localField: "userId",
                foreignField: "_id", 
                as: 'userProfile'
            }},
            { $addFields: {
                firstName: {
                    $arrayElemAt: ['$userProfile.firstName', 0]
                },
                lastName: {
                    $arrayElemAt: ['$userProfile.lastName', 0]
                }
            }},
            { $project: {
                userProfile: 0
            }}
        ])
        res.json({success: true, actions})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/deleteAllActions', async (req, res) => {
    try {
        const delActions = await Action.deleteMany()
        if(delActions) res.json({success: true, message: 'Actions Cleared'})
        else res.json({success: false, error: "Error deleting all actions"})
    } catch(err) {
        console.log(er)
        res.json({success: false, error: err})
    }
})
router.post('/deleteProduct', async (req, res) => {
    const { id } = req.body
    try {
        if(id) {
            const product = await Products.findByIdAndDelete(id)
            if(product) res.json({success: true, message: 'Item deleted from shop'})
        }
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})

router.get('/getTotalProductsAndSoldOnes', async (req, res) => {
    const today = new Date().toISOString().split('T')[0]
    try {
        const products = await Products.find()
        let total = 0
        products.forEach(product => {
            total += product.quantity
        })
        const quantitiesSold = await History.find({date: today})
        let sold_total = 0
        quantitiesSold.forEach(hist => {
            sold_total += hist.quantity
        })
        const totals = total + sold_total
        res.json({success: true, totals})
    } catch(err) {
        console.log(err)
        res.json({success: false, error: err})
    }
})
router.post('/updateProduct', async (req, res) => {
    const { itemsUpdate_id, itemsUpdate_quantity } = req.body
    try {
        const product = await Products.findById(itemsUpdate_id)
        if(!product) {
            return res.json({success: false, message: 'Item not found!'})
        }
        if(itemsUpdate_quantity === 0) {
            return res.json({success: false, message: 'Update error: quantity cannot be 0!'})    
        }
        product.quantity += Number(itemsUpdate_quantity)
        product.save()
        res.json({success: true, message: 'Update successful!'})
    } catch(err) {
        console.log(err)
    }
})
module.exports = router