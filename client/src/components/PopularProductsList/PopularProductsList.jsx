import styles from './PopularProductsList.module.css'
import { IoChevronBackOutline } from "react-icons/io5"
import ProductCard from '../../components/ProductCard/ProductCard'
import { useRef } from 'react'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder'
import useProducts from '@hooks/useProducts'

import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'

export default function PopularProductsList() {
    const productsListRef = useRef(null)

    const { products, isLoading, error, refetch } = useProducts()

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
                {!isLoading && !error && <section className={styles['header__buttons']}>
                    <button onClick={() => onScrollButtonClick('left')} className={styles['header__button']} type='button'>
                        <IoChevronBackOutline />
                    </button>
                    <button onClick={() => onScrollButtonClick('right')} className={styles['header__button']} type='button'>
                        <IoChevronBackOutline style={{ transform: 'rotate(180deg)' }} />
                    </button>
                </section>}
            </section>

            {!isLoading ? <section className={styles['popular-products__list']} ref={productsListRef}>
                {products?.map((product, index) => index < 12 && <ProductCard productData={product} key={product._id} />)}
            </section> : <SkeletonLadingShimmer style={{ height: '438px', with: '100%' }} />}

            {!isLoading && error &&
                <EmptyPlaceholder title='Не удалось получить список товаров.' action={refetch} actionTitle='Попробовать еще раз' />}
        </section>
    )
}
