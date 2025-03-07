import { useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowBackIosNew } from '@mui/icons-material'
import '../History/History.css'
import { RiCheckboxCircleFill } from "react-icons/ri"
import { themesContext } from "../../Context/UserCredsContext"

export default function WorkerHistoryPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { history, firstName, lastName } = location.state || {}
    const { themeStyles } = useContext(themesContext)

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount)
    }

    return (
        <div 
            className="history-wrapper"
            style={{...themeStyles.style}}
        >
            <div className="header">
                <div className="left-header">
                    <ArrowBackIosNew 
                        style={{cursor: 'pointer'}} 
                        className="back"
                        onClick={() => navigate(-1)}
                    />
                </div>
                <p>{firstName}&nbsp;{lastName}&apos;s history</p>
            </div>
            {history.length > 0 && 
                <table>
                    <thead>
                        <th>Name</th>
                        {window.innerWidth > 425 &&
                            <th>Category</th>
                        }
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Date</th>
                        {window.innerWidth > 425 &&
                            <th>Status</th>
                        }
                    </thead>
                    <tbody>
                        {history.map((hit, index) => {
                            const date = new Date(hit.createdAt)
                            return (
                                <tr key={index}>
                                    <td className="name">{hit.name}</td>
                                    {window.innerWidth > 425 &&
                                        <td className="category">{hit.category}</td>
                                    }
                                    <td>{hit.quantity}</td>
                                    <td>{formatAmount(hit.price)}</td>
                                    <td>{date.toDateString()}</td>
                                    {window.innerWidth > 425 &&
                                        <td className="status"><RiCheckboxCircleFill size={20} color="rgb(7, 141, 252)"/><p>{hit.status}</p></td>
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }












            {/* <ul>
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
            </ul> */}
        </div>
    )
}