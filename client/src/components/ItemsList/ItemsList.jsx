import React from 'react'

import styles from './ItemsList.module.css'

export default function ItemsList({ children }) {
    return (
        <div className={styles['items-list']}>{children}</div>
    )
}
