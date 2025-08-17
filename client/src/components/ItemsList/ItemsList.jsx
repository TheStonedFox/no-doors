import { useState } from 'react'

import styles from './ItemsList.module.css'

export default function ItemsList({ children, className }) {
    const [loadedItemsCount, setLoadedItemsCount] = useState(0)
    return (
        <div className={`${styles['items-list']} ${className ? className : ''}`}>
            {children}
        </ div>
    )
}
