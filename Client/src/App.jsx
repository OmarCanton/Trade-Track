import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Register from "./Pages/Register/Register"
import SignIn from './Pages/SignIn/SignIn'
import VerifyOTP from './Pages/VerifyOTP/VerifyOTP'
import { themesContext } from './Context/themeContext'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Home from './Pages/Home/Home'
import PageNotFound from './Pages/PageNotFound/PageNotFound'
import ResetPassword from './Pages/ResetPassword/ResetPasssword'
import ContactAdmin from './Pages/ContactAdmin/ContactAdmin'
import Dashboard from './Pages/Dashboards/Dashboard'
import History from './Pages/History/History'
import WorkerHistoryPage from './Pages/WorkerHistoryPage/WorkerHistoryPage'
import { useSelector } from 'react-redux'
import { authed_user } from './Redux/Slices/AuthSlice'

export default function App() {
  const user = useSelector(authed_user)
  const isLoggedIn = user?.isAuthenticated
  const canAccess = user?.canAccess
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  const [showThemeOverlay, setShowThemeOverlay] = useState(false)

  const location = useLocation()

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
      }}>
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route index path='/' 
              element={
                (() => {
                  if(!canAccess) {
                    return <ContactAdmin />
                  } else {
                    if(!isLoggedIn) {
                      return <SignIn />
                    } else {
                      return <Home />
                    }
                  }
              })()
            } />
            <Route path='auth/register' element={<Register />}/>
            <Route path='auth/signin' element={<SignIn />}/>
            <Route path='verify-otp/:id' element={<VerifyOTP />} />
            <Route path='reset-password/:token' element={<ResetPassword />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='history' element={<History />} />
            <Route path='worker_history' element={<WorkerHistoryPage />} />
            <Route path='contact_admin' element={<ContactAdmin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AnimatePresence>
      </themesContext.Provider>
    </>
  )
}