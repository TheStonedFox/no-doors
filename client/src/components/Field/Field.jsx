import React from 'react'
import styles from './Field.module.css'

export default function Field({ title, value, onClick }) {
    return (
        <div className={`${styles.field} ${onClick ? styles['clickable'] : ''}`}>
            <p className={styles.field__title}>{title}</p>
            <strong className={styles.field__value} onClick={onClick}>{value}</strong>
        </div>
    )
}
