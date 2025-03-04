import PropTypes from 'prop-types'
import { RiCloseCircleFill } from 'react-icons/ri'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { themesContext } from '../Context/UserCredsContext'
import './Updater.css'
import { CircularProgress } from '@mui/material'

export default function Updater({open, onClose, func, setUpdateQuantity, updatingQuantity}) {
    const { themeStyles } = useContext(themesContext)

    if(!open) return null
    return (
        <div className="updater-wrapper">
            <RiCloseCircleFill color='white' size={30} onClick={onClose} className='close'/>
            <motion.div 
                className="main"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                style={{...themeStyles.style}}
            >
                <div className="title">Key in the quantity you want to add up:</div>
                <form onSubmit={func}>
                    <div className="input">
                        <input 
                            type="number" 
                            placeholder='Enter additional quantity...'
                            onChange={(e) => setUpdateQuantity(e.target.value)}
                        />
                    </div>
                    <div className="cancelOK">
                        <button>
                            {updatingQuantity ? 
                                <CircularProgress />
                                :
                                'Add'
                            }
                        </button>
                        <button onClick={onClose} className='closebtn'>Cancel</button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

Updater.propTypes ={
    open: PropTypes.any,
    onClose: PropTypes.any,
    func: PropTypes.func,
    setUpdateQuantity: PropTypes.any,
    updatingQuantity: PropTypes.any
}