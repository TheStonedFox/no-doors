import styles from './PopularProductsList.module.css'
import { IoChevronBackOutline } from "react-icons/io5"
import ProductCard from '../../components/ProductCard/ProductCard'
import { useRef } from 'react'

export default function PopularProductsList({ products }) {
    const productsListRef = useRef(null)

    const onScrollButtonClick = (direction) => {
        direction === 'right' && productsListRef.current.scrollBy({
            left: +270,
            behavior: 'smooth'
        })

        direction === 'left' && productsListRef.current.scrollBy({
            left: -270,
            behavior: 'smooth'
        })

    }
    return (
        <section className={styles['main-page__popular-products-section']}>
            <section className={styles['products-section__header']}>
                <h2 className='section-title'>Популярные товары</h2>
                <section className={styles['header__buttons']}>
                    <button onClick={() => onScrollButtonClick('left')} className={styles['header__button']} type='button'>
                        <IoChevronBackOutline />
                    </button>
                    <button onClick={() => onScrollButtonClick('right')} className={styles['header__button']} type='button'>
                        <IoChevronBackOutline style={{ transform: 'rotate(180deg)' }} />
                    </button>
                </section>
            </section>

            <section className={styles['popular-products__list']} ref={productsListRef}>
                {products?.map((product, index) => index < 12 && <ProductCard productData={product} key={product._id} />)}
            </section>
        </section>
    )
}
