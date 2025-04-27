import React from 'react'
import styles from './SearchInput.module.css'

import SearchIcon from '../../SvgIcons/SearchIcon'

export default function SearchInput({ className }) {
    return (
        <div className={className} >
            <input className={styles.input} type="text" placeholder='Введите поисковой запрос..' />
            <button className={styles.button}>
                <SearchIcon />
                <p>Найти</p>
            </button>
        </div>

    )
}
