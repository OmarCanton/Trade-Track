import { useNavigate } from "react-router-dom"
import { UserCredsContext } from "../../Context/UserCredsContext"
import { useContext, useEffect } from "react"

export default function ContactAdmin() {
    const navigate = useNavigate()
    const {haveAccess} = useContext(UserCredsContext)
    useEffect(() => {
        if(haveAccess) {
            navigate('/')
        } else {
            return
        }
    }, [haveAccess, navigate])
    return (
        <h1 style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            Access Denied<br />
            Please contact your Boss for access to this App
        </h1>
    )
}