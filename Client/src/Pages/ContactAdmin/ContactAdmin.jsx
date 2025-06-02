import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { authed_token, authed_user, logout, updateCanAcess } from "../../Redux/Slices/AuthSlice"
import axios from "axios"
import { TbLogout } from "react-icons/tb"
import { CircularProgress } from "@mui/material"

export default function ContactAdmin() {
    const dispatch = useDispatch()
    const token = useSelector(authed_token)
    const user = useSelector(authed_user)
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    useEffect(() => {
        const canAccess = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/can_access`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(updateCanAcess(response?.data?.canAccess))
            } catch(err) {
                console.error(err)
            }
        }
        canAccess()
    }, [dispatch, token])
    useEffect(() => {
        if(token && user?.canAccess) {
            navigate('/')
        } else {
            return
        }
    }, [navigate, token, user])

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

    return (
        <h1 style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative'
        }}>
            <span 
                className="logout" 
                title="Logout" 
                onClick={handleLogout}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20
                }}
            >
                {
                    loggingOut ? <CircularProgress style={{width: 25, height: 25, color: 'red'}}/>
                    :
                    <TbLogout color="red" fontSize={27} cursor={'pointer'}/>
                }
            </span>
            Access Denied!<br />
            Please contact your Boss for access to this App.
        </h1>
    )
}