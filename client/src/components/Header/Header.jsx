import React, { useEffect, useReducer, useState } from 'react'
import styles from './Header.module.css'
import { Link, useLocation } from 'react-router-dom'

import SearchInput from '../SearchInput/SearchInput'
import CatalogMenu from '../CatalogMenu/CatalogMenu'
import BurgerMenu from '../BurgerMenu/BurgerMenu'
import Logo from '@/SvgIcons/Logo'
import PhoneIcon from '@/SvgIcons/PhoneIcon'
import SearchIcon from '@/svgIcons/SearchIcon'

import { toggleBurger, toggleCatalog, toggleSearchResults } from '../../redux/features/uiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../redux/features/userSlice'

import FavoriteIcon from './HeaderFavoriteIcon'
import CartIcon from './CartIcon'
import MoreArrowIcon from '@/svgIcons/MoreArrowIcon'
import SearchResult from '../SearchResult/SearchResult'
import useSearchResults from '../../hooks/useSearchResults'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import DropDownMenu from '../DropDownMenu/DropDownMenu'

export default function Header() {
    const dispatch = useDispatch()

    const isCatalogOpen = useSelector((state) => state.ui.isCatalogOpen)
    const isBurgerOpen = useSelector((state) => state.ui.isBurgerOpen)
    const isSearchResultsOpen = useSelector((state) => state.ui.isSearchResultsOpen)
    const userData = useSelector((state) => state.user.userData)

    const { brands, categories, error: dropDownValuesError, isLoading: dropDownValuesLoadingStatus } = useSelector(state => state.shared.chooseValues)

    const [fixedMobileInput, setFixedMobileInput] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const [searchList, isLoading, error] = useSearchResults(searchValue)

    const cartCounter = userData?.cartItems.length || 0
    const favoriteCounter = userData?.favoriteItems.length || 0

    const scrollHandler = () => setFixedMobileInput(window.scrollY > 160 ? true : false)

    useEffect(() => { dropDownValuesError && alert(dropDownValuesError) }, [dropDownValuesError])

    useEffect(() => {
        dispatch(setUserData())
        window.addEventListener('scroll', scrollHandler)

        return () => removeEventListener('scroll', scrollHandler)
    }, [dispatch])

    return (
        <header className={styles.header}>
            <div className={styles['header__top-content']}>
                <ul className={styles['header__top-links']}>
                    <Link to="/about">О компании</Link>
                    <Link to="/delivery-and-pay">Доставка и оплата</Link>
                    <Link to="/guarantees">Гарантии</Link>
                    <Link to="/contacts">Контакты</Link>
                </ul>
                <div className={styles['header__top-buttons']}>
                    <div className={styles['header__phone-number']}>
                        <PhoneIcon color='var(--typography---main)' />
                        <a href="tel:+79652374449">{'+380 (965) 237-44-49'}</a>
                    </div>
                    {/* <LanguageDropdown /> */}
                    <ThemeToggle />
                    <Link to={useSelector((state) => state.user.isTokenValid) ? '/profile' : '/auth'}>Личный кабинет</Link>
                </div>
            </div>
            <div className={styles['header__middle-content']}>
                <button className={styles.burger} style={{ zIndex: 1001 }} type="button" onClick={() => dispatch(toggleBurger())}>
                    <div className={styles.lines}>
                        <span className={`${styles.line} ${isBurgerOpen ? styles['line_active'] : ''}`}></span>
                        <span className={`${styles.line} ${isBurgerOpen ? styles.hide : ''}`}></span>
                        <span className={`${styles.line} ${isBurgerOpen ? styles['line_active'] : ''}`}></span>
                    </div>
                    <h3>Меню</h3>
                </button>
                <Link to="/" className={styles['header__logo']}>
                    <Logo color='var(--typography---main)' />
                </Link>
                <SearchInput className={styles['header__search-input']} value={searchValue} onChange={(value) => setSearchValue(value)} />
                <div className={styles['header__middle-buttons']}>
                    <Link to="/favorites" className={styles['header__middle-button']}>
                        <FavoriteIcon />
                        <p>Избранное</p>
                        <div style={!favoriteCounter ? { display: 'none' } : null}>
                            {favoriteCounter}
                        </div>
                    </Link>
                    <Link to="/cart" className={styles['header__middle-button']}>
                        <CartIcon />
                        <p>Моя корзина</p>
                        <div style={!cartCounter ? { display: 'none' } : null}>
                            {cartCounter}
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles['header__bottom-content']}>
                <ul className={styles['header__brands-list']}>
                    <li>
                        <DropDownMenu title='Apple' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[0]} categories={categories} />
                    </li>
                    <li>
                        <DropDownMenu title='Huawei' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[1]} categories={categories} />
                        <MoreArrowIcon />
                    </li>
                    <li>
                        <DropDownMenu title='Xiaomi' deviceTypes={['phones', 'tablets', 'watches']} brandModels={brands[2]} categories={categories} />
                        <MoreArrowIcon />
                    </li>
                    <li>
                        <DropDownMenu title='Samsung'
                            deviceTypes={['phones', 'tablets', 'watches']}
                            brandModels={brands[3]}
                            categories={categories} />
                        <MoreArrowIcon />
                    </li>
                    <Link>Питание и кабели</Link>
                    <Link>Powerbank</Link>
                    <Link>Акции</Link>
                    <div>
                        <Link className={styles['header__price-link']}>Прайс-лист</Link>
                    </div>
                </ul>
            </div>
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
