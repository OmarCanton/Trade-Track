import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { CiUser } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { RiDashboardFill, RiHistoryFill, RiSearch2Line } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCredsContext, themesContext } from "../Context/UserCredsContext";
import { toast } from 'react-hot-toast'
import axios from 'axios'
import PropTypes from 'prop-types'
import './Panel.css'

export default function Panel ({panelRef, searchBar}) {
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const { isAdmin, setIsLoggedIn } = useContext(UserCredsContext)
    const { theme } = useContext(themesContext)
    const location = useLocation()

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {withCredentials: true})
            if(response.data.success) {
                localStorage.removeItem('isLoggedIn')
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

    
    const showSearchBar = () => {
        searchBar.current.style.top = '15px'
        panelRef.current.style.display = 'none'
    }

    return (
        <div 
            className="panel" ref={panelRef}
            style={{...theme === 'dark' ? { backgroundColor: 'white' } : { backgroundColor: 'black'}}}
        >
            <div 
                className="status" 
                onClick={() => navigate('/')}
            >
                {
                    isAdmin ? 
                    <GrUserAdmin 
                        className="adminIcon" 
                        fontSize={22} 
                        strokeWidth={1} 
                        color="white" 
                        style={{...theme === 'dark' ? { color: 'black' } : { color: 'white'}}}
                    /> 
                    : 
                    <CiUser 
                        className="userIcon" 
                        fontSize={22} 
                        strokeWidth={1} 
                        color="white"
                        style={{...theme === 'dark' ? { color: 'black' } : { color: 'white'}}}
                    />
                }
            </div>
            {location.pathname === '/' &&
                <div className="searchIcon" title="Search" onClick={showSearchBar}>
                    <RiSearch2Line 
                        fontSize={27} 
                        color="white" 
                        cursor={'pointer'} 
                        style={{...theme === 'dark' ? { color: 'black' } : { color: 'white'}}}
                    />
                </div>
            }
            <div title="Dashboard">
                <Link to={'/dashboard'} className="dashboard">
                    <RiDashboardFill 
                        className="dashboardIcon" 
                        fontSize={27} 
                        color="white"
                        style={{...theme === 'dark' ? { color: 'black' } : { color: 'white'}}}
                    />
                </Link>
            </div>
            <div title="History">
                <Link to={'/history'} className="history">
                    <RiHistoryFill 
                        className="historyIcon" 
                        fontSize={27} 
                        color="white"
                        style={{...theme === 'dark' ? { color: 'black' } : { color: 'white'}}}
                    />
                </Link>
            </div>
            
            <div className="logout" title="Logout" onClick={handleLogout}>
                {
                    loggingOut ? <CircularProgress style={{width: 25, height: 25, color: 'red'}}/>
                    :
                    <TbLogout color="red" fontSize={27} cursor={'pointer'}/>
                }
            </div>
        </div>
    )
}

Panel.propTypes = {
    panelRef: PropTypes.any,
    searchBar: PropTypes.any
}