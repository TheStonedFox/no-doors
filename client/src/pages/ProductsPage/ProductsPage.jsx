import { useState, useEffect } from 'react'

import ItemsList from '@components/ItemsList/ItemsList'
import ProductCard from '@components/ProductCard/ProductCard'
import Gallery from '@components/Gallery/Gallery'
import Advantages from '@components/Advantages/Advantages'

import styles from './ProductsPage.module.css'
import Button from '@components/Button/Button'

export default function ProductsPage() {

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(json => setProducts(json))
    }, [])

    return (
        <div className={styles['products-page']}>
            <section className={styles['products-list__section']}>
                <h2 className={`${'section-title'} ${styles['products-list__title']}`}>Шлейфы для iPhone XS Max</h2>
                <ItemsList className={styles['products-list__items']}>
                    {products.map((product, index) => index < 8 && <ProductCard productData={product} key={product._id} />)}
                </ItemsList>
                <Button className={styles['products-list__more-button']}>Показать еще</Button>
            </section>
            <section className='advantages-section'>
                <Advantages />
            </section>
            <section className='about-section'>
                <h2>No Doors Technology - продажа аксессуаров и запчастей для мобильных телефонов оптом</h2>
                <p>Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки существенных финансовых и административных условий. С другой стороны укрепление и развитие структуры требуют от нас анализа новых предложений. Таким образом рамки и место обучения кадров позволяет оценить значение системы обучения кадров, соответствует насущным потребностям. </p>
                <p>Товарищи! дальнейшее развитие различных форм деятельности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Задача организации, в особенности же постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же начало повседневной работы по формированию позиции в значительной степени обуславливает создание дальнейших направлений.</p>
            </section>
            <section className='gallery-section'>
                <Gallery />
            </section>
        </div>
    )
}
