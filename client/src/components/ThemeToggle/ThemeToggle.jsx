import React, { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

import { FaSun } from "react-icons/fa"
import { FaMoon } from "react-icons/fa6"


export default function ThemeToggle({ className }) {
    const [theme, setTheme] = useState()

    useEffect(() => {
        !localStorage.getItem('theme') && localStorage.setItem('theme', 'light')
        setTheme(localStorage.getItem('theme'))
    }, [])

    useEffect(() => {
        if (theme === 'dark') {
            document.querySelector('#root').classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.querySelector('#root').classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [theme])

    return (
        <div className={`${styles['theme-toggle']} ${className || ''}`} style={{ backgroundColor: theme === 'dark' ? '#363636' : '#a7a7a7' }}>
            <span className={styles['theme-toggle__controller']} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                style={{ transform: theme === 'light' ? 'translateX(0%)' : 'translateX(100%)', transition: '0.2s' }}>
                {theme === 'light' ? <FaSun /> : null}
                {theme === 'dark' ? <FaMoon /> : null}
            </span>
        </div>
    )
}
