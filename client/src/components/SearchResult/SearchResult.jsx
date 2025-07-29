import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import styles from './SearchResult.module.css'

import SearchResultItem from './SearchResultItem/SearchResultItem'

export default function SearchResult({ itemsList, className }) {

    const isSearchResultsOpen = useSelector((state) => state.ui.isSearchResultsOpen)

    return (
        <div id='search-result' className={`${styles['search-result']} ${className ? className : ''}`}
            style={!itemsList?.length ? { maxHeight: '0px', boxShadow: 'none', transition: '0.2s maxHeight', padding: 0, border: 'transparent' } : null}>
            <div className={styles['search-result__items']}>
                {itemsList?.map(item => <SearchResultItem itemInfo={item} key={item._id} />)}
            </div>
        </div >
    )
}
