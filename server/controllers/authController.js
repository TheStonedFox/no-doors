import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { validationResult } from "express-validator"

import UserModel from "../models/UserModel.js"

import { checkCaptcha } from '../utils/checkCaptcha.js'
import { sendEmail } from "../utils/sendEmail.js"

import UtilityListsModel from "../models/UtilityListsModel.js"

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации. Проверьте указанные поля.', code: 400, validationErrors: errors.errors })

        const captchaStatus = await checkCaptcha(req.body.reCaptchaToken)

        const isUser = await UserModel.findOne({ email: req.body.email })

        if (isUser)
            return res.status(400).json({ message: 'Email уже используется.', code: 400, })

        if (!captchaStatus)
            return res.status(401).json({ message: 'Капча не пройдена.', code: 400, })

        const slat = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, slat)

        const doc = await new UserModel({ fio: req.body.fio, phone: req.body.phone, email: req.body.email, password: passwordHash })
        const user = await doc.save()
        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ message: 'Регистрация завершена.', code: 200 })
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

        if (req.body.isCaptchaNeed) {
            const captchaStatus = await checkCaptcha(req.body.reCaptchaToken)

            if (!captchaStatus)
                return res.status(401).json({ message: 'Капча не пройдена.', code: 400, })
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ token, message: `Добро пожаловать, ${user.fio.split(' ')[0]}`, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (errors.errors.find(error => error.path === 'email'))
            return res.status(400).json({ message: 'Введите корректный email.', code: 400, validationErrors: errors.errors })

        const user = await UserModel.findOne({ email: req.body.email })

        if (!user)
            return res.status(404).json({ message: 'Пользователя с таким email не найдено.', code: 404 })

        const token = crypto.randomBytes(32).toString("hex")
        const expires = Date.now() + 5 * 60 * 1000

        const utilityLists = await UtilityListsModel.findOne()

        await utilityLists.updateOne({ $push: { resetPasswordTokens: { user: user._id, token, expires } } })

        await sendEmail(req.body.email, 'Восстановление пароля', token)

        res.status(200).json({ message: 'Ссылка для восстановления пароля выслана на почту.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const checkLink = async (req, res) => {
    try {

        const utilityLists = await UtilityListsModel.findOne()

        const tokensList = await utilityLists.resetPasswordTokens

        const tokenItem = tokensList.find(token => token.token === req.query.token)

        if (!tokenItem) return res.status(404).json({ message: `Ссылка не действительна или уже была использована.`, code: 404, })

        if (tokenItem.expires < Date.now()) {
            await UtilityListsModel.updateOne({}, { $pull: { resetPasswordTokens: tokenItem } })
            return res.status(400).json({ message: 'Время действия ссылки истекло.', code: 400 })
        }

        res.status(200).json({ message: 'Ссылка действительна.', token: tokenItem.token, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (errors.errors.find(error => error.path === 'password'))
            return res.status(400).json({ message: 'Пароль не соответствует требованиям.', code: 400, validationErrors: errors.errors })

        const utilityLists = await UtilityListsModel.findOne()

        const tokensList = await utilityLists.resetPasswordTokens

        const tokenItem = tokensList.find(token => token.token === req.body.token)

        const salt = await bcrypt.genSalt(5)
        const passwordHash = await bcrypt.hash(req.body.password, salt)

        const user = await UserModel.findOneAndUpdate(
            { _id: tokenItem.user }, // Условие поиска
            { $set: { password: passwordHash } }, // Что обновляем
        )

        if (!user) return res.status(400).json({ message: 'Не удалось обновить данные.', code: 400 })

        await UtilityListsModel.updateOne({}, { $pull: { resetPasswordTokens: tokenItem } })

        res.status(200).json({ message: 'Пароль успешно изменен.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}
