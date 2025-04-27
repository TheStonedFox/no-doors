import React, { useEffect, useState } from 'react'

import { updateUserInfo } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import BorderedButton from '../../components/BorderedButton/BorderedButton'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import OrderCard from '../../components/OrderCard/OrderCard'

import styles from './ProfilePage.module.css'
import { checkToken, setUserData } from '../../features/userSlice'
import { togglePopup } from '../../features/uiSlice'
import SuggestionInput from '../../components/SuggestionInput/SuggestionInput'
import { usePostInfo } from '../../hooks/usePostInfo'


export default function ProfilePage() {

    const negative = useNavigate()
    const dispatch = useDispatch()

    const userData = useSelector((state => state.user.userData))

    const [action, setAction] = useState('info')
    const [userInfo, setUserInfo] = useState({ phone: null, email: null, city: null, postOffice: null })
    const [validationErrors, setValidationErrors] = useState([])

    const [postOfficeData, cities] = usePostInfo({ selectedCity: userInfo.city })

    const cityRegExp = new RegExp(`^${userInfo.city?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'i')
    const onSaveChangesButtonClick = async () => {
        try {
            setValidationErrors([])
            const { phone, email, city, fio, postOffice } = userData || {}
            const oldUserInfo = { fio, phone, email, city, postOffice }

            if (JSON.stringify(userInfo) === JSON.stringify(oldUserInfo)) return alert('Данные не менялись!')

            const res = await updateUserInfo(userInfo)

            if (res.validationErrors) return setValidationErrors(res.validationErrors)
            else if (res.msg === 'Пользователь не найден') return alert('Произошла ошибка')

            setAction('info')
            dispatch(togglePopup({ type: 'product-card', message: 'Данные сохранены!' }))
            dispatch(setUserData(res.user))
        } catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        const { fio, phone, email, city, postOffice } = userData || {}
        setUserInfo({ fio, phone, email, city, postOffice })
    }, [userData])

    useEffect(() => {
        if (userInfo.city !== userData?.city)
            return setUserInfo(prev => ({ ...prev, postOffice: null }))
        setUserInfo(prev => ({ ...prev, postOffice: userData?.postOffice }))
    }, [userInfo.city, userData])


    return (
        <div className={styles['profile-page']}>
            <section className='page-title-section'>
                <h1 className='section-title'>Личный кабинет</h1>
                <Link className='header-link' onClick={() => {
                    localStorage.removeItem('token')
                    dispatch(checkToken())
                }}>Выйти из аккаунта</Link>
            </section>
            <section className={styles['profile-page__layout']}>
                <section className={styles['profile-page__actions']}>
                    <div className={styles['actions__avatar']}>
                        {/* <img src="" alt="" /> */}
                        <svg width="126" height="126" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_46_1476)">
                                <path d="M44.2515 98.7878L25.453 109.042C24.3499 109.643 23.3585 110.383 22.436 111.189C33.3961 120.43 47.5443 126.005 63.0025 126.005C78.3465 126.005 92.4044 120.513 103.334 111.398C102.325 110.547 101.232 109.781 100.019 109.177L79.8895 99.1135C77.2886 97.813 75.6457 95.1551 75.6457 92.2474V84.3495C76.2116 83.7053 76.8582 82.8779 77.5501 81.9008C80.2937 78.0255 82.3692 73.7628 83.8075 69.2908C86.3894 68.4943 88.2914 66.1097 88.2914 63.2758V54.8454C88.2914 52.991 87.4664 51.3339 86.185 50.1737V37.9869C86.185 37.9869 88.6884 19.022 63.0048 19.022C37.3212 19.022 39.8247 37.9869 39.8247 37.9869V50.1737C38.5409 51.3339 37.7183 52.991 37.7183 54.8454V63.2758C37.7183 65.4964 38.8856 67.4506 40.633 68.5799C42.7395 77.7497 48.2551 84.3495 48.2551 84.3495V92.0525C48.2528 94.8579 46.7169 97.4422 44.2515 98.7878Z" fill="#313132" />
                                <path d="M64.0793 0.00938259C29.2901 -0.58498 0.603751 27.1337 0.00938801 61.9253C-0.32821 81.6486 8.4636 99.3773 22.462 111.169C23.3773 110.371 24.3592 109.638 25.4505 109.044L44.249 98.7901C46.7144 97.4444 48.2502 94.8601 48.2502 92.05V84.347C48.2502 84.347 42.7322 77.7472 40.6281 68.5774C38.8831 67.4481 37.7134 65.4962 37.7134 63.2733V54.8429C37.7134 52.9885 38.5383 51.3314 39.8198 50.1712V37.9844C39.8198 37.9844 37.3163 19.0195 62.9999 19.0195C88.6835 19.0195 86.1801 37.9844 86.1801 37.9844V50.1712C87.4639 51.3314 88.2865 52.9885 88.2865 54.8429V63.2733C88.2865 66.1072 86.3845 68.4918 83.8026 69.2883C82.3643 73.7603 80.2887 78.023 77.5452 81.8983C76.8533 82.8754 76.2067 83.7028 75.6408 84.347V92.2449C75.6408 95.1525 77.2837 97.8129 79.8846 99.111L100.014 109.175C101.222 109.779 102.313 110.542 103.319 111.391C116.894 100.069 125.665 83.1417 125.99 64.0793C126.59 29.2901 98.8709 0.603745 64.0793 0.00938259Z" fill="#252525" />
                            </g>
                            <defs>
                                <clipPath id="clip0_46_1476">
                                    <rect width="126" height="126" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <input type="file" id='select-image' accept=".jpg,.jpeg,.png" />
                        {action === 'edit' && <a href='' onClick={(event) => {
                            event.preventDefault()
                            document.querySelector('#select-image').click()
                        }}>Сменить аватар</a>}
                    </div>
                    <div className={styles['actions__text']}>
                        <p className={styles['actions__user-name']}>{userData?.fio}</p>
                        <p className={styles['actions__discount-value']}>Ваша скидка составляет: 10%</p>
                    </div>
                    <div className={styles['actions__buttons']}>
                        {action === 'history' && <Button title='Вернуться в личный кабинет' onClick={() => setAction('profile')} />}
                        {action !== 'edit' && <BorderedButton className={styles['actions__action-button']} title='Редактировать профиль' onClick={() => setAction('edit')} />}
                        {action !== 'history' && action !== 'edit' && <BorderedButton className={styles['actions__action-button']} title='Просмотренные товары' onClick={() => {
                            setAction('products')
                            negative('/profile/viewed-products')
                        }} />}
                        {action !== 'edit' && action !== 'history' && < BorderedButton className={styles['actions__action-button']} title='История заказов' onClick={() => setAction('history')} />}
                        {action === 'edit' && < div className={styles['action__edit-mode-buttons']}>
                            <Button title='Сохранить изменения' onClick={onSaveChangesButtonClick} />
                            <BorderedButton className={styles['actions__action-button']} title='Отменить редактирование' onClick={() => setAction('info')} />
                        </div>}
                    </div>
                </section>
                {action === 'info' && <section className={styles['profile-page__info']}>
                    <h3 className={styles['info__title']}>Мои данные:</h3>
                    <div className={styles['info__field']}>
                        <div className={styles['info__field']}>
                            <h5>Телефон:</h5>
                            <p>{userData?.phone}</p>
                        </div>
                        <div className={styles['info__field']}>
                            <h5>Электронная почта:</h5>
                            <p>{userData?.email}</p>
                        </div>
                        <div className={styles['info__field']}>
                            <h5>Отделение почты:</h5>
                            <p>{userData?.postOffice}</p>
                        </div>
                    </div>
                </section>}
                {action === 'edit' && <section className={styles['profile-page__edit-info']}>
                    <div className={styles['edit-info__field']}>
                        <p className={styles['edit-info__field-name']}>Телефон:</p>
                        <Input
                            className={styles['edit-info__input']}
                            type='tel'
                            placeholder='0123456789'
                            errorFrame={validationErrors.find(error => error.path === 'phone')}
                            value={userInfo.phone}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, phone: value }))} />
                    </div>
                    <div className={styles['edit-info__field']}>
                        <p className={styles['edit-info__field-name']}>Электронная почта:</p>
                        <Input className={styles['edit-info__input']}
                            type='email'
                            placeholder='example@mail.com'
                            errorFrame={validationErrors.find(error => error.path === 'email')}
                            value={userInfo.email}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, email: value }))} />
                    </div>
                    <div className={styles['edit-info__field']}>
                        <p className={styles['edit-info__field-name']}>Отделение почты:</p>
                        <SuggestionInput
                            className={styles['edit-info__input']}
                            type='text'
                            value={userInfo.city}
                            placeholder='Город'
                            optionsList={cities?.filter(city => cityRegExp.test(city.title) && city.title !== userInfo.city).map(city => city.title)}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, city: value }))}
                        />
                        {userInfo.city && < SuggestionInput
                            className={styles['edit-info__input']}
                            type='text'
                            placeholder='Отделение №1, адрес'
                            value={userInfo.postOffice}
                            onChange={(value) => setUserInfo(prev => ({ ...prev, postOffice: value }))}
                            optionsList={userInfo.postOffice ? postOfficeData?.departments.filter(department => department.includes(userInfo.postOffice)) : postOfficeData.departments}
                        />}
                    </div>
                </section>}
                {action === 'history' && <section className={styles['profile-page__orders-history']}>
                    <section className={styles['orders-history__header']}>
                        <h3 className={styles['orders-history__header-title']}>История заказов:</h3>
                        <Link className={styles['orders-history__clear-link']}>Очистить историю заказов</Link>
                    </section>
                    <div className={styles['orders-history__list']}>
                        {!userData?.orders.length && <p>Список заказов пуст!</p>}
                        {userData?.orders.map((order, index) => <OrderCard key={order} orderId={order} orderNumber={index + 1} />)}
                    </div>
                </section>}
            </section>
        </div >
    )
}
