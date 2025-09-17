import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import { validationResult } from "express-validator"
import { v2 as cloudinary } from 'cloudinary'

export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.id })

        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден!' })

        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.params.userId })

        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден!' })

        const { fio, avatar } = user

        res.status(200).json({ fio, avatar })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const orders = async (req, res) => {

    try {
        const orders = await OrderModel.find({ userId: req.id }).sort({ createdAt: -1 })

        if (orders.length === 0)
            return res.status(200).json({ message: 'Заказов нет.' })


        return res.status(200).json({ orders })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.id })

        const oldAvatarId = req.body.oldAvatar

        if (oldAvatarId) {
            await cloudinary.uploader.destroy(oldAvatarId)
            console.log("Old avatar deleted:", oldAvatarId)
        }

        if (req.body.productId) {
            if (!user.viewedProducts.some(product => product.productId === req.body.productId)) {
                await user.updateOne({ $push: { viewedProducts: { productId: req.body.productId } } })
                return res.status(200).json({ message: 'Данные обновлены', user })
            }

            await user.updateOne({ $pull: { viewedProducts: { productId: req.body.productId } } })
            await user.updateOne({ $push: { viewedProducts: { productId: req.body.productId } } })

            return res.status(200).json({ message: 'Данные обновлены', user })
        }

        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации, проверьте указанные поля.', validationErrors: errors.errors })


        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден' })

        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email
        user.city = req.body.city || user.city
        user.postOffice = req.body.postOffice || user.postOffice
        user.avatar = req.body.avatar || user.avatar

        await user.save()

        return res.status(200).json({ message: 'Данные обновлены', user })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const uploadAvatar = async (req, res) => {
    try {
        const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`


        const result = await cloudinary.uploader.upload(file, {
            folder: "avatars", // Папка в Cloudinary
        })

        res.json({ url: result.secure_url, publicId: result.public_id, message: 'Загрузка завершена.' })
    } catch (err) {
        res.status(500).json({ message: "Ошибка загрузки.", err })
    }
}