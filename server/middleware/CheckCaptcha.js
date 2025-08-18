export const CheckCaptcha = async (req, res, next) => {
    const token = (req.body.token || '')
    try {
        const secret = process.env.RECAPTCHA_SECRET_KEY

        const params = new URLSearchParams()
        params.append("secret", secret)
        params.append("response", token)

        const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        })

        const data = await res.json()
        if (data.success)
            next()
    } catch (error) {
        res.status(404).json({ message: error.message, code: 404, token })
    }
}