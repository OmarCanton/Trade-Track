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
        <h1>Please contact your Boss for access to this App</h1>
    )
}