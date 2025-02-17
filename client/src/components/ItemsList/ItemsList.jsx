import React from 'react'

import styles from './ItemsList.module.css'

export default function ItemsList({ children, className }) {
    return (
        <div className={`${styles['items-list']} ${className || ''}`}> {children}</ div>
    )
}
