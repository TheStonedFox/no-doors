import { useEffect } from 'react'
import styles from './ThemeToggle.module.css'

import { FaSun } from "react-icons/fa"
import { FaMoon } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../redux/features/uiSlice'

export default function ThemeToggle({ className }) {

    const theme = useSelector(state => state.ui.theme)
    const dispatch = useDispatch()

    useEffect(() => { !localStorage.getItem('theme') && localStorage.setItem('theme', theme) }, [])

    useEffect(() => {
        if (theme === 'light')
            document.body.classList.remove('dark')
        else
            document.body.classList.add('dark')

        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className={`${styles['theme-toggle']} ${className || ''}`} style={{ backgroundColor: theme === 'light' ? '#a7a7a7' : '#363636' }}>
            <span className={styles['theme-toggle__controller']} onClick={() => dispatch(theme === 'light' ? setTheme('dark') : setTheme('light'))}
                style={{ transform: theme === 'light' ? 'translateX(0%)' : 'translateX(100%)', transition: '0.2s' }}>
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </span>
        </div >
    )
}
