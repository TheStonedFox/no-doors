import React from 'react'

import styles from './FavoriteButton.module.css'
import FavoriteIcon from '../../svgIcons/FavoriteIcon'

export default function FavoriteButton({ isInFavorite, onClick, className }) {

    return (
        <div className={`${styles['favorite-button']} ${className ? className : ''}`} onClick={onClick}>
            <FavoriteIcon inFavorite={isInFavorite} />
            <p style={{ color: isInFavorite ? 'var(--ui---red)' : null }}>{isInFavorite ? 'В избранном' : 'В избранное'}</p>
        </div>
    )
}
