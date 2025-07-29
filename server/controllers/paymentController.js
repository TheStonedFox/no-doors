import crypto from 'crypto'
import dotenv from 'dotenv'
import LiqPay from 'liqpay'

dotenv.config()
// const liqpay = new LiqPay('sandbox_i4566136611', 'sandbox_xHLpL84eHlF04Z0B9mF5FvIJgF87c1TVM4B7sRkk')


export const create = async (req, res) => {

    try {
        const orderData = {
            action: 'pay',
            amount: req.body.amount,
            currency: 'UAH',
            description: 'Описание товара или услуги',
            order_id: req.body.orderId,
            version: '3',
            sandbox: '1',
            public_key: process.env.LIQ_PAY_PUBLIC_API_KEY,
            // server_url: 'http://192.168.1.105:3001/payment-status'
        }

        const jsonData = JSON.stringify(orderData)
        const data = Buffer.from(jsonData).toString('base64')// ← правильно кодуємо

        const signatureString = process.env.LIQ_PAY_PRIVATE_API_KEY + data + process.env.LIQ_PAY_PRIVATE_API_KEY
        const signature = crypto.createHash('sha1').update(signatureString).digest('base64')

        res.status(200).json({ data, signature })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const status = async (req, res) => {
    try {
        const orderId = req.params.orderId

        const data = {
            public_key: process.env.LIQ_PAY_PUBLIC_API_KEY,
            action: 'status',
            version: '3',
            order_id: orderId
        }

        const jsonData = JSON.stringify(data)
        const dataEncoded = Buffer.from(jsonData).toString('base64')
        const signature = crypto
            .createHash('sha1')
            .update(process.env.LIQ_PAY_PRIVATE_API_KEY + dataEncoded + process.env.LIQ_PAY_PRIVATE_API_KEY)
            .digest('base64')

        const response = await fetch('https://www.liqpay.ua/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                data: dataEncoded,
                signature: signature
            })
        })

        const result = await response.json()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}