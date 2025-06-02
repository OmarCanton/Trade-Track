import './ThemeChangeAnime.css'
import { useContext } from 'react'
import { themesContext } from '../Context/themeContext'

export default function ThemeChangeAnime() {
    const {theme} = useContext(themesContext)
    return (
        <div 
            style={{...theme === 'dark' && {backgroundColor: 'white'}}}
            className='themeChanger'
        ></div>  
    )
}
