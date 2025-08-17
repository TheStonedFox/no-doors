import { useEffect, useState } from 'react'
import styles from './Header.module.css'

import CatalogMenu from '../CatalogMenu/CatalogMenu'
import BurgerMenu from '../BurgerMenu/BurgerMenu'
import SearchIcon from '@/svg/SearchIcon'

import { toggleCatalog, toggleSearchResults } from '../../redux/features/uiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../redux/features/userSlice'

import SearchResult from '../SearchResult/SearchResult'
import useSearchResults from '../../hooks/useSearchResults'

import HeaderTopContent from './HeaderTopContent/HeaderTopContent'
import HeaderMiddleContent from './HeaderMiddleContent/HeaderMiddleContent'
import HeaderBottomContent from './HeaderBottomContent/HeaderBottomContent'

export default function Header() {
    const dispatch = useDispatch()

    const isCatalogOpen = useSelector((state) => state.ui.isCatalogOpen)
    const isSearchResultsOpen = useSelector((state) => state.ui.isSearchResultsOpen)

    const [fixedMobileInput, setFixedMobileInput] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const [searchList, isLoading, error] = useSearchResults(searchValue)

    const scrollHandler = () => setFixedMobileInput(window.scrollY > 160 ? true : false)


    useEffect(() => {
        dispatch(setUserData())
        window.addEventListener('scroll', scrollHandler)

        return () => removeEventListener('scroll', scrollHandler)
    }, [dispatch])

    return (
        <header className={styles.header}>
            <HeaderTopContent />
            <HeaderMiddleContent />
            <HeaderBottomContent />

            <div className={styles['header__mobile-input']} style={{ position: fixedMobileInput ? 'fixed' : 'static' }}>
                <button className={`${styles.burger} ${isSearchResultsOpen ? styles['hide-burger'] : ''}`}
                    type="button"
                    onClick={() => dispatch(toggleCatalog())} >
                    <div className={styles.lines}>
                        <span className={`${styles.line} ${isCatalogOpen ? styles['line_active'] : ''}`} style={{ backgroundColor: isCatalogOpen ? '#000' : '#fff' }}
                        ></span>
                        <span className={`${styles.line} ${isCatalogOpen ? styles.hide : ''}`} style={{ backgroundColor: isCatalogOpen ? '#000' : '#fff' }}
                        ></span>
                        <span className={`${styles.line} ${isCatalogOpen ? styles['line_active'] : ''}`} style={{ backgroundColor: isCatalogOpen ? '#000' : '#fff' }}
                        ></span>
                    </div>
                    <h3 style={{ color: isCatalogOpen ? '#000' : '#fff' }}>Каталог</h3>
                </button>
                <div className={styles['input-container']} style={{ paddingLeft: isSearchResultsOpen ? '0' : '18px', border: isSearchResultsOpen ? '0' : '' }}>
                    <SearchIcon />
                    <input id='search-input' type="text" placeholder="Поиск товара" autoComplete='off' value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        onFocus={() => searchValue && dispatch(toggleSearchResults(true))} />
                    {<SearchResult className={styles['mobile-input__search-result']}
                        itemsList={searchValue && isSearchResultsOpen ? searchList : []} />}
                </div>
                <CatalogMenu />
            </div>
            <BurgerMenu />
        </header>
    )
}
