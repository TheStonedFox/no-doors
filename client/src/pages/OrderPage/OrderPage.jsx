import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from './OrderPage.module.css'
import Field from '@components/Field/Field'
import Button from '@components/Button/Button'
import RadioButtonGroup from '@components/RadioButtonGroup/RadioButtonGroup'
import Input from '@components/Input/Input'
import SuggestionInput from '@components/SuggestionInput/SuggestionInput'


import { addNotification } from '../../redux/features/uiSlice'
import { setUserData } from '../../redux/features/userSlice'

import getWordEnding from '@utils/getWordEnding'

import { usePostInfo } from '@hooks/usePostInfo'
import { useCart } from '@hooks/useCart'

import { makeOrder } from '@api/api'



export default function OrderPage() {

    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)
    const dispatch = useDispatch()

    const [selectedOptions, setSelectedOptions] = useState({ deliveryMethod: 0, payMethod: 0 })
    const [userInfo, setUserInfo] = useState({ fio: null, phone: null, email: null, city: null, postOffice: null, address: null })
    const [validationErrors, setValidationErrors] = useState([])

    const cityRegExp = new RegExp(`^${userInfo.city?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'i')

    const [, userData, sum,] = useCart()
    const [postOfficeData, cities] = usePostInfo({ selectedCity: userInfo.city })

    useEffect(() => {
        const { fio, phone, email, city, postOffice } = userData || {}
        setUserInfo(prev => ({ ...prev, fio, phone, email, city, postOffice }))
    }, [userData])

    useEffect(() => {
        if (selectedOptions.deliveryMethod === 0)
            setUserInfo(prev => ({ ...prev, address: null }))
    }, [selectedOptions])

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
                            value={userInfo.fio ? userInfo.fio : userData?.fio}
                            placeholder='ФИО' type='text' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Телефон:</h5>
                        <Input
                            id='phone'
                            errorFrame={validationErrors.find(error => error.path === 'phone')}
                            value={userInfo.phone ? userInfo.phone : userData?.phone}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, phone: value }))} placeholder='Телефон' type='tel' />
                    </div>
                    <div className={styles['contacts-data__input-box']}>
                        <h5 className={styles['contacts-data__input-title']}>Электронная почта:</h5>
                        <Input
                            id='email'
                            errorFrame={validationErrors.find(error => error.path === 'email')}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, email: value }))}
                            value={userInfo.email ? userInfo.email : userData?.email}
                            placeholder='example@mail.com' type='email' />
                    </div>
                    <div className={styles['contacts-data__delivery-method']}>
                        <h3 className={styles['delivery-method__title']}>Способ получения</h3>
                        <RadioButtonGroup className={styles['delivery-method__radio-buttons']} options={['Доставка 100 ₴', 'Самовывоз бесплатно']}
                            onSelect={(value) => setSelectedOptions(prev => ({ ...prev, deliveryMethod: value }))} />
                    </div>
                    {selectedOptions.deliveryMethod === 0 &&
                        <div className={styles['contacts-data__field']}>
                            <div className={styles['contacts-data__input-box']}>
                                <h5 className={styles['contacts-data__input-title']}>Город: </h5>
                                <SuggestionInput
                                    className={styles['contacts-data__input']}
                                    type='text'
                                    value={userInfo.city}
                                    placeholder='Город'
                                    optionsList={cities?.filter(city => cityRegExp.test(city.title) && city.title !== userInfo.city).map(city => city.title)}
                                    onChange={(value) => setUserInfo(prev => ({ ...prev, city: value }))}
                                />
                            </div>

                            {userInfo.city && selectedOptions.deliveryMethod === 0 && <div className={styles['contacts-data__input-box']}>
                                <h5 className={styles['contacts-data__input-title']}>Отделение почты:</h5>
                                <SuggestionInput
                                    className={styles['contacts-data__input']}
                                    type='text'
                                    placeholder='Отделение №1, адрес'
                                    value={userInfo.postOffice}
                                    onChange={(value) => setUserInfo(prev => ({ ...prev, postOffice: value }))}
                                    optionsList={userInfo.postOffice ? postOfficeData?.departments.filter(department => department.includes(userInfo.postOffice)) : postOfficeData.departments}
                                />
                            </div>}
                        </div>}
                    {selectedOptions.deliveryMethod === 1 &&
                        <SuggestionInput placeholder='Выберете точку самовывоза' optionsList={['ул. Саксаганского, 53', 'проспект Победы, 67']} onChange={(value) => setUserInfo(prev => ({ ...prev, address: value }))}
                            errorFrame={validationErrors.find(error => error.path === 'address')}
                        />}
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
                        <RadioButtonGroup className={styles['pay-methods__radio-buttons']} options={['Оплата при получении', 'Онлайн оплата']}
                            onSelect={(value) => setSelectedOptions(prev => ({ ...prev, payMethod: value }))} />
                        <Button title='Подтвердить заказ' onClick={async () => {

                            const orderData = {
                                ...userInfo,
                                id: userData._id,
                                products: userData.cartItems,
                                sum,
                                deliveryMethod: selectedOptions.deliveryMethod === 0 ? 'delivery' : 'pickup',
                                paymentMethod: selectedOptions.payMethod === 0 ? 'offline' : 'online',
                                address: userInfo.address || '',
                            }
                            makeOrder(orderData)
                                .then(res => {
                                    setValidationErrors([])
                                    dispatch(setUserData())
                                    dispatch(addNotification({ type: 'success', text: res.message }))
                                })
                                .catch(error => {
                                    setValidationErrors(error.data.validationErrors || '')
                                    dispatch(addNotification(
                                        { type: 'error', text: `${error.message} (${error.data.validationErrors.length})` }))
                                })
                        }} />
                        <p className={styles['pay-methods__policy']}>Нажимая на кнопку «Подтвердить заказ», Вы подтверждаете,
                            что даете согласие на <a href="#">обработку персональных данных.</a></p>
                    </div>
                </section>
            </div >
        </div >
    )
}

