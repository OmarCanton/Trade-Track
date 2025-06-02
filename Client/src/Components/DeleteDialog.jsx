import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { RiCloseCircleFill } from 'react-icons/ri'
import './Dialog.css'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { themesContext } from '../Context/themeContext'
import { CircularProgress } from '@mui/material'
import { authed_token } from '../Redux/Slices/AuthSlice'
import { useSelector } from 'react-redux'

export default function DeleteDialog({id, name, setDelPrd, open, setOpen, onClose}) {
    const token = useSelector(authed_token)
    const { themeStyles } = useContext(themesContext)
    const [deleting, setDeleting] = useState(false)
    const deleteProduct = async (e) => {
        e.preventDefault()
        setDeleting(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteProduct`, {
                id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response?.data?.message)
            setDelPrd(prevState => !prevState)
            setOpen(false)
        } catch(err) {
            console.log(err)
            toast.success(err?.response?.data?.message)
        } finally {
            setDeleting(false)
        }
    }
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
                <form onSubmit={(e) => deleteProduct(e, id)}>
                    <label>Are you sure you want to delete {name} from the shop?</label>
                    <div className="delBtns">
                        <button>
                            {deleting ?
                                <CircularProgress style={{width: 25, height: 25, color: 'white'}}/>
                                :
                                'Yes'
                            }
                        </button>
                        <button className='cancel' onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

DeleteDialog.propTypes = {
    delFunction: PropTypes.any,
    id: PropTypes.any,
    name: PropTypes.any,
    setDelPrd: PropTypes.any,
    open: PropTypes.any,
    setOpen: PropTypes.any,
    onClose: PropTypes.any,
}