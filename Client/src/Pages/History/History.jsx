import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { UserCredsContext, themesContext } from "../../Context/UserCredsContext"
import { ArrowBackIosNew } from '@mui/icons-material'
import './History.css'
import { RiCheckboxCircleFill } from "react-icons/ri"
import { DeleteForever } from '@mui/icons-material'
import { toast } from 'react-hot-toast'
import Dialog from "../../Components/Dialog"
import { CircularProgress } from "@mui/material"
import Lottie from 'lottie-react'
import SearchNotFound from '../../Effects/SearchNotFound.json'

export default function History() {
    const [history, setHistory] = useState([])
    const { userId } = useContext(UserCredsContext)
    const { themeStyles } = useContext(themesContext)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [open_delAll, setOpen_delAll] = useState(false)
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [quantitySold, setQUantitySold] = useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [reason, setReason] = useState('')
    const [deletingHistory, setDeletingHistory] = useState(false)
    const [deletingAllHistory, setDeletingAllHistory] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deletingAll, setDeletingAll] = useState(false)

    useEffect(() => {
        const fetchHistory = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getHistory/${userId}`)
            if(response.data.success) {
                setHistory(response.data.history)
            }
        }
        fetchHistory()
    }, [userId, deletingHistory, deletingAllHistory])
    const deleteHistory = async (e) => {
        e.preventDefault()
        setDeleting(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteHistory`, {
                userId,
                id,
                name,
                quantitySold,
                totalPrice,
                reason
            })
            if(response.data.success) {
                toast.success(response.data.message)
                setDeletingHistory(prevState => !prevState)
                setDeleting(false)
                setOpen(false)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
                setDeleting(false)
            }
        } catch(err) {
            console.log(err)
            setDeleting(false)
        }
    }
    const deleteAllHistory = async (e) => {
        e.preventDefault()
        setDeletingAll(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteAllHistory`, {
                userId
            })
            if(response.data.success) {
                toast.success(response.data.message)
                setDeletingAllHistory(prevState => !prevState)
                setDeletingAll(false)
                setOpen_delAll(false)
            }
            if(response.data.success === false) {
                toast.error(response.data.error)
                setDeletingAll(false)
            }
        } catch(err) {
            console.log(err)
            setDeletingAll(false)
        }
    }
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
                        fontSize="large" 
                        onClick={() => navigate(-1)}
                    />
                    <p>History</p>
                </div>
                {history.length > 0 &&
                    <div className="right-header">
                        {deletingAllHistory ?
                            <CircularProgress />
                            :
                            <DeleteForever 
                                onClick={() => setOpen_delAll(true)}
                                style={{cursor: 'pointer'}}
                            />
                        }
                    </div>
                }
            </div>
            {history.length <= 0 && <Lottie style={{height: 500}} loop={true} animationData={SearchNotFound} />}
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
                        <th></th>
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
                                    <td>
                                    {deletingAllHistory ?
                                        <CircularProgress />
                                        :
                                        <DeleteForever 
                                            onClick={() => {
                                                setOpen(true)
                                                setId(hit._id)
                                                setName(hit.name)
                                                setQUantitySold(hit.quantity)
                                                setTotalPrice(hit.price)
                                            }}
                                            className="del" 
                                            htmlColor="orangered"
                                            style={{cursor: 'pointer'}}
                                        />
                                    }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }
            <Dialog 
                open={open} 
                delHistory={deleteHistory} 
                setReason={setReason}
                onClose={() => setOpen(false)}
                isAllHistoryDel={false}
                deleting={deleting}
            />
            <Dialog 
                open={open_delAll} 
                delHistory={deleteAllHistory} 
                setReason={setReason}
                onClose={() => setOpen_delAll(false)}
                isAllHistoryDel={true}
                deletingAll={deletingAll}
            />
        </div>
    )
}