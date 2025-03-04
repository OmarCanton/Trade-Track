import { useContext, useEffect, useState, useRef } from "react"
import { UserCredsContext, themesContext } from "../../Context/UserCredsContext"
import '../Home/Home.css'
import { RiCloseFill } from "react-icons/ri";
import { IoFilterSharp } from "react-icons/io5";
import { 
    fetchProducts, 
    fetchSearchProduct, 
    fetchFilteredProduct,
    items, 
    prodStatus, 
    search,
    filtered
} from "../../Redux/Slices/ProductsSlice";
import { 
    fetchRecents, 
    recentItems, 
    recentStatus 
} from "../../Redux/Slices/RecentSelectedProds";
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import LoadingEffect from "../../Effects/LoadingEffect";
import SearchNotFound from '../../Effects/SearchNotFound.json'
import EmptyCart_Fav from '../../Effects/EmptyCart_Fav.json'
import Panel from "../../Components/Panel";
import Calculator from "../../Components/Calculator";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { 
    DeleteForever, 
    RefreshRounded, 
    LightMode, 
    DarkMode,
    EditRounded 
} from '@mui/icons-material'
import DeleteDialog from "../../Components/DeleteDialog";
import ThemeChangeAnime from "../../Components/ThemeChangeAnime";
import Updater from "../../Components/updater";
import {MenuRounded}  from '@mui/icons-material'
import MenuOps from "../../Components/MenuOps";

export default function Home() {
    const { userId, isAdmin, firstName, lastName } = useContext(UserCredsContext)
    const { 
        theme, 
        changeTheme, 
        showThemeOverlay, 
        setShowThemeOverlay, 
        themeStyles 
    } = useContext(themesContext)
    const products = useSelector(items)
    const status = useSelector(prodStatus)
    const recents = useSelector(recentItems)
    const recentItStatus = useSelector(recentStatus)
    const isSearch = useSelector(search)
    const isFiltered = useSelector(filtered)
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState('')
    const filterRef = useRef()
    const searchBar = useRef()
    const searchRef = useRef()
    const panelRef = useRef()
    const [categories, setCategories] = useState([])
    const [open, setOpen] = useState(false)
    const [product_Id, setProduct_Id] = useState('')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [quantity_sold, setQuantity_sold] = useState(1)
    const [product_price, setProduct_price] = useState('')
    const [record_made, setRecord_made] = useState(false)
    const [delPrd, setDelPrd] = useState(false)
    const [openDelDialog, setOpenDelDialog] = useState(false)
    const [prdIdDialog, setPrdIdDialog] = useState('')
    const [prdNameDialog, setPrdNameDialog] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [enableRefreshRot, setEnablerefreshRot] = useState(false)
    const [openUpdater, setOpenUpdater] = useState(false)
    const [itemsUpdate_id, setItemsUpdate_id] = useState()
    const [itemsUpdate_quantity, setItemsUpdate_quantity] = useState()
    const [itemUpdated, setItemUpdated] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllCategory`)
            setCategories(response.data.categories)
        }
        fetchCategories()
        dispatch(fetchProducts())
        dispatch(fetchRecents())
    }, [dispatch, record_made, delPrd, refresh, itemUpdated])

    const handlePrdClick = (product) => {
        setOpen(true)
        setProduct_Id(product._id)
        setName(product.name)
        setQuantity(product.quantity)
        setProduct_price(product.price)
    }

    const record = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/record`, { 
                userId, 
                name, 
                quantity_sold, 
                product_Id, 
                product_price 
            })
            if(response.data.success) {
                toast.success(response.data.message)
                setOpen(prevState => !prevState)
                setRecord_made(prevState => !prevState)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
            }
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

    const enableThemeOverlay = () => {
        setShowThemeOverlay(true)
        setTimeout(() => {
            setShowThemeOverlay(false)
        }, 2000)
    }
    const refreshScreen = () => {
        setRefresh(prevState => !prevState)
        setEnablerefreshRot(true)
        setTimeout(() => {
            setEnablerefreshRot(false)
        }, 500)
    }

    const handleUpdatePrdClick = (id) => {
        setOpenUpdater(true)
        setItemsUpdate_id(id)
    }

    const updateItem = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/updateProduct`, {
                itemsUpdate_id,
                itemsUpdate_quantity
            })
            if(response.data.success) {
                toast.success(response.data.message)
                setOpenUpdater(false)
                setItemUpdated(prevState => !prevState)
            }
            if(response.data.success === false) {
                toast.error(response.data.message)
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div 
            className='home-wrapper'
            style={{...themeStyles.style}}
        >
            <motion.div 
                className="header"
                initial={{y: '10%', opacity: 0}}
                animate={{y:0, opacity: 1}}
                exit={{y: '10%', opacity: 0, transition: {
                    delay: 0.2
                }}}
                transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
            >
                <h2 className="appName">
                    {window.innerWidth < 1024 &&
                        <MenuRounded onClick={() => setOpenMenu(true)}/>
                    }
                    {window.innerWidth > 425 ?
                        <p>Campus Gadgets Hub</p>
                        :
                        <p>CGH</p>
                    }
                </h2>
                <div 
                    ref={searchBar} 
                    className="search"
                >
                    <div className="serchFil">
                        <input
                            ref={searchRef}
                            type="text" 
                            placeholder="Search Item..."
                            onChange={(e) => { 
                                if(e.target.value === '') {
                                    if(filterRef.current.value === 'All') {
                                        dispatch(fetchProducts())
                                    } else {
                                        dispatch(fetchFilteredProduct(filterRef.current.value))
                                    }
                                } else {
                                    dispatch(fetchSearchProduct(e.target.value))
                                }
                                setSearchKey(e.target.value)
                            }}
                        />
                        <div className="filter">
                            <IoFilterSharp className="filterIcon" size={30} color="rgb(7, 141, 252)"/>
                            <select 
                                ref={filterRef}
                                defaultValue={'All'}
                                name="categories"
                                onChange={(e) => {
                                    if(e.target.value === 'All') {
                                        dispatch(fetchProducts())
                                    } else {
                                        dispatch(fetchFilteredProduct(e.target.value))
                                    }
                                }}
                            >
                                <option value="All">All</option>
                                {categories.map(category => {
                                    return (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="closeSearch" onClick={ () => {
                        searchBar.current.style.top = '-100px'
                        panelRef.current.style.display = 'flex'
                        searchRef.current.value = ''
                    }}>
                        <RiCloseFill size={20} />
                    </div>
                </div>
                {window.innerWidth >= 1024 &&
                    <Panel panelRef={panelRef} searchBar={searchBar}/>
                }
                <span className="right-header">
                    <RefreshRounded 
                        className="refresh" 
                        onClick={() => refreshScreen()}
                        style={{...enableRefreshRot && {animation: 'refresh 0.5s alternate'}}}
                    />
                    <div className="theme"
                        onClick={() => {
                            enableThemeOverlay()
                            setTimeout(() => {
                                theme === 'dark' ? changeTheme('light') : changeTheme('dark')
                            }, 1000)
                        }}
                    >
                        {theme === 'light' ? 
                            <LightMode htmlColor='black'/> 
                            : 
                            <DarkMode htmlColor='white'/>
                        }
                    </div>
                    { window.innerWidth > 425 &&
                        <h3 className="name">{firstName} {lastName}</h3>
                    }
                </span>
            </motion.div>
            <div className="main">
                {!isSearch && !isFiltered && products.length > 0 &&
                    <div 
                        className="recentSelected"
                        style={{...theme === 'dark' ? {borderBottom: '1px solid grey'} : {borderBottom: '1px solid lightgrey'}}}
                    >
                        {recentItStatus === 'succeeded' &&
                            <motion.span 
                                className="recSoldHeader"
                                initial={{y: '10%', opacity: 0}}
                                animate={{y:0, opacity: 1}}
                                exit={{y: '10%', opacity: 0, transition: {
                                    delay: 0.2
                                }}}
                                transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                            >
                                Recently Sold Items
                            </motion.span>
                        }
                        <div className="recentSelectedProducts">
                            {recentItStatus === 'loading' && 
                                <div className='loading'>
                                    <LoadingEffect />
                                </div>
                            }
                            {recentItStatus === 'succeeded' && recents.map(product => {
                                return (
                                    <motion.div 
                                        key={product._id} 
                                        className="product"
                                        initial={{y: '10%', opacity: 0}}
                                        animate={{y:0, opacity: 1}}
                                        exit={{y: '10%', opacity: 0, transition: {
                                            delay: 0.2
                                        }}}
                                        transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                                        onClick={() => handlePrdClick(product)}
                                    >
                                        <div 
                                            className="img" 
                                            data-watermark={
                                                product.name.trim().split(" ")[0] + " " + product.category
                                            }
                                            style={{
                                                ...theme === 'dark'? 
                                                {backgroundColor: 'grey'} 
                                                : 
                                                { backgroundColor: 'rgb(233, 233, 233)'}
                                            }}
                                        >
                                            {isAdmin &&
                                                <span className="delPrd">
                                                    <DeleteForever 
                                                        htmlColor="red" 
                                                        onClick={(e) => {
                                                            setOpenDelDialog(true)
                                                            setPrdNameDialog(product.name)
                                                            setPrdIdDialog(product._id)
                                                            e.stopPropagation()
                                                        }}
                                                    />
                                                    <div className="edit">
                                                        <EditRounded 
                                                            htmlColor={theme === 'dark' ? "white" : "rgb(7, 67, 116)"}
                                                            onClick={(e) => {
                                                                handleUpdatePrdClick(product._id)
                                                                e.stopPropagation()
                                                            }}
                                                        />
                                                    </div>
                                                </span>
                                            }
                                            <span className="quantity">
                                                {product.quantity > 0 ? 
                                                    <span className="quantityTag">{product.quantity}</span>
                                                    : 
                                                    <span 
                                                        className="outOfStock" 
                                                        style={{
                                                            ...theme === 'dark' ? 
                                                            {backgroundColor: '#3c3c3c'}
                                                            :
                                                            {backgroundColor: 'grey'}
                                                        }}
                                                    >
                                                        Out Of Stock
                                                    </span>
                                                }
                                            </span>
                                        </div>
                                        <p className="name">{product.name}</p>
                                        <div className="priceCat">
                                            <span className="category">{product.category}</span>
                                            <p className="price">{formatAmount(product.price)}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                }
                <div className="prodsCatalogue">
                    {status === 'succeeded' && products.length > 0 &&
                        <motion.span 
                            className='itemsHeader'
                            initial={{y: '10%', opacity: 0}}
                            animate={{y:0, opacity: 1}}
                            exit={{y: '10%', opacity: 0, transition: {
                                delay: 0.2
                            }}}
                            transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                        >
                            {isSearch ? `Search Results for ${searchKey}` : 'Shop Items'}
                        </motion.span>
                    }
                    <div className='productsContainer'>
                        {status === 'loading' && 
                            <div className='loading'>
                                <LoadingEffect />
                            </div>
                        }
                        {status === 'succeeded' && products.length <= 0 && (
                            <motion.div 
                                className="noItem"
                                initial={{x: '-10%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                exit={{x: '-10%', opacity: 0, transition: {
                                    delay: 0.2
                                }}}
                                transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                            >
                                {(isSearch || isFiltered) ? 
                                    <Lottie className="searchAnime" loop={true} animationData={SearchNotFound} />
                                    : 
                                    <Lottie className="searchAnime" loop={true} animationData={EmptyCart_Fav} />
                                }
                                <p 
                                    style={{...themeStyles.style}}
                                >
                                    Oops! No Product found at this time.
                                </p>
                            </motion.div>
                        )}
                        {status === 'succeeded' && products.length > 0 && products.map(product => {
                            return(
                                <motion.div
                                    key={product._id} 
                                    className="product"
                                    initial={{y: '10%', opacity: 0}}
                                    animate={{y:0, opacity: 1}}
                                    exit={{y: '10%', opacity: 0, transition: {
                                        delay: 0.2
                                    }}}
                                    transition={{delay: 0.15, duration: 0.4, ease: 'anticipate'}}
                                    onClick={() => handlePrdClick(product)}
                                >
                                    <div 
                                        className="img"
                                        data-watermark={
                                            product.name.trim().split(" ")[0] + " " + product.category
                                        }
                                        style={{
                                            ...theme === 'dark'? 
                                            {backgroundColor: 'grey'} 
                                            : 
                                            { backgroundColor: 'rgb(233, 233, 233)'}
                                        }}
                                    >
                                        {isAdmin &&                                            
                                            <span className="delPrd">
                                                <DeleteForever 
                                                    htmlColor="red" 
                                                    onClick={(e) => {
                                                        setOpenDelDialog(true)
                                                        setPrdNameDialog(product.name)
                                                        setPrdIdDialog(product._id)
                                                        e.stopPropagation()
                                                    }}
                                                />
                                                <div className="edit">
                                                    <EditRounded
                                                        htmlColor={theme === 'dark' ? "white" : "rgb(7, 67, 116)"}
                                                        onClick={(e) => {
                                                            handleUpdatePrdClick(product._id)
                                                            e.stopPropagation()
                                                        }}
                                                    />
                                                </div>
                                            </span>
                                        }
                                        <span className="quantity">
                                            {product.quantity > 0 ? 
                                                <span className="quantityTag">{product.quantity}</span> 
                                                : 
                                                <span 
                                                    className="outOfStock"
                                                    style={{
                                                        ...theme === 'dark' ? 
                                                        {backgroundColor: '#3c3c3c'}
                                                        :
                                                        {backgroundColor: 'grey'}
                                                    }}
                                                >
                                                    Out Of Stock
                                                </span>
                                            }
                                        </span>
                                    </div>
                                    <p className="name">{product.name}</p>
                                    <div className="priceCat">
                                        <span className="category">{product.category}</span>
                                        <p className="price">{formatAmount(product.price)}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Calculator 
                isOpen={open} 
                onClose={() => setOpen(prevState => !prevState)}
                name={name} 
                quantity={quantity}
                setQuantity_sold={setQuantity_sold}
                record={record}
            />
            <DeleteDialog 
                id={prdIdDialog}
                name={prdNameDialog}
                open={openDelDialog}
                setOpen={setOpenDelDialog}
                onClose={() => setOpenDelDialog(false)}
                setDelPrd={setDelPrd}
            />
            {showThemeOverlay && <ThemeChangeAnime /> }
            <Updater 
                open={openUpdater}
                onClose={() => setOpenUpdater(false)}
                func={updateItem}
                setUpdateQuantity={setItemsUpdate_quantity}
            />
            <MenuOps
                open={openMenu} 
                onClose={() => setOpenMenu(false)}
                setOpenMenu={setOpenMenu}
            />
        </div>
    )
}
