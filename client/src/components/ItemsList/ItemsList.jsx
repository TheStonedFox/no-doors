import React, { useState } from 'react'

import styles from './ItemsList.module.css'
import Button from '../Button/Button'

export default function ItemsList({ children, className }) {
    const [loadedItemsCount, setLoadedItemsCount] = useState(0)
    return (
        <div className={`${styles['items-list']} ${className ? className : ''}`}>
            {children}
        </ div>
    )
}
