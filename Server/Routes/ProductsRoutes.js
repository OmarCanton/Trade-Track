const { Router } = require('express')
const { 
    addProduct, 
    getProducts, 
    get_total_items, 
    recentlySelectedItems, 
    searchProduct,
    filterProducts,
    total_price_items,
    record_sales,
    get_history,
    todays_sales,
    worker_history,
    delete_history,
    delete_all_history,
    delete_product,
    delete_all_actions,
    get_actions,
    total_products_and_sold_ones,
    update_product,
    get_worker_todays_history,
    todays_sales_worker_btn_press_check,
    get_history_worker_btn_press_check,
} = require('../Controllers/ProductsController')
const { verifyToken, verifyRole } = require('../Utils/verifyToken')

const router = Router()

router.post('/addProduct', verifyToken, verifyRole(['admin']), addProduct)
router.get('/getAllProducts', verifyToken, getProducts)
router.get('/getItemsTotal', verifyToken, get_total_items)
router.get('/recentSelectedProducts', verifyToken, recentlySelectedItems)
router.get('/searchProd/:name', verifyToken, searchProduct)
router.get('/fetchFilteredProducts/:filterKey', verifyToken, filterProducts)
router.get('/getTotalPriceIems', verifyToken, total_price_items)
//records
router.post('/record', verifyToken, record_sales)
router.get('/getHistory', verifyToken, get_history) //for overall sales and items sold(all users)
router.get('/worker_check_getHistory_btn_press/:userId', verifyToken, verifyRole(['admin']), get_history_worker_btn_press_check) //works exactly the same as above route but for fetching a worker history for the admin in tabular form (only had at the admin dashboard)
router.get('/todaySales', verifyToken, todays_sales) //for today's sales ands items sold today (all users)
router.get('/worker_check_todaySales_btn_press/:userId', verifyToken, verifyRole(['admin']), todays_sales_worker_btn_press_check) //works exactly the same as above route but for fetching a worker history for the admin in tabular form (at the admin dashboard only)
router.get('/getWorkersHistory', verifyToken, verifyRole(['admin']), worker_history) //for worker's overall sales and items sold
router.get('/getWorkersTodaySales', verifyToken, verifyRole(['admin']), get_worker_todays_history) //for workers today's sales and items sold today
//delete a record/history
router.post('/deleteHistory', verifyToken, delete_history) //add verifyToken
router.post('/deleteAllHistory', verifyToken, delete_all_history) //Add verifyToken
router.get('/getActions', verifyToken, verifyRole(['admin']), get_actions) //verifyToken and verifyrole
router.post('/deleteAllActions', verifyToken, verifyRole(['admin']), delete_all_actions) //add all
router.post('/deleteProduct', verifyToken, verifyRole(['admin']), delete_product) //add all

router.get('/getTotalProductsAndSoldOnes', verifyToken, total_products_and_sold_ones)
router.post('/updateProduct', verifyToken, verifyRole(['admin']), update_product) //add all


module.exports = router