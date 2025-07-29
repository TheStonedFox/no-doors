import React, { useEffect, useState } from 'react'
import styles from './SearchInput.module.css'

import SearchResult from '../SearchResult/SearchResult'

import SearchIcon from '../../svgIcons/SearchIcon'
import { getProducts } from '../../api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSearchResults } from '../../features/uiSlice'
import useSearchResults from '../../hooks/useSearchResults'
import useProducts from '../../hooks/useProducts'

export default function SearchInput({ className, value, onChange }) {

    const dispatch = useDispatch()
    const negative = useNavigate()

    const [searchList, isLoading, error] = useSearchResults(value)

    useEffect(() => { error && window.innerWidth <= 992 && alert(`Не удалось загрузить товары. ${error}`) }, [error, value])

    const isSearchResultsOpen = useSelector((state) => state.ui.isSearchResultsOpen)

    return (
        <div id='search-input' className={`${styles['search-input']} ${className ? className : ''}`}
            onFocus={() => { dispatch(toggleSearchResults(true)) }}>
            <div className={styles['wrapper']}>
                <input id='search-input' className={styles.input}
                    type="text"
                    placeholder='Введите поисковой запрос..'
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete='off'
                />
                <button className={styles.button} onClick={() => value && negative(`/search?word=${value}`)}>
                    <SearchIcon />
                    <p>Найти</p>
                </button>
            </div>
            {window.outerWidth > 992 ? <SearchResult itemsList={value && isSearchResultsOpen ? searchList : []} /> : null}
        </div>

    )
}
