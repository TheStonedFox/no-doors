import nodemailer from 'nodemailer'

import { resetPasswordEmailTemplate } from '../resetPasswordEmailTemplate.js'

export async function sendEmail(to, subject, token) {
    // 1. Создаём транспорт
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",   // например Gmail
        port: 587,
        secure: false,
        tls: { ciphers: 'SSLv3' },
        auth: {
            user: process.env.EMAIL_USER,      // твоя почта
            pass: process.env.EMAIL_PASSWORD,  // пароль или app password
        },
    })

    // 2. Письмо
    await transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: resetPasswordEmailTemplate(`http://localhost:3000/auth/reset-password?token=${token}`),
    })
}