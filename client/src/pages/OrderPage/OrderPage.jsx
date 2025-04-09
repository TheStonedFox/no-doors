import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './OrderPage.module.css'
import Field from '../../components/Field/Field'
import Button from '../../components/Button/Button'
import RadioButtonGroup from '../../components/RadioButtonGroup/RadioButtonGroup'
import Input from '../../components/Input/Input'

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

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [fio, setFio] = useState('')

    const [, userData, sum,] = useCart()

    useEffect(() => console.log(fio + phone + email), [fio, phone, email])
    return (
        <div className={styles['order-page']}>
            <h2 className={`${'section-title'} ${styles['order-page__title']}`}>Оформление заказа</h2>
            <div className={styles['order-page__layout']}>
                <section className={styles['contacts-data']}>
                    <h3 className={styles['contacts-data__title']}>Контактные данные</h3>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>ФИО:</h5>
                        <Input onChange={(value) => setFio(value)} placeholder='ФИО' type='text' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Телефон:</h5>
                        <Input onChange={(value) => setPhone(value)} placeholder='Телефон' type='tel' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Электронная почта:</h5>
                        <Input onChange={(value) => setEmail(value)} placeholder='example@mail.com' type='email' />
                    </div>
                    <div className={styles['contacts-data__delivery-method']}>
                        <h3 className={styles['delivery-method__title']}>Способ получения</h3>
                        <RadioButtonGroup style={styles['delivery-method__radio-buttons']} options={['Доставка 100 ₴', 'Самовывоз бесплатно']} onSelect={(value) => setDelivery(value)} />
                    </div>
                </section>
                <section className={styles['result']}>
                    <h2 className={`${'section-title'} ${styles['result__title']}`}>Итого</h2>
                    <div className={styles['result__fields']}>
                        <Field tittle={`${userData?.cartItems.length} товар${getWordEnding(userData?.cartItems.length)} на суму`} value={`${sum} ₴`}></Field>
                        <Field tittle='Ваша скидка' value='10%'></Field>
                        <Field tittle='Стоимость доставки' value={`${delivery === 0 ? '100 ₴' : '0 ₴'}`}></Field>
                    </div>
                    <Field tittle='Итого к оплате' value={`${delivery === 0 ? sum : sum + 100} ₴`}></Field>
                    <div className={styles['pay-methods']}>
                        <h3 className={styles['pay-methods__title']}>Способ оплаты</h3>
                        <RadioButtonGroup style={styles['pay-methods__radio-buttons']} options={['Оплата при получении', 'Онлайн оплата']} onSelect={(value) => setPay(value)} />
                        <Button title='Подтвердить заказ' onClick={() => {


                            if (!fio || !/^(\s*\S+\s+\S+\s+\S.*)$/.test(fio))
                                alert('fio!!')

                            if (!phone || phone.length < 10)
                                alert('тел!!')

                            if (!email || email.length < 5)
                                alert('em!!')
                        }} />
                        <p className={styles['pay-methods__policy']}>Нажимая на кнопку «Подтвердить заказ», Вы подтверждаете,
                            что даете согласие на <a href="#">обработку персональных данных.</a></p>
                    </div>
                </section>
            </div >
        </div >
    )
}
