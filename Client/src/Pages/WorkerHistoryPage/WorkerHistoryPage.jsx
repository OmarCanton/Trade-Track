import { useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowBackIosNew } from '@mui/icons-material'
import './WorkerHistoryPage.css'
import { RiCheckboxCircleFill } from "react-icons/ri"
import { themesContext } from "../../Context/UserCredsContext"

export default function WorkerHistoryPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { history, firstName, lastName } = location.state || {}
    const { themeStyles } = useContext(themesContext)
    
    return (
        <div 
            className="worker-history-wrapper"
            style={{...themeStyles.style}}
        >
            <div className="header">
                <ArrowBackIosNew 
                    style={{cursor: 'pointer'}} 
                    className="back"
                    onClick={() => navigate(-1)}
                />
                <p>{firstName}&nbsp;{lastName}&apos;s history</p>
            </div>
            <ul>
                {history && history.map(hit => {
                    const date = new Date(hit.createdAt)
                    return (
                        <li key={hit._id} className="historyCont">
                            <p className="name">
                                <p>{hit.name}</p>
                                <p>{hit.category}</p>
                            </p>
                            <div className="right">
                                <p className="quantitysold">{hit.quantity}</p>
                                <p className="price_total">GHS {hit.price}</p>
                                <p className="date">{date.toDateString()}</p>
                                <p className="status"><RiCheckboxCircleFill size={20} color="rgb(7, 141, 252)"/> <p>{hit.status}</p></p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}