import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from './OrderPage.module.css'
import Field from '../../components/Field/Field'
import Button from '../../components/Button/Button'
import RadioButtonGroup from '../../components/RadioButtonGroup/RadioButtonGroup'
import Input from '../../components/Input/Input'
import SuggestionInput from '../../components/SuggestionInput/SuggestionInput'

import * as api from '../../api/api'

import { useCart } from '../../hooks/useCart'
import { togglePopup } from '../../features/uiSlice'
import { setUserData } from '../../features/userSlice'
import { data, useNavigate } from 'react-router-dom'

import getWordEnding from '../../utils/getWordEnding'

export default function OrderPage() {


    const isPopuoOpen = useSelector((state) => state.ui.isPopuoOpen)
    const dispactch = useDispatch()
    const negative = useNavigate()


    const [selectedOptions, setSelectedOptions] = useState({ deliveryMethod: 0, payMethod: 0 })
    const [userInfo, setUserInfo] = useState({ fio: null, phone: null, email: null, postOfice: null })
    const [validationErrors, setValidationErrors] = useState([])

    const [, userData, sum,] = useCart()

    // useEffect(() => console.log(userInfo), [userInfo])
    return (
        <div className={styles['order-page']}>
            <h2 className={`${'section-title'} ${styles['order-page__title']}`}>Оформление заказа</h2>
            <div className={styles['order-page__layout']}>
                <section className={styles['contacts-data']}>
                    <h3 className={styles['contacts-data__title']}>Контактные данные</h3>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>ФИО:</h5>
                        <Input
                            id='fio'
                            errorFrame={validationErrors.find(error => error.path === 'fio')}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, fio: value }))}
                            placeholder='ФИО' type='text' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Телефон:</h5>
                        <Input
                            id='phone'
                            errorFrame={validationErrors.find(error => error.path === 'phone')}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, phone: value }))} placeholder='Телефон' type='tel' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Электронная почта:</h5>
                        <Input
                            id='email'
                            errorFrame={validationErrors.find(error => error.path === 'email')}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, email: value }))}
                            placeholder='example@mail.com' type='email' />
                    </div>

                    <SuggestionInput placeholder='Выбирете город' optionsList={['Киев', 'харьков', 'Полтава', 'Львов', 'Сумы', 'Виница1', 'Виница2', 'Виница4', 'Виница5', 'Виниц6а',]} />
                    <div className={styles['contacts-data__delivery-method']}>
                        <h3 className={styles['delivery-method__title']}>Способ получения</h3>
                        <RadioButtonGroup style={styles['delivery-method__radio-buttons']} options={['Доставка 100 ₴', 'Самовывоз бесплатно']}
                            onSelect={(value) => setSelectedOptions(prev => ({ ...prev, deliveryMethod: value }))} />
                    </div>
                </section>
                <section className={styles['result']}>
                    <h2 className={`${'section-title'} ${styles['result__title']}`}>Итого</h2>
                    <div className={styles['result__fields']}>
                        <Field title={`${userData?.cartItems.length} товар${getWordEnding(userData?.cartItems.length)} на суму`} value={`${sum} ₴`}></Field>
                        <Field title='Ваша скидка' value='10%'></Field>
                        <Field title='Стоимость доставки' value={`${selectedOptions.delivery === 0 ? '100 ₴' : '0 ₴'}`}></Field>
                    </div>
                    <Field title='Итого к оплате' value={`${selectedOptions.delivery === 0 ? sum : sum + 100} ₴`}></Field>
                    <div className={styles['pay-methods']}>
                        <h3 className={styles['pay-methods__title']}>Способ оплаты</h3>
                        <RadioButtonGroup style={styles['pay-methods__radio-buttons']} options={['Оплата при получении', 'Онлайн оплата']}
                            onSelect={(value) => setSelectedOptions(prev => ({ ...prev, payMethod: value }))} />
                        <Button title='Подтвердить заказ' onClick={async () => {

                            const orderData = await api.makeOrder(
                                userInfo.fio,
                                userInfo.phone,
                                userInfo.email,
                                userData._id,
                                selectedOptions.deliveryMethod === 0 ? 'delivery' : 'pickup',
                                selectedOptions.payMethod === 0 ? 'offline' : 'online',
                                userData.address,
                                userData.cartItems,
                                sum
                            )

                            if (orderData.validationErrors)
                                return setValidationErrors(orderData.validationErrors)

                            setValidationErrors([])

                            dispactch(setUserData())
                            dispactch(togglePopup({ type: 'order-placed', data: userData?.orders.length + 1 }))
                        }
                        } />
                        <p className={styles['pay-methods__policy']}>Нажимая на кнопку «Подтвердить заказ», Вы подтверждаете,
                            что даете согласие на <a href="#">обработку персональных данных.</a></p>
                    </div>
                </section>
            </div >
        </div >
    )
}

