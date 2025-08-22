import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Register/Register.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { 
    FaRegEye, 
    FaRegEyeSlash, 
    FaSpinner, 
} from "react-icons/fa";
import { themesContext } from '../../Context/themeContext'

export default function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [sex, setSex] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [showConfPass, setShowConfPass] = useState(false)
    const [signingUp, setSigningUp] = useState(false) 
    const navigate = useNavigate()
    const { theme } = useContext(themesContext)

    const passwordStrength = (password) => {
        let strength = 0
        
        if(password.match(/[A-Z]/)) strength++
        if(password.match(/[a-z]/)) strength++
        if(password.match(/\d/)) strength++
        if(password.match(/\W/)) strength++
        if(password.length >= 8) strength++

        return strength
    }

    const getBarColor = (strength) => {
        if(strength === 0) {
            return ''
        } else if(strength === 1) {
            return 'red'
        } else if(strength === 2) {
            return 'orange'
        } else if(strength === 3) {
            return 'gold'
        } else if(strength === 4) {
            return 'lightblue'
        } else {
            return 'yellowgreen'
        }
    }

    const strength = passwordStrength(password)
    const backgroundColor = getBarColor(strength)

    const barStyles = {
        width: `${strength / 5 * 85}%`,
        backgroundColor: `${backgroundColor}`
    }
    
    const signupData = {
        firstName, 
        lastName,
        email, 
        password, 
        confPassword, 
        sex
    }

    const  handleSignup = async (event) => {
        event.preventDefault()
        setSigningUp(true)
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register-send-code`, signupData)
            toast.success(response.data.message, {
                style: {
                    backgroundColor: 'black',
                    color: 'white'
                }
            })
            // localStorage.setItem('utility_user_id', response?.data?.id)
            setSigningUp(false)
            navigate(`/verify-otp/${response?.data?.id}`)
        } catch (err) {
            toast.error(err?.response?.data?.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        } finally {
            setSigningUp(false)
        }
    }


    return (
        <div 
            className="signup-wrapper"
            style={{...theme == 'dark' && {backgroundColor: 'rgb(22, 22, 22)'}}}
        >
            <motion.div 
                className="signup-main"
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
                <p style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold', fontSize: '1.7rem'}}>Campus Gadgets Hub</p>
                <div className="signup-header">
                    <p style={{...theme === 'dark' && {color: 'white'}}}>Register</p>
                </div>
                <i style={{color: 'grey', fontSize: 'small', textAlign: 'center', borderLeft: '3.5px solid rgb(7, 141, 252)', borderRadius: 3, padding: 5, paddingBottom: 7}}>An OTP will be sent to via the email entered to verify your account after registration</i>
                <div className="passBar" style={barStyles}></div>
                <div className="form">
                    <form onSubmit={handleSignup}>
                        <div className="firstName">
                            <input 
                                type="text" 
                                placeholder='Enter First Name'
                                onChange={(e) => setFirstName(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                        </div>
                        <div className="lastName">
                            <input 
                                type="text" 
                                placeholder='Enter Last Name'
                                onChange={(e) => setLastName(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                        </div>
                        <div className="email">
                            <input
                                type="email"
                                placeholder='Enter Email'
                                onChange={(e) => setEmail(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                        </div>
                        <div className="password">
                            <input 
                                type={showPass ? 'text' : 'password'}
                                name="password" 
                                placeholder='Enter Password'
                                onChange={(e) => setPassword(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                            {showPass ? 
                                <FaRegEye 
                                    className='showpass1' 
                                    onClick={() => setShowPass(false)}
                                    htmlColor='grey'
                                    style={{cursor: 'pointer', ...theme === 'dark' && {color: 'rgb(7, 141, 252)'}}}
                                /> 
                                : 
                                <FaRegEyeSlash 
                                    className='showpass1' 
                                    onClick={() => setShowPass(true)}
                                    htmlColor='#3C3C3C'
                                    style={{cursor: 'pointer', ...theme === 'dark' && {color: 'rgb(7, 141, 252)'}}}
                                />
                            }
                        </div>
                        <div className="confPassword">
                            <input 
                                type={showConfPass ? 'text' : 'password'}
                                name="confPassword" 
                                placeholder='Confirm Password'
                                onChange={(e) => setConfPassword(e.target.value)}
                                style={{color: 'rgb(7, 141, 252)', fontWeight: 'bold'}}
                            />
                            {showConfPass ? 
                                <FaRegEye 
                                    className='showpass2' 
                                    htmlColor='grey'
                                    onClick={() => setShowConfPass(false)}
                                    style={{cursor: 'pointer', ...theme === 'dark' && {color: 'rgb(7, 141, 252)'}}}
                                /> 
                                : 
                                <FaRegEyeSlash 
                                    className='showpass2' 
                                    onClick={() => setShowConfPass(true)}
                                    htmlColor='#3C3C3C'
                                    style={{cursor: 'pointer', ...theme === 'dark' && {color: 'rgb(7, 141, 252)'}}}
                                />
                            }
                        </div>
                        <div className="sex">
                            <label htmlFor="select">Sex: </label>
                            <select 
                                defaultValue={'none'} id='select' 
                                name="sex"
                                onChange={(e) => setSex(e.target.value)}
                                style={{fontWeight: 'bold'}}
                            >
                                <option value="none">None</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button>
                            {signingUp ? 
                                <FaSpinner className='spinner' style={{width: 25, height: 25, color: 'white'}}/>
                                : 
                                <p>SignUp</p>
                            }
                        </button>
                    </form>
                </div>
                <div className="alreadyHaveAcc">
                    <p>Already have an account? <Link to='/auth/signin'>Sign In</Link></p>
                </div>
            </motion.div>
        </div>
    )
}