import React, { useEffect } from 'react'
import styles from './PaymentPage.module.css'
import Button from '../../components/Button/Button'
import { makeOrder } from '../../api/api'


export default function PaymentPage({ data, signature }) {

    useEffect(() => console.log({ data, signature }), [])

    return (
        < div >
            <form action="https://www.liqpay.ua/api/3/checkout" target='_blank' method='POST'>
                <input type="hidden" name="data" value={data} />
                <input type="hidden" name="signature" value={signature} />
                <button type='submit' onClick={() => {
                    makeOrder()
                }}>Оплатить</button>
            </form>
        </div >
    )
}
