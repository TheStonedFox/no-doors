import styles from './ResetPasswordPage.module.css'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { checkResetPasswordLink, updatePassword } from '../../api/api'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { addNotification } from '../../redux/features/uiSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'

import ArrowIcon from '@/svg/ArrowIcon'

import { FaCheck } from "react-icons/fa"
import { MdOutlineErrorOutline } from "react-icons/md"
import Spinner from '../../components/Spinner/Spinner'


export default function ResetPasswordPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [params, setParams] = useSearchParams()
    const token = params.get('token')
    const [passwords, setPasswords] = useState({ password: null, passwordCheck: null })

    const [isLadingEnd, setIsLadingEnd] = useState(true)

    const [errorMessage, setErrorMessage] = useState(null)

    const [messageVisible, setMessageVisible] = useState(false)

    useEffect(() => {
        document.querySelector('title').innerHTML = 'Восстановление пароля'
        checkResetPasswordLink(token).catch(error => {
            setErrorMessage(error.message)
            setMessageVisible(true)
        })
    }, [])

    const changePassword = (token) => {
        setIsLadingEnd(false)
        updatePassword({ token, password: passwords.password })
            .then(res => {
                dispatch(addNotification({ type: 'success', text: res.message }))
                setMessageVisible(true)
            })
            .catch(error => {
                dispatch(addNotification({ type: 'error', text: error.message }))

                if (error.code === 404)
                    navigate('/')
            }).finally(() => setIsLadingEnd(true))
    }

    const onChangePasswordButtonClick = () => {
        if (passwords.password !== passwords.passwordCheck)
            return dispatch(addNotification({ type: 'error', text: 'Пароли не совпадают.' }))
        setIsLadingEnd(false)
        checkResetPasswordLink(token)
            .then(res => changePassword(res.token))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally((setIsLadingEnd(true)))
    }

    const onRedirectButtonMouseEnter = (e) => {
        e.currentTarget.querySelector('svg').style = 'color: var(--ui---main); display: block;'
        e.target.parentElement.style = 'color: var(--ui---main)'
    }

    const onRedirectButtonMouseLeave = (e) => {
        e.currentTarget.querySelector('svg').style = ''
        e.target.parentElement.style = ''
    }


    return (
        <div className={`${styles['reset-password-page']} container`}>
            <h2 className={`${'section-title'} ${styles['reset-password-page__title']}`}>Восстановление пароля</h2>
            <section className={styles['reset-password-page__main-box']}>
                {!messageVisible ? <h2 className={styles['main-box__title']}>Придумайте новый пароль</h2> : null}
                {!messageVisible && isLadingEnd ? <section className={styles['main-box__inputs']}>
                    <Input placeholder='Новый пароль' onChange={(value) => setPasswords(prev => ({ ...prev, password: value, }))} />
                    <Input placeholder='Повторите пароль' onChange={(value) => setPasswords(prev => ({ ...prev, passwordCheck: value, }))} />
                </section> : null}

                {!isLadingEnd ? <Spinner /> : null}

                {!messageVisible ? <Button title='Изменить пароль' onClick={onChangePasswordButtonClick} /> : null}
                {messageVisible ? <section className={styles['main-box__message-text']}>
                    {errorMessage ? <MdOutlineErrorOutline color='red' /> : <FaCheck />}
                    <h3>{errorMessage ? errorMessage : 'Пароль был успешно изменен.'}</h3>
                    <button className={styles['message-text__redirect-button']}
                        onMouseEnter={onRedirectButtonMouseEnter}
                        onMouseLeave={onRedirectButtonMouseLeave}
                        onClick={() => errorMessage ? navigate('/') : navigate('/auth')}>
                        <Link to={errorMessage ? '/' : '/auth'}>{errorMessage ? 'На главную' : 'Войти'}</Link>
                        <ArrowIcon />
                    </button>
                </section> : null}
            </section>
        </div>
    )
}
