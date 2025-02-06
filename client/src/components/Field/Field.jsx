import React from 'react'
import styles from './Field.module.css'

export default function Field({ tittle, value }) {
    return (
        <div className={styles.field}>
            <p className={styles.field__title}>{tittle}</p>
            <strong className={styles.field__value}>{value}</strong>
        </div>
    )
}
