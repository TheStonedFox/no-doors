import express from 'express'
import mongoose from 'mongoose'
import UserModel from './models/UserModel.js'
import OrderModel from './models/OrderModel.js'

import dotenv from 'dotenv'

import cors from 'cors'
import { CheckAuth } from './middleware/CheckAuth.js'
import * as userController from './controllers/userController.js'
import * as productController from './controllers/productController.js'
import * as favoriteController from './controllers/favoriteController.js'
import * as cartController from './controllers/cartController.js'

import * as validations from './validations.js'


import { validationResult } from 'express-validator'
dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qamea.mongodb.net/no-doors?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB err'))


const app = express()

app.use(cors())
app.use(express.json())

app.post('/auth/register', userController.register)

app.post('/auth/login', userController.login)

app.post('/profile', CheckAuth, userController.profile)

app.get('/products', productController.getProducts)

app.get('/products/:id', productController.getProduct)

app.post('/products/add', productController.addProduct)

app.post('/auth/check', CheckAuth, (req, res) => res.json({ msg: 'token valid' }))

app.post('/cart/sync', CheckAuth, async (req, res) => {

    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.id }, // Условие поиска
        { cartItems: req.body.cartItems, favoriteItems: req.body.favoriteItems }, // Что обновляем
        { new: true } // Возвращать обновлённый объект
    )

    if (!updatedUser)
        return res.json({ msg: 'user not found' })

    return res.json({ id: req.id })
})

app.post('/favorites/:productId', CheckAuth, favoriteController.add)
app.delete('/favorites/:productId', CheckAuth, favoriteController.remove)

app.post('/cart/:productId', cartController.add)
app.delete('/cart/:productId', cartController.remove)
app.patch('/cart/:id', cartController.update)

app.post('/oeder', async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty())
        return res.json({ errors })


    const order = new OrderModel({
        // userId: req.body.userId,
        deliveryType: req.body.deliveryType,
        products: req.body.products,
        userData: { fio: req.body.fio, phone: req.body.phone, email: req.body.email }

    })

    const doc = await order.save()
    res.json({ doc })
})

app.use((err, req, res, next) => {
    console.error(err.stack); // Логируем ошибку
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
//     console.log(`The server is running on port ${process.env.PORT || 5000}`);
// })


app.listen(3001, '0.0.0.0', () => {
    console.log(`The server is running on port 3001`);
})


