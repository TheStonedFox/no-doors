import React from 'react'

import styles from './ChooseCard.module.css'
import ArrowIcon from './ArrowIcon'
export default function ChooseCard({ picture, title, onClick }) {
    return (
        <div
            className={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.querySelector('h3').style = 'color: var(--ui---main);'
                e.currentTarget.querySelector('svg').style = 'width: 24px'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.querySelector('h3').style = ''
                e.currentTarget.querySelector('svg').style = 'width: 0px'
            }}
            onClick={onClick}
        >
            <img src={picture} alt="choose-card-image" />
            <div className={styles.title}>
                <h3>{title}</h3>
                <ArrowIcon />
            </div>
        </div>
    )
}
