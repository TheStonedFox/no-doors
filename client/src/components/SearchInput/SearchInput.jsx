import styles from './SearchInput.module.css'

import SearchResult from '../SearchResult/SearchResult'

import SearchIcon from '@/svg/SearchIcon'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSearchResults } from '../../redux/features/uiSlice'
import useSearchResults from '../../hooks/useSearchResults'

export default function SearchInput({ className, value, onChange }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isSearchResultsOpen = useSelector((state) => state.ui.isSearchResultsOpen)

    const [searchList, error] = useSearchResults(value)

    return (
        <div id='search-input' className={`${styles['search-input']} ${className ? className : ''}`}
            onFocus={() => dispatch(toggleSearchResults(true))} >
            <div className={styles['wrapper']}>
                <input id='search-input' className={styles['input']}
                    type="search"
                    placeholder='Введите поисковой запрос...'
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && navigate(`/search?word=${value}`)}
                    autoComplete='off'
                />
                <button className={styles['button']} onClick={() => value && navigate(`/search?word=${value}`)}>
                    <SearchIcon />
                    <p>Найти</p>
                </button>
            </div>
            {window.outerWidth > 800 && <SearchResult itemsList={value && isSearchResultsOpen ? searchList : []} />}
        </div>

    )
}
