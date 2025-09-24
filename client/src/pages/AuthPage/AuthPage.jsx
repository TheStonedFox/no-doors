import { useState, useEffect, useRef, useCallback } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import styles from './AuthPage.module.css'
import Button from '@components/Button/Button'
import Checkbox from '@components/Checkbox/Checkbox'
import Input from '@components/Input/Input'
import BorderedButton from '@components/BorderedButton/BorderedButton'

import { login, register, resetPassword } from '@api/api'
import { addNotification } from '../../redux/features/uiSlice'

import { useDispatch } from 'react-redux'
import RegisterAdvantagesIcon from '../../svg/RegisterAdvantagesIcon'

import ReCAPTCHA from 'react-google-recaptcha'
import { checkTokenThunk, setUserData } from '../../redux/features/userSlice'

import Spinner from '../../components/Spinner/Spinner'
import { removeSendedCodes } from '../../api/api'
import Location from '../../components/Location/Location'
import Timer from '../../components/Timer/Timer'

export default function AuthPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const reCaptchaRef = useRef(null)

    const [mode, setMode] = useState('login')
    const [data, setData] = useState({
        email: '',
        password: '',
        passwordCheck: '',
        fio: '',
        phone: '',
        reCaptchaToken: null,
        emailConfirmCode: null
    })
    const [validationErrors, setValidationErrors] = useState([])
    const [isCaptchaNeed, setIsCaptchaNeed] = useState(false)
    const [isPolicyAccepted, setIsPolicyAccepted] = useState(false)

    useEffect(() => {
        if (reCaptchaRef.current)
            reCaptchaRef.current.reset()
    }, [mode, isCaptchaNeed])

    const [isLadingEnd, setIsLadingEnd] = useState(true)

    const onRegisterButtonClick = () => {

        if (data.passwordCheck !== data.password) {
            return dispatch(addNotification({ type: 'error', text: 'Пароли не совпадают.' }))
        }

        if (!isPolicyAccepted)
            return dispatch(addNotification({ type: 'info', text: 'Вы должны дать свое согласие на обработку персональных данных, прежде чем завершить регистрацию.' }))

        if (mode === 'email-confirm' && !data.emailConfirmCode) return dispatch(addNotification({ type: 'error', text: 'Введите код' }))

        register(data)
            .then(res => {
                if (res.code === 202) return setMode('email-confirm')
                dispatch(addNotification({ type: 'info', text: res.message }))
                setMode('login')
                setIsPolicyAccepted(false)
            })
            .catch(error => {
                setValidationErrors(error.data.validationErrors || null)
                dispatch(addNotification({ type: 'error', text: error.message }))
                reCaptchaRef.current.reset()
            })
            .finally(() => setIsLadingEnd(true))

        setIsLadingEnd(false)
        // registerFetch()
        setData(prev => ({ ...prev, emailConfirmCode: null }))
    }

    // const registerFetch = () => {

    // }

    const onLoginButtonClick = () => {
        setIsLadingEnd(false)
        login({ ...data, isCaptchaNeed })
            .then(res => {
                if (localStorage.getItem('rememberMe') === '1')
                    localStorage.setItem('token', res.token)
                else
                    sessionStorage.setItem('token', res.token)
                dispatch(setUserData())
                dispatch(checkTokenThunk())
                navigate('/profile')

                dispatch(addNotification({ type: 'info', text: res.message }))
            })
            .catch(error => {
                dispatch(addNotification({ type: 'error', text: error.message }))
                setIsCaptchaNeed(true)
                setIsLadingEnd(true)
            })
    }

    const onResetPasswordButtonClick = () => {
        setIsLadingEnd(false)
        resetPassword({ ...data })
            .then(res => {
                dispatch(addNotification({ type: 'info', text: res.message }))
                setMode('login')
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setIsLadingEnd(true))
    }

    const onGoBackButtonClick = () => {
        setIsLadingEnd(false)
        removeSendedCodes(data.email)
            .then(() => setMode(mode !== 'email-confirm' ? 'login' : 'register'))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setIsLadingEnd(true))
    }

    useEffect(() => {
        setData(prev => ({ ...prev, emailConfirmCode: null }))
        validationErrors && setValidationErrors([])
    }, [mode])

    const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'false' ? false : true)

    return (
        <div className={styles['auth-page']}>
            <Location path='auth' />
            <h2 className={`${'section-title'} ${styles['auth-page__title']}`}>Вход и регистрация</h2>
            <div className={styles['auth-page__layout']}>
                {isLadingEnd ? <div className={styles['auth-page__auth-box']}>
                    <h3>
                        {mode === 'login' && 'Вход'}
                        {mode === 'register' && 'Регистрация'}
                        {mode === 'reset' && 'Восстановление пароля'}
                    </h3>

                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>ФИО:</h5>
                        <Input placeholder='Иванов Иван Иванович' type='text' value={data.fio} errorFrame={validationErrors?.find(error => error.path === 'fio')} onChange={(value) => setData(prev => ({ ...prev, fio: value }))} />
                    </div>}

                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>Телефон:</h5>
                        <Input placeholder='0123456789' type='tel' value={data.phone} errorFrame={validationErrors?.find(error => error.path === 'phone')} onChange={(value) => setData(prev => ({ ...prev, phone: value }))} />
                    </div>}

                    {mode !== 'email-confirm' && <div className={styles['auth-box__input-box']}>
                        <h5>Электронная почта:</h5>
                        <Input placeholder='example@mail.com' type='email' value={data.email} errorFrame={validationErrors?.find(error => error.path === 'email')} onChange={(value) => setData(prev => ({ ...prev, email: value }))} />
                    </div>}

                    {mode !== 'reset' && mode !== 'email-confirm' && <div className={styles['auth-box__input-box']}>
                        <h5>Пароль:</h5>
                        <Input placeholder='Введите пароль' type='password' value={data.password} errorFrame={validationErrors?.find(error => error.path === 'password')} onChange={(value) => setData(prev => ({ ...prev, password: value }))} />
                    </div>}

                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>Пароль еще раз:</h5>
                        <Input placeholder='Введите пароль еще раз' value={data.passwordCheck} onChange={(value) => setData(prev => ({ ...prev, passwordCheck: value }))} />
                    </div>}

                    {mode === 'login' && <div className={styles['auth-page__remember-me-box']}>
                        <Checkbox title='Запомнить меня' onChange={(value) => {
                            setRememberMe(value)
                            localStorage.setItem('rememberMe', value)
                        }}
                            isChecked={rememberMe} />
                        <Link onClick={() => setMode('reset')}>Забыли пароль?</Link>
                    </div>}

                    {mode === 'register' && <div className={styles['auth-page__policy-box']}>
                        <Checkbox
                            isChecked={isPolicyAccepted}
                            title={<p>Я прочитал и даю своё согласие на <a href='#'>обработку
                                персональных данных</a></p>}
                            onChange={(value) => setIsPolicyAccepted(value)}
                        />
                    </div>}

                    {mode === 'email-confirm' && <div className={styles['auth-box__input-box']} style={{ alignItems: 'center' }}>
                        <h5>На почту {data.email} был отправлен код, введите его ниже.</h5>
                        <Input placeholder='000000' value={data.emailConfirmCode}
                            onChange={(value) => setData(prev => ({ ...prev, emailConfirmCode: value }))} />
                    </div>}

                    {isCaptchaNeed && mode === 'email-confirm' || mode !== 'register' ? <ReCAPTCHA
                        ref={reCaptchaRef}
                        style={{ margin: '0 auto' }}
                        sitekey={import.meta.env.VITE_RE_CAPTCHA_SITE_KEY}
                        onChange={(token) => setData(prev => ({ ...prev, reCaptchaToken: token }))}></ReCAPTCHA> : false}

                    <div className={styles['auth-page__buttons']}>
                        {mode === 'login' && <Button title='Войти' onClick={onLoginButtonClick} />}
                        {mode === 'login' && <BorderedButton onClick={() => setMode('register')} title='Зарегистрироваться' />}
                        {mode === 'register' && <Button title='Продолжить' onClick={onRegisterButtonClick} />}
                        {mode === 'email-confirm' && <Button title='Зарегистрироваться' onClick={onRegisterButtonClick} />}
                        {mode === 'reset' && <Button onClick={onResetPasswordButtonClick} title='Восстановить пароль' />}
                        {mode !== 'login' && <BorderedButton onClick={onGoBackButtonClick} title='Назад' />}
                    </div>

                </div> : <Spinner />}
                <div className={styles['auth-page__advantages-box']}>
                    <RegisterAdvantagesIcon className={styles['advantages-box__icon']} />
                    <h3 className={styles['advantages-box__title']}>У зарегистрированных пользователей ряд преимуществ:</h3>
                    <ul className={styles['advantages-box__list']}>
                        <li>1. Вам не нужно каждый раз вводить данные для оформления заказа</li>
                        <li>
                            <p>
                                2. У нас есть скидочная система для постоянных покупателей:</p>
                            <ul>
                                <li>— от 50 покупок: 5%</li>
                                <li>— от 150 покупок: 10%</li>
                                <li> — от 350 покупок и выше: 15%</li>
                            </ul>
                        </li>
                        <li>3. Вам на электронную почту будут приходить скидочные промокоды,
                            скидка которых суммируется с уже имеющейся</li>
                        <li>3. Вам на электронную почту будут приходить скидочные промокоды,
                            скидка которых суммируется с уже имеющейся</li>
                    </ul>
                </div>

            </div>
        </div >
    )
}
