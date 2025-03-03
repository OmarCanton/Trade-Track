import PropTypes from 'prop-types'
import {ArrowBackIosNewRounded} from '@mui/icons-material'
import './Menu.css'
import { CircularProgress } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { RiDashboardFill, RiHistoryFill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { UserCredsContext, themesContext } from "../Context/UserCredsContext";
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function MenuOps({open, onClose, setOpenMenu}) {
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const { isAdmin, setIsLoggedIn, firstName } = useContext(UserCredsContext)
    const { theme } = useContext(themesContext)
    const divRef = useRef(null)

    const handleCloseMenuByOutClick = (event) => {
        if(divRef.current) {
            const clickablePos = event.clientX - divRef.current.getBoundingClientRect().width
            if(clickablePos > 0) {
                onClose()
            }
        }
    }


    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {withCredentials: true})
            if(response.data.success) {
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('access_utility')
                setIsLoggedIn(response.data.success)
                navigate('/auth/signin')
            }
            setLoggingOut(false)
        } catch (err) {
            if(err.response) {
                toast.error(err.response.data.message, {
                    style: {
                        backgroundColor: 'white',
                        color: 'black'
                    }
                })
            } else {
                toast.error('An Unknown error occured', {
                    style: {
                        backgroundColor: 'white',
                        color: 'black'
                    }
                })
            }
            setLoggingOut(false)
        }
    }
    if(!open) return
    return (
        <motion.div 
            className="menuOps"
            initial={{x: -10, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            onClick={handleCloseMenuByOutClick}
        >
            <div 
                ref={divRef}
                className='menu'
                style={{...theme === 'dark' ? { backgroundColor: '#3c3c3c' } : { backgroundColor: '#3c3c3c'}}}
            >
                <span className="backName" style={{...theme === 'dark'? {color: 'white'} : {color: 'white'}}}>
                    <ArrowBackIosNewRounded 
                        onClick={onClose}
                        className='back'
                    />
                    <div className="name">{firstName}</div>
                </span>
                <div
                    className="status" 
                    onClick={() => {
                        navigate('/')
                        setOpenMenu(false)
                    }}
                >
                    {
                        isAdmin ? 
                        <GrUserAdmin 
                            className="adminIcon" 
                            fontSize={30} 
                            strokeWidth={1} 
                            color="white" 
                        /> 
                        : 
                        <CiUser 
                            className="userIcon" 
                            fontSize={30} 
                            strokeWidth={1} 
                            color="white"
                        />
                    }
                    <p style={{...theme === 'dark'? {color: 'white'} : {color: 'white'}}}>Home</p>
                </div>
                <div title="Dashboard" 
                    onClick={() => { 
                        navigate('/dashboard')
                        setOpenMenu(false)
                    }}
                >
                    <Link to={'/dashboard'} className="dashboard">
                        <RiDashboardFill 
                            className="dashboardIcon" 
                            fontSize={30} 
                            color="rgb(7, 141, 252)"
                        />
                        <p>Dashboard</p>
                    </Link>
                </div>
                <div title="History" 
                    onClick={() => { 
                        navigate('/history')
                        setOpenMenu(false)
                    }}
                >
                    <Link to={'/history'} className="history">
                        <RiHistoryFill 
                            className="historyIcon" 
                            fontSize={33} 
                            color="white"
                        />
                        <p>History</p>
                    </Link>
                </div>
                <div className="logout" title="Logout" onClick={handleLogout}>
                    {
                        loggingOut ? <CircularProgress style={{width: 25, height: 25, color: 'red'}}/>
                        :
                        <>
                            <TbLogout 
                                color="red" 
                                fontSize={33} 
                                cursor={'pointer'}
                            />
                            <p style={{...theme === 'dark'? {color: 'white'} : {color: 'white'}}}>Logout</p>
                        </>
                    }
                </div>
            </div>
        </motion.div>
    )
}

MenuOps.propTypes = {
    open: PropTypes.any,
    onClose: PropTypes.any, 
    panelRef: PropTypes.any, 
    searchBar: PropTypes.any,
    setOpenMenu: PropTypes.any
}