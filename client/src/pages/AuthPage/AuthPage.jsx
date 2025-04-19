import React from 'react'

import styles from './AuthPage.module.css'
import Button from '../../components/Button/Button'
import BorderedButton from '../../components/BorderedButton/BorderedButton'
import Checkbox from '../../components/Checkbox/Checkbox'
import Input from '../../components/Input/Input'

import { useState, useEffect } from 'react'
import { login, register } from '../../api/api'


export default function AuthPage() {

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
                        <Input placeholder='Иванов Иван Иванович' type='text' value={data.fio} errorFrame={validationErrors.find(error => error.path === 'fio')} onChange={(value) => setData(prev => ({ ...prev, fio: value }))} />
                    </div>}
                    {mode === 'register' && <div className={styles['auth-box__input-box']}>
                        <h5>Телефон:</h5>
                        <Input placeholder='0123456789' type='phone' value={data.phone} errorFrame={validationErrors.find(error => error.path === 'phone')} onChange={(value) => setData(prev => ({ ...prev, phone: value }))} />
                    </div>}
                    <div className={styles['auth-box__input-box']}>
                        <h5>Электронная почта:</h5>
                        <Input placeholder='example@mail.com' type='email' value={data.email} errorFrame={validationErrors.find(error => error.path === 'email')} onChange={(value) => setData(prev => ({ ...prev, email: value }))} />
                    </div>
                    <div className={styles['auth-box__input-box']}>
                        <h5>Пароль:</h5>
                        <Input placeholder='Введите пароль' type='password' value={data.password} errorFrame={validationErrors.find(error => error.path === 'password')} onChange={(value) => setData(prev => ({ ...prev, password: value }))} />
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
                            }}
                        />}
                        {mode === 'login' && <BorderedButton
                            onClick={() => {
                                setMode('register')
                            }}
                            title='Зарегистрироваться'
                        />}
                        {mode === 'register' && <Button
                            title='Зарегистрироваться'
                            onClick={async () => {
                                if (data.passwordCheck !== data.password)
                                    return alert('пароли не совподают!')

                                const res = await register(data, () => setMode('login'))

                                if (res.validationErrors)
                                    return setValidationErrors(res.validationErrors)
                            }}
                        />}
                        {mode === 'register' && <BorderedButton onClick={() => setMode('login')} title='Войти' />}
                    </div>

                </div>
                <div className={styles['auth-page__advantages-box']}>
                    <svg className={styles['advantages-box__icon']} width="125" height="123" viewBox="0 0 125 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.7498 88.8739L22.8637 98.0848C21.8728 98.6251 20.9822 99.2892 20.1536 100.013C29.9987 108.314 42.7076 113.322 56.5933 113.322C70.3764 113.322 83.0041 108.389 92.8215 100.201C91.916 99.4366 90.9336 98.7489 89.8444 98.2065L71.7624 89.1665C69.426 87.9984 67.9503 85.6108 67.9503 82.9989V75.9045C68.4586 75.3257 69.0395 74.5826 69.6609 73.7048C72.1254 70.2238 73.9898 66.3947 75.2818 62.3776C77.6011 61.6622 79.3096 59.5202 79.3096 56.9746V49.4018C79.3096 47.736 78.5685 46.2475 77.4174 45.2053V34.2583C77.4174 34.2583 79.6662 17.2227 56.5954 17.2227C33.5246 17.2227 35.7734 34.2583 35.7734 34.2583V45.2053C34.6201 46.2475 33.8812 47.736 33.8812 49.4018V56.9746C33.8812 58.9692 34.9298 60.7247 36.4995 61.7391C38.3916 69.9761 43.3462 75.9045 43.3462 75.9045V82.8238C43.344 85.3438 41.9644 87.6652 39.7498 88.8739Z" fill="#F6F7FB" />
                        <path d="M57.5607 0.14417C26.3105 -0.389728 0.542453 24.5092 0.00855504 55.7614C-0.294699 73.4783 7.60272 89.4034 20.1771 99.996C20.9993 99.2784 21.8813 98.6207 22.8615 98.0868L39.7477 88.8759C41.9623 87.6672 43.3419 85.3458 43.3419 82.8215V75.9022C43.3419 75.9022 38.3852 69.9738 36.4952 61.7368C34.9276 60.7224 33.8769 58.9691 33.8769 56.9723V49.3995C33.8769 47.7337 34.618 46.2452 35.7691 45.2031V34.256C35.7691 34.256 33.5203 17.2204 56.5911 17.2204C79.6619 17.2204 77.4131 34.256 77.4131 34.256V45.2031C78.5664 46.2452 79.3053 47.7337 79.3053 49.3995V56.9723C79.3053 59.5179 77.5968 61.6599 75.2775 62.3754C73.9855 66.3924 72.1211 70.2215 69.6567 73.7026C69.0352 74.5803 68.4543 75.3235 67.946 75.9022V82.9967C67.946 85.6085 69.4217 87.9982 71.7581 89.1642L89.8401 98.2042C90.925 98.7467 91.9053 99.4322 92.8086 100.195C105.003 90.0249 112.881 74.8195 113.174 57.6963C113.712 26.4461 88.8129 0.678069 57.5607 0.14417Z" fill="#B9B9B9" />
                        <path d="M98.6271 122.254C112.781 122.254 124.254 110.781 124.254 96.6271C124.254 82.4737 112.781 71 98.6271 71C84.4737 71 73 82.4737 73 96.6271C73 110.781 84.4737 122.254 98.6271 122.254Z" fill="#399A3A" />
                        <path d="M111.848 85.3835C110.876 84.7086 109.548 84.9478 108.875 85.9174L96.924 103.088L88.4906 96.164C87.5808 95.4144 86.2333 95.5489 85.4858 96.4608C84.7362 97.3727 84.8686 98.7181 85.7826 99.4656L96.0036 107.856C96.388 108.17 96.8664 108.341 97.3576 108.341C97.4537 108.341 97.5519 108.335 97.6501 108.322C98.2396 108.239 98.7692 107.916 99.1109 107.427L112.381 88.3584C113.054 87.3888 112.815 86.0583 111.848 85.3835Z" fill="white" />
                    </svg>
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
