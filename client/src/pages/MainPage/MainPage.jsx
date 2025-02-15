import React from 'react'
import Slider from '../../components/Slider/Slider'
import styles from './MainPage.module.css'

import ChooseCard from '../../components/ChooseCard/ChooseCard'
import ItemsList from '../../components/ItemsList/ItemsList'
import ProductCard from '../../components/ProductCard/ProductCard'
import Advantages from '../../components/Advantages/Advantages'
import Gallery from '../../components/Gallery/gallery'

export default function MainPage() {
    const products = [
        {
            "title": "Дисплей для iPhone 13",
            "wholesalePrice": 12000,
            "retailPrice": 14000,
            "stock": 20
        },
        {
            "title": "Аккумулятор Samsung Galaxy S21",
            "wholesalePrice": 3500,
            "retailPrice": 4000,
            "stock": 50
        },
        {
            "title": "Камера основная Xiaomi Redmi Note 10",
            "wholesalePrice": 4500,
            "retailPrice": 5000,
            "stock": 30
        },
        {
            "title": "Разъем зарядки USB-C для OnePlus 9",
            "wholesalePrice": 800,
            "retailPrice": 1200,
            "stock": 100
        },
        {
            "title": "Шлейф кнопки питания для Huawei P30",
            "wholesalePrice": 1200,
            "retailPrice": 1500,
            "stock": 80
        },
        {
            "title": "Динамик разговорный для iPhone 11",
            "wholesalePrice": 900,
            "retailPrice": 1300,
            "stock": 60
        },
        {
            "title": "Микросхема управления питанием Qualcomm",
            "wholesalePrice": 7000,
            "retailPrice": 8500,
            "stock": 15
        },
        {
            "title": "Защитное стекло Gorilla Glass для Pixel 6",
            "wholesalePrice": 2500,
            "retailPrice": 3000,
            "stock": 40
        },
        {
            "title": "Антенна Wi-Fi для Samsung Note 20",
            "wholesalePrice": 1100,
            "retailPrice": 1400,
            "stock": 70
        },
        {
            "title": "Модуль NFC для iPhone XR",
            "wholesalePrice": 3000,
            "retailPrice": 3500,
            "stock": 25
        }
    ]


    return (
        <div className={styles['main-page']}>
            <section className={styles['find-item-section']}>
                <h2 className='section-title'>Выберите бренд</h2>
                <ItemsList>
                    <ChooseCard title='Apple' picture={'../../../public/images/brands/01.png'} />
                    <ChooseCard title='Huawei' picture={'../../../public/images/brands/02.png'} />
                    <ChooseCard title='Xiaomi' picture={'../../../public/images/brands/03.png'} />
                    <ChooseCard title='Samsung' picture={'../../../public/images/brands/04.png'} />
                </ItemsList>
            </section >
            <section className={styles['popular-products-section']}>
                <h2 className='section-title'>Популярные товары</h2>
                <ItemsList>
                    {products.map((product, index) => index < 4 && <ProductCard key={index} data={product} />)}
                </ItemsList>
            </section>
            <section className={styles['advantages-section']}>
                <Advantages />
            </section>
            <section className={styles['about-section']}>
                <h2>No Doors Technology - продажа аксессуаров и запчастей для мобильных телефонов оптом</h2>
                <p>Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки существенных финансовых и административных условий. С другой стороны укрепление и развитие структуры требуют от нас анализа новых предложений. Таким образом рамки и место обучения кадров позволяет оценить значение системы обучения кадров, соответствует насущным потребностям. </p>
                <p>Товарищи! дальнейшее развитие различных форм деятельности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Задача организации, в особенности же постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же начало повседневной работы по формированию позиции в значительной степени обуславливает создание дальнейших направлений.</p>
            </section>
            <section className={styles['gallery-section']}>
                <Gallery />
            </section>
        </div>

    )
}
