import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { recentItems, recentStatus } from '../Redux/Slices/RecentSelectedProds'
import LoadingEffect from '../Effects/LoadingEffect'
import { DeleteForever, EditRounded } from '@mui/icons-material'

export default function RecentlySoldProducts({
    handleProductClick, 
    handleUpdateProductClick, 
    formatAmount, 
    theme, 
    isAdmin, 
    setOpenDelDialog, 
    setPrdNameDialog, 
    setPrdIdDialog
}) {
    const recents = useSelector(recentItems)
    const recentItStatus = useSelector(recentStatus)

    return (
        <div 
            className="recentSelected"
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
                            onClick={() => handleProductClick(product)}
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
                                                    handleUpdateProductClick(product._id)
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

RecentlySoldProducts.propTypes = {
    handleProductClick: PropTypes.func,
    formatAmount: PropTypes.func,
    handleUpdateProductClick: PropTypes.func,
    theme: PropTypes.any,
    isAdmin: PropTypes.any,
    setOpenDelDialog: PropTypes.any,
    setPrdNameDialog: PropTypes.any,
    setPrdIdDialog: PropTypes.any,
}