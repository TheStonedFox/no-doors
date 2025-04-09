import React from 'react'
import styles from './Button.module.css'

export default function Button({ children, className, onClick, title }) {
    return (
        <button className={`${styles.button} ${className || ''}`} onClick={onClick}>{title}</button>
    )
}
