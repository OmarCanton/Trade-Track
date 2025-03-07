import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserCredsContext, themesContext } from "../../Context/UserCredsContext"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import '../Dashboards/Dashboard.css'
import { RiArrowDropDownFill, RiArrowLeftLine, RiCheckFill, RiCloseFill } from "react-icons/ri"
import { CiUser } from "react-icons/ci"
import { DeleteForeverRounded, RefreshRounded } from '@mui/icons-material'
import { CircularProgress } from "@mui/material"
import { motion } from 'framer-motion'
import Panel from "../../Components/Panel";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import ScrollToTop from "../../Components/ScrollToTop"

export default function Dashboard() {
    const { userId, isAdmin } = useContext(UserCredsContext)
    const { themeStyles, theme } = useContext(themesContext)
    const [employees, setEmployees]  = useState([])
    const [itemsTotal, setItemsTotal] = useState(null)
    const [itemsTotalPrice, setItemsTotalPrice] = useState(null)
    const [grantingAcc, setGrantingAcc] = useState(null)
    const [denyingAcc, setDenyingAcc] = useState(null)
    const [deletingAcc, setDeletingAcc] = useState(null)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const navigate = useNavigate()
    const [cat_name, setCat_name] = useState('')
    const [cat_name_del, setCat_name_del] = useState('')
    const catInputRef = useRef()
    const delCatInputRef = useRef()
    const [categories, setCategories] = useState([])
    const [categoryAltered, setCategoryAltered] = useState(false)
    const [productAdded, setProductAdded] = useState(false)
    const [itemsSold_today, setItemsSold_today] = useState(null)
    const [salesMade_today, setSalesMade_today] = useState(null)
    const [overallItemsSold, setOverallItemsSold] = useState(null)
    const [amountOverall, setAmountOverall] = useState(null)
    const [workerSales_admin, setWorkerSales_admin] = useState([])
    const [workerSales_today_admin, setWorkerSales_today_admin] = useState([])
    const [actions, setActions] = useState([])
    const [actionsCleared, setActionsCleared] = useState(false)
    const [showSales, setShowSales] = useState(true)
    const [showShopMgt, setShowShopMgt] = useState(true)
    const [showWorkersMgt, setShowWorkersMgt] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [enableRefreshRot, setEnablerefreshRot] = useState(false)
    const [totalItemsPlusSold, setTotalItemsPlusSold] = useState()
    const [scroll, setScroll] = useState(true)
    const nameRef = useRef()
    const quantityRef = useRef()
    const priceRef = useRef()
    const [addingPrd, setAddingPrd] = useState(false)
    const [addingCat, setAddingCat] = useState(false)
    const [deletingCat, setDeletingCat] = useState(false)
    const [loadingSales, setLoadingSales] = useState(false)
    const [loadingWorkers_data, setLoadingWorkers_data] = useState(false)
    const [loadingShopItems, setLoadingShopItems] = useState(false)
    const [gettingEmployees, setGettingEmployees] = useState(false)

    useEffect(() => {
        if(window.scrollY === 0) {
            setScroll(false)
        } else {
            setScroll(true)
        }
        window.addEventListener('scroll', () => {
            if(window.scrollY === 0) {
                setScroll(false)
            } else {
                setScroll(true)
            }
        })
    }, [scroll])

    const salesTarget = 1000
    const percentage_salesToday = Number(salesMade_today / salesTarget) * 100
    const percentage_items_Sold = (Number(itemsSold_today) / Number(totalItemsPlusSold)) * 100

    useEffect(() => {
        const getTotalGoods = async () => {
            setLoadingShopItems(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getItemsTotal`)
                if(response.data.success) {
                    setItemsTotal(response.data.total)
                    setLoadingShopItems(false)
                }
            } catch (err) {
                console.log(err)
                setLoadingShopItems(false)
            }
        }
        const getTotalPrices = async () => {
            setLoadingShopItems(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTotalPriceIems`)
                if(response.data.success) {
                    setItemsTotalPrice(response.data.totalPrice)
                    setLoadingShopItems(false)
                }
            } catch(err) {
                console.log(err)
                setLoadingShopItems(false)
            }
        }
        const getTodaysSales = async () => {
            setLoadingSales(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/todaySales/${userId}`)
                setItemsSold_today(response.data.quantitySold)
                setSalesMade_today(response.data.amountObtained)
                setLoadingSales(false)
            } catch(err) {
                console.log(err)
                setLoadingSales(false)
            }
        }
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getHistory/${userId}`)
                if(response.data.success) {
                    setOverallItemsSold(response.data.itemsSoldOverall)
                    setAmountOverall(response.data.amountOverall)
                }
            } catch(err) {
                console.log(err)
            }
        }
        const workerSalesForAdmin = async () => {
            setLoadingWorkers_data(true)
            try {
                if(isAdmin) {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getWorkersHistory/${userId}`)
                    if(response.data.success) {
                        setWorkerSales_admin(response.data.otherHistories)
                        setLoadingWorkers_data(false)    
                    }
                }
            } catch(err) {
                console.log(err)
                setLoadingWorkers_data(false)
            }
        }
        const workerSalesTodayForAdmin = async () => {
            setLoadingWorkers_data(true)
            try {
                if(isAdmin) {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getWorkersTodaySales/${userId}`)
                    if(response.data.success) {
                        setWorkerSales_today_admin(response.data.otherHistories)
                        setLoadingWorkers_data(false)
                    }
                }
            } catch(err) {
                console.log(err)
                setLoadingWorkers_data(false)
            }
        }
        const fetchActions = async () => {
            try {
                if(isAdmin) {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getActions/${userId}`)
                    setActions(response.data.actions)
                }
            } catch(err) {
                console.log(err)
            }
        }
        const fetchTheTotals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTotalProductsAndSoldOnes`)
                setTotalItemsPlusSold(response.data.totals)
            } catch(err) {
                console.log(err)
            }
        }
        fetchTheTotals()
        fetchActions()
        workerSalesForAdmin()
        workerSalesTodayForAdmin()
        fetchHistory()
        getTotalGoods()
        getTotalPrices()
        getTodaysSales()
    }, [productAdded, userId, isAdmin, actionsCleared, refresh])

    useEffect(() => {
        const fetchEmployees = async () => {
            setGettingEmployees(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllEmployees/${userId}`)
                if(response.data.success) {
                    setEmployees(response.data.users)
                    setGettingEmployees(false)
                }
            } catch(err) {
                console.log(err)
                setGettingEmployees(false)
            }
        }
        fetchEmployees()
    }, [userId, grantingAcc, denyingAcc, deletingAcc, refresh])

    const grantAccess = async (id) => {
        setGrantingAcc(id)
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/grantAccess`, {id})
            if(response.data.success) {
                toast.success(response.data.message)
            }
            setGrantingAcc(null)
        } catch(err) {
            console.log(err)
            setGrantingAcc(null)
        }
    }

    const removeAccess = async (id) => {
        setDenyingAcc(id)
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/removeAccess`, {id})
            if(response.data.success) {
                toast.success(response.data.message)
            }
            setDenyingAcc(null)
        } catch(err) {
            console.log(err)
            setDenyingAcc(null)
        }
    }

    const deleteAccount = async (id) => {
        setDeletingAcc(id)
        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delAcc`, {id})
            if(response.data.success) {
                toast.success(response.data.message)
            }
            setDeletingAcc(null)
        } catch(err) {
            console.log(err)
            setDeletingAcc(null)
        }
    }

    const productData = {
        name,
        category,
        quantity,
        price
    }
    const addProduct = async (e) => {
        e.preventDefault()
        setAddingPrd(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addProduct`, productData)
            if(response.data.success) {
                toast.success(response.data.message)
                setProductAdded(prevState => !prevState)
                setName('')
                setQuantity('')
                setPrice('')
                nameRef.current.value = ''
                quantityRef.current.value = ''
                priceRef.current.value = ''
                setAddingPrd(false)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
                setAddingPrd(false)
            }
        } catch (err) {
            console.log(err)
            setAddingPrd(false)
        }
    }

    const addCategory = async (e) => {
        e.preventDefault()
        setAddingCat(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newCategory`, {cat_name})
            if(response.data.success) {
                toast.success(response.data.message)
                setCat_name('')
                catInputRef.current.value = ''
                setCategoryAltered(prevState => !prevState)
                setAddingCat(false)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
                setAddingCat(false)
            }
        } catch(err) {
            console.log(err)
            setCat_name('')
            catInputRef.current.value = ''
            setAddingCat(false)
        }
    }
    const deleteCategory = async (e) => {
        e.preventDefault()
        setDeletingCat(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteCategory`, {cat_name_del})
            if(response.data.success) {
                toast.success(response.data.message)
                setCat_name_del('')
                delCatInputRef.current.value = ''
                setCategoryAltered(prevState => !prevState)
                setDeletingCat(false)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
                setDeletingCat(false)
            }
        } catch(err) {
            console.log(err)
            setCat_name_del('')
            delCatInputRef.current.value = ''
            setDeletingCat(false)
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllCategory`)
            setCategories(response.data.categories)
        }
        fetchCategories()
    }, [categoryAltered, refresh])

    const fetchWorkerTodayHistory = async (userId, firstName, lastName) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/todaySales/${userId}`)
            if(response.data.success) {
                const history  = response.data.history
                navigate('/worker_history', { state: {history, firstName, lastName}})
            }
        } catch(err) {
            console.log(err)
        }
    }
    const fetchWorkerHistory = async (userId, firstName, lastName) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getHistory/${userId}`)
            if(response.data.success) {
                const history  = response.data.history
                navigate('/worker_history', { state: {history, firstName, lastName}})
            }
        } catch(err) {
            console.log(err)
        }
    }

    const clearActions = async (e) => {
        e.preventDefault()
        try {
            const  response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteAllActions`)
            if(response.data.success) { 
                toast.success(response.data.message)
                setActionsCleared(prevState => !prevState)
            }
            if(response.data.success === false) toast.error(response.data.error)
        } catch(err) {
            console.log(err)
        }
    }
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount)
    }
    const refreshScreen = () => {
        setRefresh(prevState => !prevState)
        setEnablerefreshRot(true)
        setTimeout(() => {
            setEnablerefreshRot(false)
        }, 500)
    }

    return (
        <div 
            className="dashoard-wrapper"
            style={{...themeStyles.style}}
        >
            <motion.div 
                className="header-dashboard"
                initial={{y: '10%', opacity: 0}}
                animate={{y:0, opacity: 1}}
                exit={{y: '10%', opacity: 0, transition: {
                    delay: 0.2
                }}}
                transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
            >
                <div className="left" onClick={() => navigate('/')}>
                    <RiArrowLeftLine size={30} cursor={'pointer'}/>
                    <span className="pageName">Dashboard</span>
                </div>
                {window.innerWidth > 768 &&
                    <Panel />
                }
                <RefreshRounded 
                    className="refresh"
                    onClick={() => refreshScreen()}
                    style={{...enableRefreshRot && {animation: 'refresh 0.5s alternate'}}}
                />
            </motion.div>
            {/* sales section general */}
            <div className="allSales">
                <div className="left-sales">
                    <motion.div 
                        className="sales"
                        initial={{y: '10%', opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: '10%', opacity: 0, transition: {
                            delay: 0.2
                        }}}
                        transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                    >
                        <span className="header">
                            Sales Metrics&nbsp;{isAdmin && <h3 className="you" style={{display: !showSales && 'none'}}>(You)</h3>} &nbsp;
                            <RiArrowDropDownFill size={30} 
                                onClick={() => setShowSales(prevState => !prevState)} 
                                className="dropDown"
                                style={
                                    {...!showSales && {transform: 'rotate(180deg)'}, 
                                    transition: 'all 0.2s'}
                                }
                            />
                        </span>
                        <div className="sales-body" style={{display: !showSales && 'none'}}>
                            <div 
                                className="itemsSoldToday"
                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                            >
                                <h3>Items Sold Today</h3>
                                <div className="indicator">
                                    {loadingSales ? 
                                        <CircularProgress />
                                        :
                                        itemsSold_today
                                    }
                                    </div>
                            </div>
                            <div 
                                className="totalSalesToday"
                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                            >
                                <h3>Sales Made Today</h3>
                                <div className="indicator">
                                {loadingSales ? 
                                    <CircularProgress />
                                    :
                                    formatAmount(salesMade_today)
                                }
                                </div>
                            </div>
                            <div 
                                className="itemsSoldOverall"
                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                            >
                                <h3>Items Sold (Overall)</h3>
                                <div className="indicator">
                                    {loadingSales ? 
                                        <CircularProgress />
                                        :
                                    overallItemsSold
                                    }
                                </div>
                            </div>
                            <div 
                                className="totalSales"
                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                            >
                                <h3>Sales Made (Overall)</h3>
                                <div className="indicator">
                                    {loadingSales ? 
                                        <CircularProgress />
                                        :
                                        formatAmount(amountOverall)
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    {isAdmin && loadingWorkers_data && <CircularProgress />}
                    {isAdmin && (workerSales_admin.length > 0  || workerSales_today_admin.length > 0) &&
                        <motion.span style={{display: !showSales && 'none'}}
                            initial={{y: '10%', opacity: 0}}
                            animate={{y:0, opacity: 1}}
                            exit={{y: '10%', opacity: 0, transition: {
                                delay: 0.2
                            }}}
                            transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                            className="workers_sales_today_overall"
                        >
                            <div className="title">(Workers)</div>
                            <div className="sales_workers">
                                {workerSales_today_admin.length > 0 &&
                                    <div 
                                        className="today"
                                        style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                                    >
                                        <h3 className="tag">Today ({new Date().toDateString()})</h3>
                                        {workerSales_today_admin.length > 0 && workerSales_today_admin.map((worker, index) => {
                                            return (
                                                <div className="workerSales" key={index}>
                                                    <p className="name"><CiUser size={25}/>{worker.firstName} &nbsp; {worker.lastName}</p>
                                                    <p className="quantitySold">Items sold: {worker.totalQuantity}</p>
                                                    <p className="amountMade">Sales Made: {formatAmount(worker.totalAmount)}</p>
                                                    <button onClick={() => fetchWorkerTodayHistory(worker._id, worker.firstName, worker.lastName)}>See history</button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                {workerSales_admin.length > 0 &&
                                    <div 
                                        className="overall"
                                        style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                                    >
                                        <h3 className="tag">Overall Sales Made</h3>
                                        {workerSales_admin.length > 0 && workerSales_admin.map((worker, index) => {
                                            return (
                                                <div className="workerSales" key={index}>
                                                    <p className="name"><CiUser size={25}/>{worker.firstName} &nbsp; {worker.lastName}</p>
                                                    <p className="quantitySold">Items Sold: {worker.totalQuantity}</p>
                                                    <p className="amountMade">Sales Made: {formatAmount(worker.totalAmount)}</p>
                                                    <button onClick={() => fetchWorkerHistory(worker._id, worker.firstName, worker.lastName)}>See history</button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </motion.span>
                    }
                </div>
                <motion.div 
                    className="right-analytics"
                    initial={{x: '-10%', opacity: 0}}
                    animate={{x:0, opacity: 1}}
                    exit={{x: '-10%', opacity: 0, transition: {
                        delay: 0.2
                    }}}
                    transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                    style={{display: !showSales && 'none'}}
                >
                    <span className="analytics-header">Sales Analytics</span>
                    <div 
                        className="user-bars"
                        style={{...theme === 'dark' && {borderLeftColor: 'grey', borderRightColor: 'grey'}}}
                    >
                        {/* Sales Limit */}
                        <div className="today_sales">
                            <CircularProgressbar 
                                className="progressbar_today_sales"
                                value={percentage_salesToday}
                                styles={buildStyles({
                                    textSize: '0.5rem',
                                    pathColor: 'rgb(7, 141, 252)',
                                    textColor: theme === 'dark' ? 'white' : 'black',
                                    trailColor: theme === 'dark' ? 'white' : '#e0e0e0',
                                })}
                            />
                            <p className="prog1_header">Sales Today</p>
                            <p className="text1">
                                <h2>{(percentage_salesToday).toFixed(1)}%</h2> 
                                <p>{formatAmount(salesTarget)}(Limit)</p>
                            </p>
                        </div>
                        {/* Sold items / Total Shop items */}
                        <div className="today_items_sold">
                            <CircularProgressbar 
                                className="progressbar_items_sold"
                                value={!isNaN(percentage_items_Sold) && percentage_items_Sold}
                                styles={buildStyles({
                                    textSize: '0.5rem',
                                    pathColor: 'rgb(7, 141, 252)',
                                    textColor: theme === 'dark' ? 'white' : 'black',
                                    trailColor: theme === 'dark' ? 'white' : '#e0e0e0',
                                })}
                            />
                            <p className="prog2_header">Items Sold Today</p>
                            <p className="text2">
                                <h2>{!isNaN(percentage_items_Sold) ? `${(percentage_items_Sold).toFixed(1)}%` : '0%'}</h2> 
                                <p>{itemsSold_today} / {totalItemsPlusSold} items</p>
                            </p>
                        </div>
                    </div>
                    {isAdmin && 
                        <div 
                            className="workers-bars"
                            style={{
                                ...workerSales_today_admin.length === 1 ? {gridTemplateColumns: 'repeat(1, 50%)'} : {gridTemplateColumns: 'repeat(2, 1fr)'}, 
                                ...theme === 'dark' && {borderLeftColor: 'grey', borderRightColor: 'grey'}
                            }}
                        >
                            {/* map users total sales in progress bars */}
                            {workerSales_today_admin.length > 0 && workerSales_today_admin.map(worker => {
                                const worker_today_percentage = (worker.totalAmount / salesTarget) * 100
                                return (
                                    <div className="workerPrgBar" key={worker._id}>
                                        <CircularProgressbar
                                            className="workers_progBar"
                                            value={Math.round(worker_today_percentage)}
                                            styles={buildStyles({
                                                textSize: '0.5rem',
                                                pathColor: 'rgb(7, 141, 252)',
                                                textColor: theme === 'dark' ? 'white' : 'black',
                                                trailColor: theme === 'dark' ? 'white' : '#e0e0e0',
                                            })}
                                        />
                                        <p className="prog3_header">{worker.firstName}&apos;s Sales Today</p>
                                        <p className="text3">
                                            <h2>{(worker_today_percentage).toFixed(1)}%</h2> 
                                            <p>{formatAmount(salesTarget)}(Limit)</p>
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </motion.div>
            </div>

            {/* Shop Items Managment (Admin Only) */}
            {isAdmin &&
                <>
                    <motion.div 
                        className="manageShopItems"
                        initial={{y: '10%', opacity: 0}}
                        animate={{y:0, opacity: 1}}
                        exit={{y: '10%', opacity: 0, transition: {
                            delay: 0.2
                        }}}
                        transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                    >
                        <span className="header">
                            Shop Management &nbsp;
                            <RiArrowDropDownFill size={30}
                                onClick={() => setShowShopMgt(prevState => !prevState)}
                                className="dropDown"
                                style={
                                    {...!showShopMgt && {transform: 'rotate(180deg)'}, 
                                    transition: 'all 0.2s'}
                                }
                            />
                        </span>
                        <div className="shop-management-body" style={{display: !showShopMgt && 'none'}}>
                            <div className="totals">
                                <div 
                                    className="totalNumOfItems"
                                    style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                                >
                                    <h3>Total Number of Items</h3>
                                    <div className="indicator">
                                        {loadingShopItems?
                                            <CircularProgress />
                                            :
                                            itemsTotal
                                        }
                                    </div>
                                </div>
                                <div 
                                    className="totalAmount"
                                    style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C'} : {backgroundColor: 'lightgrey'}}}
                                >
                                    <h3>Total Price of Remaining items</h3>
                                    <div className="indicator">
                                        {loadingShopItems?
                                            <CircularProgress />
                                            :
                                            formatAmount(itemsTotalPrice)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="itemsAlt">
                                <div 
                                    className="addItems"
                                    style={{...theme === 'dark' ? {border: '1px solid grey'} : {border: '1px solid lightgrey'}}}
                                >
                                    <h3>Add an Item</h3>
                                    <form onSubmit={addProduct}>
                                        <input 
                                            ref={nameRef}
                                            type="text" 
                                            className="name" 
                                            placeholder="Name of Product" 
                                            onChange={(e) => setName(e.target.value)}
                                            style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                        />
                                        <select 
                                            name="category" 
                                            defaultValue={'None'}
                                            onChange={(e) => setCategory(e.target.value)}
                                            style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                        >
                                            <option value="None">None</option>
                                            {categories.map(category => {
                                                return (
                                                    <option key={category._id} value={category.name}>{category.name}</option>
                                                )
                                            })}
                                        </select>
                                        <input 
                                            ref={quantityRef}
                                            type="number" 
                                            min={0} 
                                            className="quantity" 
                                            placeholder="Quantity" 
                                            onChange={(e) => setQuantity(e.target.value)}
                                            style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                        />
                                        <input 
                                            ref={priceRef}
                                            type="number" 
                                            min={0} 
                                            className="price" 
                                            placeholder="Price" 
                                            onChange={(e) => setPrice(e.target.value)}
                                            style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                        />
                                        <button>
                                            {
                                                addingPrd?
                                                <CircularProgress style={{color: 'white', width: 25, height: 25}} />
                                                :
                                                'Add'
                                            }
                                        </button>
                                    </form>
                                </div>
                                <div 
                                    className="right"
                                    style={{...theme === 'dark' ? {border: '1px solid grey'} : {border: '1px solid lightgrey'}}}
                                >
                                    <div className="addCategory">
                                        <h3>Add a Category</h3>
                                        <form onSubmit={addCategory}>
                                            <input
                                                ref={catInputRef}
                                                type="text" 
                                                placeholder="Name of Category" 
                                                onChange={(e) => setCat_name(e.target.value)}
                                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                            />
                                            <button className="addcat">
                                                {addingCat?
                                                    <CircularProgress style={{color: 'white', width: 25, height: 25}} />
                                                    :
                                                    'Add'
                                                }
                                            </button>
                                        </form>
                                    </div>
                                    <div className="delCategory">
                                        <h3>Delete a Category</h3>
                                        <form onSubmit={deleteCategory}>
                                            <input 
                                                ref={delCatInputRef}
                                                type="text" 
                                                placeholder="Name of Category"
                                                onChange={(e) => setCat_name_del(e.target.value)}
                                                style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'white', border: '1px solid grey'} : {backgroundColor: 'lightgrey'}}}
                                            />
                                            <button className="delBtn">
                                                {deletingCat? 
                                                    <CircularProgress style={{color: 'white', width: 25, height: 25}} />
                                                    :
                                                    'Delete'
                                                }
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    {/* Workers Management */}
                    {gettingEmployees && <CircularProgress />}
                    {employees.length > 0 &&
                        <motion.div 
                            className="manageWorkers"
                            initial={{y: '10%', opacity: 0}}
                            animate={{y:0, opacity: 1}}
                            exit={{y: '10%', opacity: 0, transition: {
                                delay: 0.2
                            }}}
                            transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                        >
                            {/* Fetch All employees and grant/deny access to the app, delete account and also get records of the employee (profile and sales)*/}
                            <span className="header">
                                Manage Workers &nbsp;
                                <RiArrowDropDownFill size={30}
                                    onClick={() => setShowWorkersMgt(prevState => !prevState)}
                                    className="dropDown"
                                    style={
                                        {...!showWorkersMgt && {transform: 'rotate(180deg)'}, 
                                        transition: 'all 0.2s'}
                                    }
                                />
                            </span>
                            {employees.length > 0 && <h3 style={{display: !showWorkersMgt && 'none'}}>(Account management)</h3>}
                            <div 
                                className="workers"  
                                style={{display: !showWorkersMgt && 'none'}}
                            >
                                {employees.map((employee, index) => {
                                    return (
                                        <div 
                                            className="worker" key={index}
                                            style={{...theme === 'dark' ? {border: '1px solid grey'}: {border: '1px solid black'}}}
                                        >
                                            <CiUser size={25}/>
                                            <p className="employeeName">{employee.firstName}</p>
                                            {!employee.canAccess ?
                                                <button className="grantAcc" onClick={() => grantAccess(employee._id)}>
                                                    {grantingAcc === employee._id ?
                                                        <CircularProgress style={{color: 'white', width: 25, height: 25}}/>
                                                        :
                                                        <>
                                                            {window.innerWidth > 425 && <RiCheckFill color="yellowgreen" size={23} />}
                                                            <p>Grant Access</p>
                                                        </>
                                                    }
                                                </button>
                                                :
                                                <button className="remAccess" onClick={() => removeAccess(employee._id)}>
                                                    {denyingAcc === employee._id ?
                                                        <CircularProgress style={{width: 25, height: 25}}/>
                                                        :
                                                        <>
                                                            {window.innerWidth > 425 && <RiCloseFill color="red" size={23}/>}
                                                            <p>Remove Access</p>
                                                        </>
                                                    }
                                                </button>
                                            }
                                            <button className="delAcc" onClick={() => deleteAccount(employee._id)}>
                                                {deletingAcc === employee._id ?
                                                    <CircularProgress style={{color: 'white', width: 25, height: 25}}/>
                                                    :
                                                    <>
                                                        {window.innerWidth > 425 && <DeleteForeverRounded htmlColor="white"/>}
                                                        <p>Delete Account</p>
                                                    </>
                                                }
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Display all changes made by an employee(deleting a history made) with the reason provided by the employee */}
                            <div 
                                className="actions_workers"
                                style={{display: !showWorkersMgt && 'none'}}
                            >
                                {actions.length > 0 && 
                                    <h3 className="actions_title">
                                        <p>(Actions from Workers)</p>
                                        <p className="clear" onClick={clearActions}>Clear</p>
                                    </h3>
                                }
                                {actions && actions.map(action => {
                                    return (
                                        <div 
                                            className="action-cont" 
                                            key={action._id}
                                            style={{...theme === 'dark' ? {backgroundColor: '#3C3C3C', color: 'darkgrey'} : {backgroundColor: 'lightgrey', color: 'grey'}}}
                                        >
                                            <div className="workerDets">
                                                <p>{action.firstName}&nbsp;{action.lastName}&nbsp;{action.action}</p>
                                            </div>
                                            <div className="item">
                                                {action.name &&
                                                    <p>[{action.name}</p>
                                                }
                                                {action.quantitySold &&
                                                    <p>{action.quantitySold}</p>
                                                }
                                                {action.totalPrice &&
                                                    <p>{formatAmount(action.totalPrice)}]</p>
                                                }
                                            </div>
                                            <div className="date">{action.date}</div>
                                            <div className="reason">{action.reason}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    }
                </>
            }
            {scroll &&
                <ScrollToTop />
            }
        </div>
    )
}