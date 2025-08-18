import { useEffect, useState } from 'react'

import { updateUserInfo } from '@api/api'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import BorderedButton from '@components/BorderedButton/BorderedButton'
import Button from '@components/Button/Button'
import Input from '@components/Input/Input'
import OrderCard from '@components/OrderCard/OrderCard'
import AvatarIcon from './AvatarIcon'

import styles from './ProfilePage.module.css'

import Spinner from '@components/Spinner/Spinner'

import { checkTokenThunk, setUserData } from '../../redux/features/userSlice'
import { addNotification } from '../../redux/features/uiSlice'

import SuggestionInput from '@components/SuggestionInput/SuggestionInput'

import { usePostInfo } from '@hooks/usePostInfo'
import { generateId } from '@utils/generateId'
import { uploadAvatar } from '../../api/api'

export default function ProfilePage() {

    document.querySelector('title').innerHTML = 'Личный кабинет'

    const negative = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector((state => state.user.userData))

    const [action, setAction] = useState('info')
    const [userInfo, setUserInfo] = useState({ phone: null, email: null, city: null, postOffice: null, avatarUrl: null })
    const [validationErrors, setValidationErrors] = useState([])
    const [postOfficeData, cities] = usePostInfo({ selectedCity: userInfo.city })

    const cityRegExp = new RegExp(`^${userInfo.city?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'i')

    const onSaveChangesButtonClick = async () => {
        setValidationErrors([])
        const { phone, email, city, fio, postOffice, avatarUrl } = userData || {}
        const oldUserInfo = { fio, phone, email, city, postOffice, avatarUrl }

        if (JSON.stringify(userInfo) === JSON.stringify(oldUserInfo)) {
            setAction('info')
            return dispatch(addNotification({ type: 'info', text: 'Данные не были изменены.' }))
        }

        updateUserInfo(userInfo)
            .then(res => {
                dispatch(setUserData())
                setAction('info')
                dispatch(addNotification({ type: 'success', text: res.message }))
            })
            .catch(error => {
                if (error.data.validationErrors) {
                    dispatch(addNotification({ type: 'error', text: error.message }))
                    return setValidationErrors(error.data.validationErrors)
                }
                else if (error.message === 'Пользователь не найден')
                    return dispatch(addNotification({ type: 'error', text: error.message }))
            })
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // сразу отправляем
        const formData = new FormData()
        formData.append("avatar", file)

        uploadAvatar(formData)
            .then(res => {
                setUserInfo((prev) => ({ ...prev, avatarUrl: res.url }))
                dispatch(addNotification({ type: 'success', text: res.message }))
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
    }

    const onLogOutButtonClick = () => {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        dispatch(checkTokenThunk())
    }

    useEffect(() => {
        const { fio, phone, email, city, postOffice, avatarUrl } = userData || {}
        setUserInfo({ fio, phone, email, city, postOffice, avatarUrl })
    }, [userData])

    useEffect(() => {
        if (userInfo.city !== userData?.city)
            return setUserInfo(prev => ({ ...prev, postOffice: null }))
        setUserInfo(prev => ({ ...prev, postOffice: userData?.postOffice }))
    }, [userInfo.city, userData])

    return (
        <div className={`${styles['profile-page']} container`}>
            <section className='page-title-section'>
                <h1 className='section-title'>Личный кабинет</h1>
                <Link className='header-link' to='/auth' onClick={onLogOutButtonClick}>Выйти из аккаунта</Link>
            </section>
            <section className={styles['profile-page__layout']}>
                <section className={styles['profile-page__actions']}>
                    <div className={styles['actions__avatar']}>
                        {userData?.avatarUrl ? <img
                            className={styles['avatar-image']}
                            src={userData?.avatarUrl} alt='avatar'
                            style={action === 'edit' ? { opacity: '0.1', filter: 'grayscale()' } : {}} /> : <AvatarIcon />}
                        <input type="file" id='select-image' accept="image/*" onChange={handleFileChange} />
                        {action === 'edit' && <a href='' onClick={(event) => {
                            event.preventDefault()
                            document.querySelector('#select-image').click()
                        }}>Сменить аватар</a>}
                        {/* {action === 'edit' && userData?.avatarUrl && <a href='' onClick={(event) => {
                            event.preventDefault()
                            // document.querySelector('#select-image').click()
                            updateUserInfo({ avatarUrl: 's' })
                                .then(() => dispatch(setUserData()))
                            dispatch(setUserData())
                        }}>Удалить</a>} */}
                    </div>
                    <div className={styles['actions__text']}>
                        <p className={styles['actions__user-name']}>{userData?.fio}</p>
                        <p className={styles['actions__discount-value']}>Ваша скидка составляет: 10%</p>
                    </div>
                    <div className={styles['actions__buttons']}>
                        {action === 'history' && <Button title='Вернуться в личный кабинет' onClick={() => setAction('info')} />}
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
                            <p>{`${userData?.city}, ${userData?.postOffice}`}</p>
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
