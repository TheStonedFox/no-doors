import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator"


export const register = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации. Проверьте указанные поля.', code: 400, validationErrors: errors.errors })

        const isUser = await UserModel.findOne({ email: req.body.email })

        if (isUser)
            return res.status(400).json({ message: 'Email уже используется.', code: 400, })

        const slat = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, slat)

        const doc = await new UserModel({ fio: req.body.fio, phone: req.body.phone, email: req.body.email, password: passwordHash })
        const user = await doc.save()
        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ message: 'Регистрация выполнена.', code: 200, })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user)
            return res.status(400).json({ message: 'Не верные данные для входа.', code: 400 })

        const isValidPassword = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPassword)
            return res.status(400).json({ message: 'Не верные данные для входа.', code: 400 })

        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

