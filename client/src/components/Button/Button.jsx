import React from 'react'
import styles from './Button.module.css'

export default function Button({ className, onClick, title, type }) {
    return (
        <button className={`${styles.button} ${className || ''}`}
            type={type}
            onClick={onClick}>{title}</button>
    )
}
