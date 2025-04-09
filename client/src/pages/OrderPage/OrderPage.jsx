import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './OrderPage.module.css'
import Field from '../../components/Field/Field'
import Button from '../../components/Button/Button'
import RadioButtonGroup from '../../components/RadioButtonGroup/RadioButtonGroup'

import { useCart } from '../../hooks/useCart'

export default function OrderPage() {
    const getWordEnding = (value) => {
        if (value % 100 >= 11 && value % 100 <= 14) return 'ов'
        if (value % 10 === 1) return ''
        if (value % 10 >= 2 && value % 10 <= 4) return 'а'
        return "ов"
    }

    const [delivery, setDelivery] = useState(0)
    const [pay, setPay] = useState(0)
    useEffect(() => console.log(`delivery ${delivery}, pay ${pay}`), [pay, delivery])
    const [, userData, sum,] = useCart()

    return (
        <div className={styles['order-page']}>
            <h2 className={`${'section-title'} ${styles['order-page__title']}`}>Оформление заказа</h2>
            <div className={styles['order-page__layout']}>
                <section className={styles['contacts-data']}>
                    <h3 className={styles['contacts-data__title']}>Контактные данные</h3>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>ФИО:</h5>
                        <input type="text" className={styles['contacts-data__input']} placeholder='ФИО' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Телефон:</h5>
                        <input type="tel" className={styles['contacts-data__input']} placeholder='+380 (9_ _) _ _ _ - _ _ - _ _' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Электронная почта:</h5>
                        <input type="email" className={styles['contacts-data__input']} placeholder='example@mail.ru' />
                    </div>
                    <div className={styles['contacts-data__delivery-method']}>
                        <h3 className={styles['delivery-method__title']}>Способ получения</h3>
                        <RadioButtonGroup style={styles['delivery-method__radio-buttons']} options={['Доставка 300 ₴', 'Самовывоз бесплатно']} onSelect={(value) => {
                            setDelivery(value)
                        }} />
                    </div>
                </section>
                <section className={styles['result']}>
                    <h2 className={`${'section-title'} ${styles['result__title']}`}>Итого</h2>
                    <div className={styles['result__fields']}>
                        <Field tittle={`${userData?.cartItems.length} товар${getWordEnding(userData?.cartItems.length)} на суму`} value={`${sum} ₴`}></Field>
                        <Field tittle='Ваша скидка' value='10%'></Field>
                        <Field tittle='Стоимость доставки' value='100 ₴'></Field>
                    </div>
                    <Field tittle='Итого к оплате' value={`${sum + 100} ₴`}></Field>
                    <div className={styles['pay-methods']}>
                        <h3 className={styles['pay-methods__title']}>Способ оплаты</h3>
                        <RadioButtonGroup style={styles['pay-methods__radio-buttons']} options={['Оплата при получении', 'Онлайн оплата']} onSelect={(value) => {
                            setPay(value)
                        }} />
                        <Button title='Подтвердить заказ' />
                        <p className={styles['pay-methods__policy']}>Нажимая на кнопку «Подтвердить заказ», Вы подтверждаете,
                            что даете согласие на <a href="#">обработку персональных данных.</a></p>
                    </div>
                </section>
            </div >
        </div >
    )
}
