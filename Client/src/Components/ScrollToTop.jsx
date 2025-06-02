import { ArrowUpwardRounded } from '@mui/icons-material'
import './Scroll.css'
import { useContext } from 'react'
import { themesContext } from '../Context/themeContext'
export default function ScrollToTop() {
    const { theme } = useContext(themesContext)

    const scroll = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    return (
        <div 
            className="wrapper-scroll"
            style={{...theme === 'light' && {backgroundColor: 'lightgrey'}}}
            onClick={scroll}
        >
            <ArrowUpwardRounded htmlColor='rgb(7, 141, 252) '/>
        </div>
    )
}