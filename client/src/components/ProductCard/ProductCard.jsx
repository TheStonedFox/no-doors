import React from 'react'

import Field from '../Field/Field'
import Counter from '../Counter/Counter'
import BorderedButton from '../BorderedButton/BorderedButton'
import styles from './ProductCard.module.css'

export default function ProductCard({ data }) {
    return (
        <div className={styles['product-card']}>
            <div className={styles['product-card__image']}>
                <img src="../../../public/images/product-img.png" alt="product image" />
            </div>
            <svg className={styles['product-card__fav-button']} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0064 4.45274L10.5367 3.92241L11.0836 3.37546C11.9905 2.46862 13.1905 1.97122 14.4711 1.97122C15.7525 1.97122 16.948 2.465 17.8542 3.37122C18.7601 4.27705 19.2536 5.47601 19.25 6.75647V6.75862C19.25 8.03906 18.7527 9.239 17.846 10.1458C17.8459 10.1459 17.8458 10.146 17.8457 10.146L9.996 17.9666L2.1585 10.1291C1.25019 9.22075 0.750023 8.02436 0.750026 6.7459L0.75002 6.74375C0.746355 5.46477 1.24314 4.26538 2.15002 3.3585C3.05253 2.45599 4.25252 1.9585 5.52895 1.9585C6.80863 1.9585 8.01315 2.45953 8.92059 3.36698L9.47603 3.92241L10.0064 4.45274ZM9.86611 18.096C9.86644 18.0956 9.86677 18.0953 9.8671 18.095L9.86611 18.096Z" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <div className={styles['product-card__bottom-box']}>
                <h2 className={styles['product-card__title']}>{data.title}</h2>
                <div className={styles['product-card__fields']}>
                    <Field tittle='Розница:' value={data.retailPrice + '₽'} />
                    <Field tittle='Оптом (от 5 штук):' value={data.retailPrice + '₽'} />
                    <Field tittle='В наличии:' value={data.stock + 'шт.'} />
                </div>
                <div className={styles['product-card__bottom']}>
                    <Counter />
                    <BorderedButton title='В корзину' />
                </div>
            </div>
        </div>
    )
}
