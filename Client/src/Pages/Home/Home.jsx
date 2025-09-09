import { useContext, useEffect, useState, useRef } from "react"
import { themesContext } from "../../Context/themeContext"
import '../Home/Home.css'
import { RiCloseFill, RiSearch2Line } from "react-icons/ri";
import { IoFilterSharp } from "react-icons/io5";
import { 
    fetchProducts, 
    fetchSearchProduct, 
    fetchFilteredProduct,
    items, 
    search,
    filtered
} from "../../Redux/Slices/ProductsSlice";
import { 
    fetchRecents, 
} from "../../Redux/Slices/RecentSelectedProds";
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Panel from "../../Components/Panel";
import Calculator from "../../Components/Calculator";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { 
    RefreshRounded, 
    LightMode, 
    DarkMode,
} from '@mui/icons-material'
import DeleteDialog from "../../Components/DeleteDialog";
import ThemeChangeAnime from "../../Components/ThemeChangeAnime";
import Updater from "../../Components/updater";
import {MenuRounded}  from '@mui/icons-material'
import MenuOps from "../../Components/MenuOps";
import { useNavigate } from "react-router-dom";
import { authed_token, authed_user, updateCanAcess } from "../../Redux/Slices/AuthSlice";
import RecentlySoldProducts from "../../Components/RecentProducts";
import ShopProducts from "../../Components/ShopProducts";

export default function Home() {
    const navigate = useNavigate()
    const user = useSelector(authed_user)
    const token = useSelector(authed_token)
    const isAdmin = user?.role === 'admin'
    const firstName = user?.firstName
    const lastName = user?.lastName
    const haveAccess = user?.canAccess
    const { 
        theme, 
        changeTheme, 
        showThemeOverlay, 
        setShowThemeOverlay, 
        themeStyles 
    } = useContext(themesContext)
    const products = useSelector(items)
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
    const [itemsUpdate_quantity, setItemsUpdate_quantity] = useState('')
    const [itemUpdated, setItemUpdated] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [recording, setRecording] = useState(false)
    const [updatingQuantity, setUpdatingQuantity] = useState(false)
    const [searchShown, setSearchShown] = useState(false)

    useEffect(() => {
        if(haveAccess) {
            navigate('/')
        } else {
            navigate('/contact_admin')
        }
    }, [haveAccess, navigate])

    useEffect(() => {
        const canAccess = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/can_access`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(updateCanAcess(response?.data?.canAccess))
        }
        canAccess()
    }, [dispatch, token])

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllCategory`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategories(response?.data?.categories)
        }
        fetchCategories()
        dispatch(fetchProducts(token))
        dispatch(fetchRecents(token))
    }, [dispatch, token, record_made, delPrd, refresh, itemUpdated])

    const handlePrdClick = (product) => {
        setOpen(true)
        setProduct_Id(product._id)
        setName(product.name)
        setQuantity(product.quantity)
        setProduct_price(product.price)
    }

    const record = async (e) => {
        e.preventDefault()
        setRecording(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/record`, { 
                name, 
                quantity_sold, 
                product_Id, 
                product_price 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message)
            setOpen(prevState => !prevState)
            setRecord_made(prevState => !prevState)
        } catch(err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        } finally {
            setRecording(false)
            setQuantity_sold(1)
        }
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
        setUpdatingQuantity(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/updateProduct`, {
                itemsUpdate_id,
                itemsUpdate_quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message)
            setOpenUpdater(false)
            setItemUpdated(prevState => !prevState)
        } catch(err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        } finally {
            setUpdatingQuantity(false)
            setItemsUpdate_quantity('')
        }
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount)
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
                    {window.innerWidth < 1024 ?
                        <p>Tt</p>
                        :
                        <p>Trade Track</p>
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
                                        dispatch(fetchProducts(token))
                                    } else {
                                        dispatch(fetchFilteredProduct({filterKey: filterRef.current.value, token}))
                                    }
                                } else {
                                    dispatch(fetchSearchProduct({name: e.target.value, token}))
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
                                        dispatch(fetchProducts(token))
                                    } else {
                                        dispatch(fetchFilteredProduct({filterKey: e.target.value, token}))
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
                    <div style={{...theme === 'light' && {backgroundColor: 'white'}}} className="closeSearch" onClick={ () => {
                        searchBar.current.style.top = '-100px'
                        panelRef.current.style.display = 'flex'
                        searchRef.current.value = ''
                        setSearchShown(false)
                    }}>
                        <RiCloseFill size={20} />
                    </div>
                </div>
                {window.innerWidth >= 1024 &&
                    <Panel panelRef={panelRef} searchBar={searchBar}/>
                }
                <span className="right-header" style={{...searchShown ? {opacity: 0} : {opacity: 1}}}>
                    {window.innerWidth < 1024 &&
                        <RiSearch2Line 
                            onClick={() => {
                                searchBar.current.style.top = '15px'
                                panelRef.current.style.display = 'none'
                                setSearchShown(true)
                            }}
                            fontSize={24} 
                            color="white" 
                            cursor={'pointer'} 
                            style={{...theme === 'dark' ? { color: 'white' } : { color: 'black'}}}
                        />
                    }
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
                    <RecentlySoldProducts 
                        handleProductClick={handlePrdClick}
                        formatAmount={formatAmount}
                        handleUpdateProductClick={handleUpdatePrdClick}
                        theme={theme}    
                        isAdmin={isAdmin}
                        setOpenDelDialog={setOpenDelDialog}
                        setPrdNameDialog={setPrdNameDialog}
                        setPrdIdDialog={setPrdIdDialog}
                    />
                }
                <ShopProducts 
                    handlePrdClick={handlePrdClick}
                    handleUpdatePrdClick={handleUpdatePrdClick}
                    formatAmount={formatAmount}
                    theme={theme}
                    themeStyles={themeStyles}
                    searchKey={searchKey}
                    isSearch={isSearch}
                    isFiltered={isFiltered}
                    setOpenDelDialog={setOpenDelDialog}
                    setPrdNameDialog={setPrdNameDialog}
                    setPrdIdDialog={setPrdIdDialog}
                    isAdmin={isAdmin}
                />
            </div>
            <Calculator 
                isOpen={open} 
                onClose={() => setOpen(prevState => !prevState)}
                name={name} 
                quantity={quantity}
                quantity_sold={quantity_sold}
                setQuantity_sold={setQuantity_sold}
                record={record}
                recording={recording}
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
                updateQuantity={itemsUpdate_quantity}
                setUpdateQuantity={setItemsUpdate_quantity}
                updatingQuantity={updatingQuantity}
            />
            <MenuOps
                open={openMenu} 
                onClose={() => setOpenMenu(false)}
                setOpenMenu={setOpenMenu}
            />
        </div>
    )
}
