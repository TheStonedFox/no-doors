import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './CatalogMenu.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { closeCatalog, toggleCatalog } from '../../redux/features/uiSlice'

import BrandTree from '../BrandTree/BrandTree'
import { generateId } from '../../utils/generateId'
import useSwipe from '../../hooks/useSwipe'


export default function CatalogMenu({ ref }) {
    const { brands } = useSelector(state => state.shared.chooseValues)

    const dispatch = useDispatch()
    const isCatalogOpen = useSelector((state) => state.ui.isCatalogOpen)

    const [fixedMobileInput, setFixedMobileInput] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState()

    const scrollHandler = () => setFixedMobileInput(window.scrollY > 160 ? true : false)

    const menuRef = useRef(null)
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
        isCatalogOpen,
        menuRef,
        () => dispatch(toggleCatalog())
    )

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => removeEventListener('scroll', scrollHandler)
    }, [])

    useEffect(() => {
        const catalogButton = document.getElementById('catalogButton')
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && !catalogButton.contains(event.target)) {
                dispatch(closeCatalog())
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuRef, dispatch])

    return (
        <div
            style={isCatalogOpen ? { transform: `translate(0px)` } :
                { transform: 'translate(-101%)', boxShadow: 'none' }}
            className={`${styles['catalog-menu']} ${fixedMobileInput ? styles['fixed-input-shifts'] : null}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            ref={menuRef} id='catalog-menu'>
            <div className={styles.box}>
                <ul className={styles.links}>
                    {brands?.map((brand, i) => <BrandTree key={generateId()} brand={brands[i]} onChange={(brand) => setSelectedBrand(brand)} isOpen={brand.title === selectedBrand} />)}

                    <Link to={'/search?word=Кабель'}>Питание и кабели</Link>
                    <Link to={'/search?word=Powerbank'}>Powerbank</Link>
                    <Link>Акции</Link>
                    <Link className={styles['price-link']}>Прайс-лист</Link>
                </ul>

            </div>

        </div >

    )
}


