import React from 'react'
import styles from './BorderedButton.module.css'

export default function BorderedButton({ title, onClick }) {
    return (
        <button
className={styles.button}
            onClick={onClick}
        >{title || 'Bordered Button'}</button>
    )
}
