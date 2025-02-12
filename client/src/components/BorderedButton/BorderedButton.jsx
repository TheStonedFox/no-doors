import React from 'react'
import styles from './BorderedButton.module.css'

export default function BorderedButton({ title }) {
    return (
        <button className={styles.button}>{title || 'Bordered Button'}</button>
    )
}
