import { useContext } from 'react'
import PropTypes from 'prop-types'
import './Calculator.css'
import { RiCheckboxCircleFill, RiCloseCircleFill, RiCloseLine } from 'react-icons/ri'
import { motion } from 'framer-motion'
import { themesContext } from '../Context/themeContext'
import { CircularProgress } from '@mui/material'

export default function Calculator({isOpen, onClose, name, quantity, quantity_sold, setQuantity_sold, record, recording}) {
    const { theme } = useContext(themesContext)
    if(!isOpen) return null
    return (
        <div className="calc-wrapper">
            <RiCloseLine 
                className='close' 
                onClick={onClose} 
                color='white'
                size={30}
            />
            <motion.div 
                className="inner-wrapper"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                style={{...theme === 'dark' ? {backgroundColor: 'rgb(22, 22, 22)'} : {backgroundColor: 'white'}}}
            >
                <div className="calc-cont">
                    <div className="availability">
                        {quantity > 0 ?
                            <RiCheckboxCircleFill color='rgb(7, 141, 252)'/>
                            :
                            <RiCloseCircleFill color='red'/>
                        }
                        <p>{quantity > 0 ? 'Available' : 'Out of Stock'}</p>
                    </div>
                    <div className="nameQuantity">
                        <p>
                            <span 
                                className='name' 
                                style={{...theme == 'dark'? {color: 'white'} : {color: 'black'}}}
                            >
                                {name}
                            </span>
                        </p>
                        <p>Quantity:&nbsp;<span style={{...theme == 'dark'? {color: 'white'} : {color: 'black'}}}>{quantity}</span></p>
                    </div>
                    <div className="quantityRec">
                        <p>Quantity Sold:</p>
                        <form onSubmit={record}>
                            <input 
                                value={quantity_sold}
                                onChange={(e) => setQuantity_sold(e.target.value)} 
                                type="number" 
                                min={1} 
                            />
                            <button>
                                {recording ?
                                    <CircularProgress style={{width: 25, height: 25, color: 'white'}}/> 
                                    : 
                                    'Record'
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
Calculator.propTypes = {
    isOpen: PropTypes.any,
    onClose: PropTypes.any,
    name: PropTypes.string,
    quantity: PropTypes.any,
    quantity_sold: PropTypes.any,
    setQuantity_sold: PropTypes.any,
    record: PropTypes.func,
    recording: PropTypes.any
}