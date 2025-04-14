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

app.post('/orders', CheckAuth, async (req, res) => {

    try {
        // const errors = validationResult(req)

        // if (!errors.isEmpty())
        //     return res.json({ errors: errors.errors })

        const order = new OrderModel({
            userId: req.id,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod,
            adress: req.body.adress,
            products: req.body.products,
            userData: { fio: req.body.fio, phone: req.body.phone, email: req.body.email },
            sum: req.body.sum,
        })

        // res.json({ msg: 'item added!' })

        const doc = await order.save()

        const user = await UserModel.findOneAndUpdate(
            { _id: req.id }, // Условие поиска
            { $push: { orders: doc._id } }, // Что обновляем
        )

        if (!user)
            return res.json({ msg: 'user not found!' })

        res.json({ status: 'ok', order: doc })
    } catch (error) {
        res.json(error)
    }
})

app.get('/orders/:id', async (req, res) => {
    const order = await OrderModel.findById(req.params.id)

    if (!order)
        res.json({ mag: 'заказ не найден!' })

    res.json(order)
})


app.patch('/orders/:id', async (req, res) => {
    try {
        console.log('asdsadsassadass')

        await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        // if (!order)
        //     return res.json({ message: 'Заказ не найден!' }).status(404)

        res.json({ message: 'Статус обновлен!' }).status(200)

    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления статуса', details: error.message });
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

app.post('/payment-status/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const data = {
            public_key: process.env.LIQ_PAY_PUBLIC_API_KEY,
            action: 'status',
            version: '3',
            order_id: orderId
        };

        const jsonData = JSON.stringify(data);
        const dataEncoded = Buffer.from(jsonData).toString('base64');
        const signature = crypto
            .createHash('sha1')
            .update(process.env.LIQ_PAY_PRIVATE_API_KEY + dataEncoded + process.env.LIQ_PAY_PRIVATE_API_KEY)
            .digest('base64');
        console.log(dataEncoded)
        const response = await fetch('https://www.liqpay.ua/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                data: dataEncoded,
                signature: signature
            })
        });

        const result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения статуса', details: error.message });
    }
})



app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`The server is running on port ${process.env.PORT || 5000}`);
})


