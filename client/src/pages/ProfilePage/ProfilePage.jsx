import styles from './ProfilePage.module.css'
import { useEffect, useState } from 'react'

import { updateUserInfo } from '@api/api'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import BorderedButton from '@components/BorderedButton/BorderedButton'
import Button from '@components/Button/Button'
import AvatarIcon from '../../svg/AvatarIcon'

import Spinner from '@components/Spinner/Spinner'

import { checkTokenThunk, setUserData } from '../../redux/features/userSlice'
import { addNotification, togglePopup } from '../../redux/features/uiSlice'
import { uploadAvatar } from '../../api/api'

import ProfileInfoContent from './ProfileInfoContent/ProfileInfoContent'
import ProfileEditInfoContent from './ProfileEditInfoContent/ProfileEditInfoContent'
import ProfileHistoryContent from './ProfileHistoryContent/ProfileHistoryContent'
import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'


export default function ProfilePage() {
    document.querySelector('title').innerHTML = 'Личный кабинет'

    const [params, setParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector((state => state.user.userData))

    const [onAvatarUploading, setOnAvatarUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [action, setAction] = useState('info')
    const [userInfo, setUserInfo] = useState({ phone: null, email: null, city: null, postOffice: null, avatarUrl: null })
    const [validationErrors, setValidationErrors] = useState([])

    useEffect(() => {
        const newParams = new URLSearchParams(params)
        newParams.set('mode', action)
        setParams(newParams)
        setValidationErrors([])
    }, [action, params, setParams])

    useEffect(() => {
        setAction(params.get('mode') || 'info')
    }, [params])

    const onSaveChangesButtonClick = async () => {
        setValidationErrors([])
        const { phone, email, city, fio, postOffice, avatarUrl } = userData || {}
        const oldUserInfo = { fio, phone, email, city, postOffice, avatarUrl }
        if (JSON.stringify(userInfo) === JSON.stringify(oldUserInfo)) {
            setAction('info')
            return dispatch(addNotification({ type: 'info', text: 'Данные не были изменены.' }))
        }

        if (userInfo.city && !userInfo.postOffice)
            return setValidationErrors(['postOffice'])

        if (!userInfo.city)
            return setValidationErrors(['city'])

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

        const formData = new FormData()
        formData.append("avatar", file)
        setOnAvatarUploading(true)
        uploadAvatar(formData)
            .then(res => {
                setUserInfo((prev) => ({ ...prev, avatarUrl: res.url }))
                dispatch(addNotification({ type: 'success', text: res.message }))
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setOnAvatarUploading(false))
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

    const onChangeInfo = (data) => {
        setUserInfo(prev => ({ ...prev, ...data.userInfo }))
        setIsLoading(data.isPostDataLoading.isCitiesLoading)

    }

    return (
        <div className={`${styles['profile-page']} container`}>
            <section className='page-title-section'>
                <h1 className='section-title'>Личный кабинет</h1>
                <Link className='header-link header-link_clear' to='/auth' onClick={onLogOutButtonClick}>Выйти из аккаунта</Link>
            </section>
            <section className={styles['profile-page__layout']}>
                {!isLoading ? <section className={styles['profile-page__actions']}>
                    {!onAvatarUploading ? <div className={styles['actions__avatar']}>
                        {userData?.avatarUrl ? <img
                            className={styles['avatar-image']}
                            src={userData?.avatarUrl} alt='avatar'
                            style={action === 'edit' ? { opacity: '0.1', filter: 'grayscale()' } : {}} /> : <AvatarIcon />}
                        <input type="file" id='select-image' accept="image/*" onChange={handleFileChange} />
                        {action === 'edit' && <a href='' onClick={(event) => {
                            event.preventDefault()
                            document.querySelector('#select-image').click()
                        }}>Сменить аватар</a>}
                    </div> : <Spinner />}
                    <div className={styles['actions__text']}>
                        <p className={styles['actions__user-name']}>{userData?.fio}</p>
                        {action === 'info' && <p className={styles['actions__discount-value']}>Ваша скидка составляет: 10%</p>}
                    </div>
                    <div className={styles['actions__buttons']}>
                        {action === 'history' && <Button title='Вернуться в личный кабинет' onClick={() => setAction('info')} />}
                        {action !== 'edit' && <BorderedButton className={styles['actions__action-button']} title='Редактировать профиль' onClick={() => setAction('edit')} />}
                        {action !== 'history' && action !== 'edit' && <BorderedButton className={styles['actions__action-button']} title='Просмотренные товары' onClick={() => {
                            setAction('products')
                            navigate('/profile/viewed-products')
                        }} />}
                        {action !== 'edit' && action !== 'history' && < BorderedButton className={styles['actions__action-button']} title='История заказов' onClick={() => setAction('history')} />}
                        {action === 'edit' && < div className={styles['action__edit-mode-buttons']}>
                            <Button title='Сохранить изменения' disabled={onAvatarUploading} onClick={onSaveChangesButtonClick} />
                            <BorderedButton disabled={onAvatarUploading} className={styles['actions__action-button']}
                                title='Отменить редактирование'
                                style={{}}
                                onClick={() => setAction('info')} />
                        </div>}
                    </div>
                </section> : <SkeletonLadingShimmer style={{ width: '100%', height: '460px' }} />}

                {action === 'info' && <ProfileInfoContent />}
                {action === 'edit' && <ProfileEditInfoContent
                    onChangeInfo={onChangeInfo}
                    validationErrors={validationErrors} />}
                {action === 'history' && <ProfileHistoryContent />}
            </section>
        </div >
    )
}
