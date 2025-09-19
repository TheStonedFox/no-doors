import styles from './SearchResult.module.css'
import SearchResultItem from './SearchResultItem/SearchResultItem'
import { useEffect, useRef, useState } from 'react'

export default function SearchResult({ itemsList, className }) {

    const [visibleItems, setVisibleItems] = useState(20)
    const itemsListRef = useRef(null)

    const scrollHandler = () => setScrollTop(itemsListRef.current.scrollTop)
    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        if (scrollTop / itemsListRef.current.scrollHeight > 0.8 && visibleItems < itemsList.length)
            setVisibleItems(prev => prev + 20)
    }, [scrollTop])

    useEffect(() => {
        setVisibleItems(20)
        itemsListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }, [itemsList])

    return (
        <div id='search-result' className={`${styles['search-result']} ${className ? className : ''}`}
            style={!itemsList?.length ? { maxHeight: '0px', boxShadow: 'none', transition: '0.2s maxHeight', padding: 0, border: 'transparent' } : null}>
            <div className={styles['search-result__items']} ref={itemsListRef} onScroll={scrollHandler}>
                {itemsList?.map((item, i) => i < visibleItems && <SearchResultItem itemInfo={item} key={item._id} />)}
            </div>
        </div >
    )
}
