const Products = require("../Config/Models/Products")
const Users = require("../Config/Models/User")
const History = require('../Config/Models/History')
const Action = require('../Config/Models/Actions')
const { default: mongoose } = require("mongoose")


const addProduct = async (req, res) => {
    const { name, category, quantity, price } = req.body
    try {
        if(!name) return res.status(400).json({ message: 'Name required' })
        if(!category || category === 'None') return res.status(400).json({ message: 'Select Category of the product' })
        if(!quantity) return res.status(400).json({ message: 'Quantity required' })
        if(!price) return res.status(400).json({ message: 'Price of product required' })

        const existingProduct = await Products.findOne({name, category})
        if(existingProduct) {
            res.sttaus(409).json({ message: 'Product already in the catalogue' })
        } else {
            const newProduct = new Products({
                name,
                category,
                quantity,
                price
            })
            await newProduct.save()
                res.status(201).json({ newProduct, message: 'Item added to Shop'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Products.find({}).sort({createdAt: -1})
        if(products) res.status(200).json({ products, total: products.length})
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const get_total_items = async (req, res) => {
    try {
        const products = await Products.find()
        let total = 0
        products.forEach(product => {
            total += product.quantity
        })
        res.status(200).json({total})
    } catch(err) {
        console.error(err)
        res.status(500).json({message: err?.message })
    }
}
const recentlySelectedItems = async (req, res) => {
    try {
        const recentProducts = await Products.find({}).sort({updatedAt: -1}).limit(5)
        if(recentProducts) res.status(200).json({ recentProducts })
    } catch(err) {
        console.error(err)
        res.json({ message: err?.message })
    }
}
const searchProduct = async (req, res) => {
    const { name } = req.params
    try {
        const searchResults = await Products.find({ name: {$regex: name, $options: 'i'} })
        if(!searchResults) {
            res.status(404).json({message: `No results for '${name}'`})
        } else{
            res.status(200).json({searchResults, name})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const filterProducts = async (req, res) => {
    const { filterKey } = req.params
    try {
        const filteredResults = await Products.find({category: filterKey})
        if(!filteredResults) {
            res.status(404).json({ message: 'No results for this for this category'})
        } else {
            res.status(200).json({filteredResults})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const total_price_items = async (req, res) => {
    try {
        const products = await Products.find()
        if(products) {
            let tot_Price = 0;
            const totalPrice = products.map(product => product.quantity * product.price)
            for(let i = 0; i < totalPrice.length; i++) {
                tot_Price += totalPrice[i]
            }
            res.status(200).json({totalPrice: tot_Price})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    } 
}
const record_sales = async (req, res) => {
    const { name, quantity_sold, product_Id, product_price } = req.body
    try {
        const product = await Products.findById(product_Id)
        const today = new Date().toISOString().split('T')[0]
        if(product) {
            if (quantity_sold > product.quantity) return res.status(409).json({ message: 'Quantity sold exceeds available stock!' })
            if(product.quantity === 0) return res.status(400).json({ message: `${product.name} out of stock!` })
            product.quantity -= quantity_sold
            product.save()
            const findPrdHistory = await History.findOne({userId: req.user._id, name, category: product.category, date: today})
            if(findPrdHistory) {
                findPrdHistory.quantity += Number(quantity_sold)
                findPrdHistory.price += quantity_sold * product_price
                findPrdHistory.save()
            } else {
                const newHistory = new History({
                    userId: req.user._id,
                    name,
                    category: product.category,
                    quantity: quantity_sold,
                    price: quantity_sold * product_price,
                    status: 'Sold',
                    date: today
                })
                await newHistory.save()
            }
            res.status(200).json({ message: 'Sales Recorded, Thank you!' })
        }
    } catch(err) {
        console.error(err) 
        res.status(500).json({ message: err?.message })
    }
}
const get_history = async (req, res) => {
    const userId = req.user._id
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
        res.status(200).json({history, itemsSoldOverall, amountOverall})
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const get_history_worker_btn_press_check = async (req, res) => {
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
        res.status(200).json({history, itemsSoldOverall, amountOverall})
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const todays_sales = async (req, res) => {
    const userId = req.user._id
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
            
            res.status(200).json({history, quantitySold, amountObtained})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const todays_sales_worker_btn_press_check = async (req, res) => {
    const { userId } = req.params
    const today = new Date().toISOString().split('T')[0]
    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid user" })
        const history = await History.find({userId, date: today})
        if(history) {
            const quantitySoldArr = history.map(hist => hist.quantity)
            const amountObtainedArr = history.map(hist => hist.price)

            let quantitySold = 0
            let amountObtained = 0

            quantitySoldArr.forEach(quant => quantitySold += quant)
            amountObtainedArr.forEach(amount => amountObtained += amount)
            
            res.status(200).json({history, quantitySold, amountObtained})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const worker_history = async (req, res) => {
    const { _id } = req.user 
    try {
        if(_id) {
            const otherHistories = await History.aggregate([
                //excluding the admin's records
                { $match: {
                    userId: {$ne: _id}
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
            res.status(200).json({ otherHistories })
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message})
    } 
}
const get_worker_todays_history = async (req, res) => {
    const { _id } = req.user
    const today = new Date().toISOString().split('T')[0]
    try {
        if(_id) {
            const otherHistories = await History.aggregate([
                { $match: {
                    userId: { $ne: _id },
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
            res.status(200).json({ otherHistories })
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    } 
}
const delete_history = async (req, res) => {
    const { _id } = req.user
    const { id, name, quantitySold, totalPrice, reason } = req.body
    const date = new Date().toDateString()
    try {
        const user = await Users.findById(_id)
        if(!user) return res.status(404).json({ message: 'User not found'})
        if(user.role !== 'admin' && reason === '') {
            return res.status(401).json({ message: 'Please provide a reason for the action'})
        }
        if(id) {
            const newAction = new Action({
                userId: user._id,
                action: 'deleted history',
                reason,
                name, 
                quantitySold, 
                totalPrice,
                date
            })
            await newAction.save()

            if(newAction) await History.findByIdAndDelete(id)

            res.status(200).json({ message: 'History deleted'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message})
    }
}
const delete_all_history = async (req, res) => {
    const id = req.user._id
    const date = new Date().toDateString()
    try {
        const user = await Users.findById(id)
        if(!user) return res.status(404).json({ message: 'User not found'})
        const newAction = new Action({
            userId: id,
            action: 'deleted all history',
            reason: null,
            name: null,
            quantitySold: null,
            totalPrice: null,
            date
        })
        await newAction.save()
        if(newAction) {
            await History.deleteMany({userId: id})
            res.status(200).json({ message: 'History Cleared'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const get_actions = async (req, res) => {
    const id = req.user._id
    try {
        const actions = await Action.aggregate([
            {$match: {
                userId: { $ne: id }
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
        res.status(200).json({ actions })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const delete_all_actions = async (req, res) => {
    try {
        const delActions = await Action.deleteMany()
        if(delActions) res.status(200).json({ message: 'Actions Cleared' })
        else res.status(400).json({ message: "Error deleting all actions" })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const delete_product = async (req, res) => {
    const { id } = req.body
    try {
        if(id) {
            const product = await Products.findByIdAndDelete(id)
            if(product) res.status(200).json({ message: 'Item deleted from shop' })
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}
const total_products_and_sold_ones = async (req, res) => {
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
        res.status(200).json({ totals })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: err?.message })
    }
}
const update_product = async (req, res) => {
    const { itemsUpdate_id, itemsUpdate_quantity } = req.body
    try {
        const product = await Products.findById(itemsUpdate_id)
        if(!product) {
            return res.status(404).json({ message: 'Item not found!' })
        }
        if(itemsUpdate_quantity === '0') return res.status(400).json({ message: 'Quantity cannot be 0' })
        product.quantity += Number(itemsUpdate_quantity)
        await product.save()
        res.status(200).json({itemsUpdate_quantity, message: 'Update successful!' })
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: err?.message })
    }
}

module.exports = {
    addProduct,
    getProducts,
    get_total_items,
    recentlySelectedItems,
    searchProduct,
    filterProducts,
    total_price_items,
    record_sales,
    get_history,
    get_history_worker_btn_press_check,
    todays_sales,
    todays_sales_worker_btn_press_check,
    worker_history,
    get_worker_todays_history,
    delete_history,
    delete_all_history,
    get_actions,
    delete_all_actions,
    delete_product,
    total_products_and_sold_ones,
    update_product,
}