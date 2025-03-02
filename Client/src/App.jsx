import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from "./Pages/Register/Register"
import SignIn from './Pages/SignIn/SignIn'
import VerifyOTP from './Pages/VerifyOTP/VerifyOTP'
import { UserCredsContext, themesContext } from './Context/UserCredsContext'
import { AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Home from './Pages/Home/Home'
import PageNotFound from './Pages/PageNotFound/PageNotFound'
import ResetPassword from './Pages/ResetPassword/ResetPasssword'
import ContactAdmin from './Pages/ContactAdmin/ContactAdmin'
import Dashboard from './Pages/Dashboards/Dashboard'
import History from './Pages/History/History'
import WorkerHistoryPage from './Pages/WorkerHistoryPage/WorkerHistoryPage'

export default function App() {
  const [userId, setUserId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') || false
  })
  const [haveAccess, setHaveAccess] = useState(() => {
    localStorage.getItem('access_utility') || false
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const [showThemeOverlay, setShowThemeOverlay] = useState(false)

  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkAuth`, {withCredentials: true})
            if(response.data.authenticated) {
              setIsLoggedIn(response.data.user.isAuthenticated)
              setHaveAccess(response.data.user.canAccess)
              setIsAdmin(response.data.user.isAdmin)
              setUserId(response.data.user._id)
              setFirstName(response.data.user.firstName)
              setLastName(response.data.user.lastName)
            }
        } catch (err) {
            toast.error(err.message, {
                style: {
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        }
    }
    checkAuth()
  }, [location])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const themeStyles = {
    style: {...theme === 'dark' && {
      backgroundColor: 'rgb(22, 22, 22)',
      color: 'white',
      divColor: '#3C3C3C'
    }} 
  }


  return (
    <>
      <Toaster   
          position='bottom-right'
          toastOptions={{ duration: 3000 }} 
      />
      <themesContext.Provider value={{
          theme, setTheme, changeTheme, themeStyles,
          showThemeOverlay, setShowThemeOverlay,
        }}
      >
        <UserCredsContext.Provider value={{
          userId, setUserId,
          isLoggedIn, setIsLoggedIn,
          haveAccess, setHaveAccess,
          firstName, setFirstName,
          lastName, setLastName,
          isAdmin,
          history, setHistory
        }}>
          <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
              <Route index path='/' element={isLoggedIn ? (haveAccess ? <Home /> : <ContactAdmin />)  : <SignIn />} />
              <Route path='auth/register' element={<Register />}/>
              <Route path='auth/signin' element={<SignIn />}/>
              <Route path='verify-otp' element={<VerifyOTP />} />
              <Route path='reset-password/:token' element={<ResetPassword />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='history' element={<History />} />
              <Route path='worker_history' element={<WorkerHistoryPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </AnimatePresence>
        </UserCredsContext.Provider>
      </themesContext.Provider>
    </>
  )
}