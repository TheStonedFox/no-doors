import express from 'express'
import mongoose from 'mongoose'
import LiqPay from 'liqpay'
import crypto from 'crypto'

import UserModel from './models/UserModel.js'
import OrderModel from './models/OrderModel.js'

import dotenv from 'dotenv'

import cors from 'cors'
import { CheckAuth } from './middleware/CheckAuth.js'
import * as userController from './controllers/userController.js'
import * as productController from './controllers/productController.js'
import * as favoriteController from './controllers/favoriteController.js'
import * as cartController from './controllers/cartController.js'

import { validationResult } from 'express-validator'

import * as validations from './validations.js'


dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qamea.mongodb.net/no-doors?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB err'))


const app = express()

const liqpay = new LiqPay('sandbox_i4566136611', 'sandbox_xHLpL84eHlF04Z0B9mF5FvIJgF87c1TVM4B7sRkk')

app.use(cors())
app.use(express.json())

app.post('/auth/register', userController.register)

app.post('/auth/login', userController.login)

app.post('/profile', CheckAuth, userController.profile)

app.get('/products', productController.getProducts)

app.get('/products/:id', productController.getProduct)

app.post('/products/add', productController.addProduct)

app.post('/auth/check', CheckAuth, (req, res) => res.json({ msg: 'token valid' }))

app.post('/favorites/:productId', CheckAuth, favoriteController.add)
app.delete('/favorites/:productId', CheckAuth, favoriteController.remove)

app.post('/cart/:productId', cartController.add)
app.delete('/cart/:productId', cartController.remove)
app.patch('/cart/:id', cartController.update)

app.post('/order', async (req, res) => {

    try {
        // const errors = validationResult(req)

        // if (!errors.isEmpty())
        //     return res.json({ errors: errors.errors })

        const order = new OrderModel({
            userId: req.body.userId,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod,
            adress: req.body.adress,
            products: req.body.products,
            userData: { fio: req.body.fio, phone: req.body.phone, email: req.body.email },
            sum: req.body.sum,
        })

        const doc = await order.save()
        res.json({ status: 'ok', order: doc })
    } catch (error) {
        res.json(error)
    }
})


app.post('/create-payment', async (req, res) => {

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
            server_url: 'https://f1a2-90-123-45-67.ngrok.io/payment-status'
        }

        const jsonData = JSON.stringify(orderData)
        const data = Buffer.from(jsonData).toString('base64')// ← правильно кодуємо

        const signatureString = process.env.LIQ_PAY_PRIVATE_API_KEY + data + process.env.LIQ_PAY_PRIVATE_API_KEY
        const signature = crypto.createHash('sha1').update(signatureString).digest('base64')

        res.json({ data, signature })

    } catch (error) {
        console.log(error)
        res.json(error)
    }

})

app.post('/payment-status', express.urlencoded({ extended: false }), (req, res) => {
    try {
        const data = req.body.data;
        const signature = req.body.signature;

        // Проверка подписи
        const expectedSignature = crypto
            .createHash('sha1')
            .update(process.env.LIQ_PAY_PRIVATE_API_KEY + data + process.env.LIQ_PAY_PRIVATE_API_KEY)
            .digest('base64');

        if (signature !== expectedSignature) {
            console.log('⚠️ Подпись не совпадает!');
            return res.status(403).send('Invalid signature');
        }

        // Расшифровываем данные
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
        console.log('✅ Получен callback от LiqPay:', decodedData);

        // Тут можно:
        // - обновить заказ в БД
        // - отправить email
        // - подтвердить доставку и т.д.

        res.status(200).send('OK');
    } catch (error) {
        console.error('Ошибка в callback:', error);
        res.status(500).send('Server error');
    }
})

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`The server is running on port ${process.env.PORT || 5000}`);
})


