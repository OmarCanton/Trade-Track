import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { CiUser } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { RiDashboardFill, RiHistoryFill, RiSearch2Line } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { themesContext } from "../Context/themeContext";
import PropTypes from 'prop-types'
import './Panel.css'
import { useSelector, useDispatch } from "react-redux";
import { authed_user, logout } from "../Redux/Slices/AuthSlice";

export default function Panel ({panelRef, searchBar}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const user = useSelector(authed_user)
    const isAdmin = user?.role === 'admin'
    const { theme } = useContext(themesContext)
    const location = useLocation()

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            dispatch(logout())
            navigate('/auth/signin')
        } catch(err) {
            console.error(err)
        } finally {
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