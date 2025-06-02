import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { items, prodStatus } from '../Redux/Slices/ProductsSlice'
import LoadingEffect from '../Effects/LoadingEffect'
import { DeleteForever, EditRounded } from '@mui/icons-material'
import Lottie from 'lottie-react'
import SearchNotFound from '../Effects/SearchNotFound.json'
import EmptyCart_Fav from '../Effects/EmptyCart_Fav.json'


export default function ShopProducts({
    handlePrdClick,
    handleUpdatePrdClick,
    formatAmount,
    theme,
    themeStyles,
    searchKey,
    isSearch,
    isFiltered,
    setOpenDelDialog,
    setPrdNameDialog,
    setPrdIdDialog,
    isAdmin
}) {    
    const status = useSelector(prodStatus)
    const products = useSelector(items)

    return (
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
    )
}

ShopProducts.propTypes = {
    handlePrdClick: PropTypes.func,
    handleUpdatePrdClick: PropTypes.func,
    formatAmount: PropTypes.func,
    theme: PropTypes.any,
    themeStyles: PropTypes.any,
    searchKey: PropTypes.any,
    setOpenDelDialog: PropTypes.any,
    setPrdNameDialog: PropTypes.any,
    setPrdIdDialog: PropTypes.any,
    isSearch: PropTypes.any,
    isFiltered: PropTypes.any,
    isAdmin: PropTypes.any
}