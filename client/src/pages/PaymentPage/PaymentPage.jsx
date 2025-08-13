import { makeOrder } from '@api/api'

export default function PaymentPage({ data, signature }) {

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
