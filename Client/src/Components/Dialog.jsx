import PropTypes from 'prop-types'
import { RiCloseCircleFill } from 'react-icons/ri'
import './Dialog.css'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { themesContext, UserCredsContext } from '../Context/UserCredsContext'
import { CircularProgress } from '@mui/material'

export default function Dialog({delHistory, setReason, open, onClose, isAllHistoryDel, deleting, deletingAll}) {
    const { isAdmin } = useContext(UserCredsContext)
    const { themeStyles } = useContext(themesContext)
        
    if(!open) return null
    return (
        <div className="dialog-wrapper">
            <RiCloseCircleFill color='white' size={30} onClick={onClose} className='close'/>
            <motion.div 
                className="inner-wrapper"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                style={{...themeStyles.style}}
            >
                <form onSubmit={delHistory}>
                    <label htmlFor="reason">{isAllHistoryDel ? 'Are you sure you want to delete history?' : 'Give a reason for the action:'}</label>
                    {!isAllHistoryDel &&
                        <input 
                            type="text" 
                            id='reason' 
                            placeholder={isAdmin? 'Ignore if admin ': 'Reason...'} 
                            onChange={(e) => setReason(e.target.value)}
                        />
                    }
                    <div>
                        <button>
                            {(deleting || deletingAll) ?
                                <CircularProgress style={{width: 25, height: 25, color: 'white'}}/>
                                :
                                'Delete'
                            }
                        </button>
                        {isAllHistoryDel &&
                            <button className='closebtn' onClick={onClose}>Cancel</button>
                        }
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

Dialog.propTypes = {
    delHistory: PropTypes.any,
    open: PropTypes.any,
    onClose: PropTypes.any,
    setReason: PropTypes.any,
    isAllHistoryDel: PropTypes.any,
    deleting: PropTypes.any,
    deletingAll: PropTypes.any
}