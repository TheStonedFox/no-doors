import React from 'react'
import styles from './BorderedButton.module.css'

export default function BorderedButton({ children }) {
    return (
        <button className={styles.button}>{children || 'BorderedButton'}</button>
    )
}
