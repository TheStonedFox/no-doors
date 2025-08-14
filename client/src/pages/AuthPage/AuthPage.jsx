import React from 'react'

import styles from './AuthPage.module.css'
import Button from '@components/Button/Button'
import BorderedButton from '@components/BorderedButton/BorderedButton'
import Checkbox from '@components/Checkbox/Checkbox'
import Input from '@components/Input/Input'


import { useState, useEffect } from 'react'
import { login, register } from '@api/api'
import { addNotification } from '../../redux/features/uiSlice'

import { useDispatch } from 'react-redux'
import RegisterAdvantagesIcon from '@/svgIcons/RegisterAdvantagesIcon'

import { generateId } from '@utils/generateId'


export default function AuthPage() {

    const dispatch = useDispatch()

    const [mode, setMode] = useState('login')
    const [data, setData] = useState({})
    const [validationErrors, setValidationErrors] = useState([])

    useEffect(() => setData({ email: '', password: '', passwordCheck: '', fio: '', phone: '' }), [mode])
    return (
        <div className={styles['auth-page']}>
            <h2 className={`${'section-title'} ${styles['auth-page__title']}`}>Вход и регистрация</h2>
            <div className={styles['auth-page__layout']}>
                <div className={styles['auth-page__auth-box']}>
                    <h3>Вход</h3>

                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>ФИО:</h5>
                        <Input placeholder='Иванов Иван Иванович' type='text' value={data.fio} errorFrame={validationErrors?.find(error => error.path === 'fio')} onChange={(value) => setData(prev => ({ ...prev, fio: value }))} />
                    </div>}
                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>Телефон:</h5>
                        <Input placeholder='0123456789' type='tel' value={data.phone} errorFrame={validationErrors?.find(error => error.path === 'phone')} onChange={(value) => setData(prev => ({ ...prev, phone: value }))} />
                    </div>}
                    <div className={styles['auth-box__input-box']}>
                        <h5>Электронная почта:</h5>
                        <Input placeholder='example@mail.com' type='email' value={data.email} errorFrame={validationErrors?.find(error => error.path === 'email')} onChange={(value) => setData(prev => ({ ...prev, email: value }))} />
                    </div>
                    <div className={styles['auth-box__input-box']}>
                        <h5>Пароль:</h5>
                        <Input placeholder='Введите пароль' type='password' value={data.password} errorFrame={validationErrors?.find(error => error.path === 'password')} onChange={(value) => setData(prev => ({ ...prev, password: value }))} />
                    </div>

                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>Пароль еще раз:</h5>
                        <Input placeholder='Введите пароль еще раз' value={data.passwordCheck} onChange={(value) => setData(prev => ({ ...prev, passwordCheck: value }))} />
                    </div>}

                    {mode === 'login' && <div className={styles['auth-page__remember-me-box']}>
                        <Checkbox title='Запомнить меня' />
                        <a href="#">Забыли пароль?</a>
                    </div>}
                    {mode === 'register' && <div className={styles['auth-page__policy-box']}>
                        <Checkbox
                            title={<p>Я прочитал и даю своё согласие на <a href='#'>обработку
                                персональных данных</a></p>}
                        />
                    </div>}
                    <div className={styles['auth-page__buttons']}>
                        {mode === 'login' && <Button
                            title='Войти'
                            onClick={() => {
                                login(data.email, data.password)
                                    .then(res => {
                                        localStorage.setItem('token', res.token)
                                        window.location.href = '/profile'
                                    })
                                    .catch(error => dispatch(addNotification({ id: generateId(), type: 'error', text: error.message })))
                            }}
                        />}
                        {mode === 'login' && <BorderedButton
                            onClick={() => setMode('register')}
                            title='Зарегистрироваться'
                        />}
                        {mode === 'register' && <Button
                            title='Зарегистрироваться'
                            onClick={async () => {

                                if (data.passwordCheck !== data.password) {
                                    return dispatch(addNotification({ id: generateId(), type: 'error', text: 'Пароли не совпадают.' }))
                                }

                                register(data)
                                    .then(res => {
                                        if (res.code === 200)
                                            setMode('login')
                                    })
                                    .catch(error => {
                                        setValidationErrors(error.data.validationErrors || null)
                                        dispatch(addNotification({ id: generateId(), type: 'error', text: error.message }))
                                    })
                            }}
                        />}
                        {mode === 'register' && <BorderedButton onClick={() => setMode('login')} title='Войти' />}
                    </div>

                </div>
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
        </div>
    )
}
