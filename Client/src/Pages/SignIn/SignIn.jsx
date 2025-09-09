import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { themesContext } from '../../Context/themeContext'
import { toast } from 'react-hot-toast'
import '../SignIn/SignIn.css'
import { 
    CircularProgress, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle 
} from '@mui/material'
import { motion } from 'framer-motion'
import { FaRegEye, FaRegEyeSlash, FaSpinner } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { login } from '../../Redux/Slices/AuthSlice'

export default function SignIn() {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [password, setPassword] = useState('')
    const [reVerify, setReVerify] = useState(false)
    const navigate = useNavigate()
    const [signingIn, setSigningIn] = useState(false)
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [sendingCode, setSendingCode] = useState(false)
    const [sendingResetLink, setSendingResetLink] = useState(false)
    const { theme } = useContext(themesContext)

    const data = {
        email,
        password
    }

    const handleSignin = async (event) => {
        event.preventDefault()
        setSigningIn(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`, data)
            toast.success(response?.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
            dispatch(login(response?.data))
            navigate('/')
        } catch (err) {
            console.log(err)
            if(err?.response?.status === 401) {
                setReVerify(true)
                setSigningIn(false)
            }
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        } finally {
            setSigningIn(false)
        }
    }

    //handle this later, not functioning, make it send the code using the user's email instead of the id
    const handleReVerify = async (e) => {
        e.preventDefault()
        setSendingCode(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/resend-code/`)
            if(response.data.success === true) {
                toast.success(response.data.message, {
                    style: {
                        backgroundColor: 'black',
                        color: 'white'
                    }
                })
                setSendingCode(false)
                navigate('/verify-otp')          
            }
            if(response.data.success === false) {
                toast.error(response.data.error, {
                    style: {
                        backgroundColor: 'white',
                        color: 'black'
                    }
                })
                setSendingCode(false)
            }
        } catch (err) {
            toast.error(err.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
            setSendingCode(false)
        }
    }

    const resetPassword = async () => {
        setSendingResetLink(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {resetEmail})
            toast.success(response?.data?.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
        } catch(err) {
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        } finally {
            setOpen(false)
            setResetEmail('')
            setSendingResetLink(false)
        }
    }
    

    return (
        <div 
            className="signin-wrapper"
            style={{...theme == 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
        >
            <motion.div 
                className="signin-main"
                initial={{x: '10%', opacity: 0}}
                animate={{x: 0, opacity: 1}}
                exit={{x: '10%', opacity: 0}}
                transition={{duration: 0.15}}
                style={{...theme == 'dark' && {
                    backgroundColor: '#3C3C3C', 
                    color: 'white', 
                    boxShadow: '0 7px 10px -5px black'
                }}}
            >
                <p style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold', fontSize: '1.7rem'}}>Trade Track</p>
                <div className="signin-header">
                    <p style={{...theme == 'dark' && {color: 'white'}}}>Sign in to your account</p>
                </div>
                <div className="form">
                    <form onSubmit={handleSignin}>
                        <div className="email">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder='Enter your email'
                                onChange={(e) => setEmail(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                        </div>
                        <div className="password">
                            <input 
                                className='passwordInput'
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder='Enter password'
                                onChange={(e) => setPassword(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                            {showPassword ? 
                                <FaRegEye 
                                    onClick={() => setShowPassword(prevState => !prevState)} 
                                    className='showPass'
                                    style={{cursor: 'pointer', ...theme === 'dark' ? {color: 'rgb(7, 141, 252)'} : {color: 'grey'}}}
                                />
                                :
                                <FaRegEyeSlash 
                                    onClick={() => setShowPassword(prevState => !prevState)} 
                                    className='showPass' 
                                    style={{cursor: 'pointer', ...theme === 'dark' ? {color: 'rgb(7, 141, 252)'} : {color: '#3C3C3C'}}}
                                />
                            }
                        </div>
                        { reVerify ?
                            <button className='reVerify' type='button' onClick={handleReVerify}>
                                {sendingCode ? 
                                    <FaSpinner className='spinner' style={{width: 25, height: 25, color: 'white'}}/> 
                                    :
                                    'Verify'
                                }
                            </button>
                            :
                            <button>
                                {signingIn ? 
                                    <FaSpinner className='spinner' style={{width: 25, height: 25, color: 'white'}}/> 
                                    : 
                                    'Sign in'
                                }
                            </button>
                        }
                    </form>
                </div>
                <div 
                    className="forgotPassword"
                    style={{...theme === 'dark' && {color: 'white'}}}
                >
                    <Link 
                        onClick={() => setOpen(true)}
                        style={{...theme === 'dark' && {color: 'rgb(7, 141, 252)'}, fontWeight: 'bold'}}
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className="signup">
                    <p>Don&apos;t have an account yet? <Link to='/auth/register'>Sign up</Link></p>
                </div>
            </motion.div>
            <Dialog 
                open={open}
                onClose={(event, reason) => {
                    if(reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        setOpen(false)
                    }
                }}
                PaperProps={{style: {
                    display: 'flex',
                    flexDirection: 'column',
                }}}
            >
                <DialogTitle><h3>Forgot Password?</h3></DialogTitle>
                <DialogContent style={{
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <i>Enter your email to reset password</i>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={resetEmail}
                        style={{
                            width: '98%',
                            padding: 10, 
                            cursor: 'auto', 
                            marginTop: 5, 
                            fontSize: 'medium',
                            border: '1px solid grey',
                            borderRadius: 3
                        }}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder='example@gmail.com' 
                    />
                </DialogContent>
                <DialogActions>
                    <button style={{padding: 5, cursor: 'pointer'}} onClick={resetPassword}>
                        { sendingResetLink ? 
                            <CircularProgress style={{width: 25, height: 25, color: 'grey'}}/>
                            :
                            'Submit'
                        }
                    </button>
                    <button style={{padding: 5, cursor: 'pointer'}} onClick={() => setOpen(false)}>Cancel</button>
                </DialogActions>
            </Dialog>
        </div>
    )
}