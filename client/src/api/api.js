const ip = '192.168.1.105'


export const register = async (data, next) => {

    try {
        const res = await fetch(`http://${ip}:3001/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer your-token-here'
            },
            body: JSON.stringify({ fio: data.fio, phone: data.phone, email: data.email, password: data.password })

        })

        const json = await res.json()
        if (json.msg === 'email already used')
            return alert(`Пользователь с таким email уже существует!`)


        if (res.ok)
            next()
        return json

    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const login = async (email, password) => {
    try {
        const res = await fetch(`http://${ip}:3001/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer your-token-here'
            },
            body: JSON.stringify({ email: email, password: password })
        })

        const json = await res.json()

        if (json.msg === 'Не верные данные')
            return alert('Логин или пароль введен не верно!')

        localStorage.setItem('token', json.token)
        window.location.href = '/profile'
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }
}

export const updateFavoritesAndCartItems = (localCartList, localFavoriteList) => {
    fetch(`http://${ip}:3001/cart/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ cartItems: localCartList, favoriteItems: localFavoriteList })
    })
        .catch(error => alert(`Не удалось обновить список избранных товаров! ${error}`))
}

export const getUser = async () => {
    try {
        const res = await fetch(`http://${ip}:3001/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })

        if (!res.ok) {
            alert(`Ошибка : ${res.statusText}`)
        }
        const json = await res.json()
        return json.user
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const getProducts = async (next) => {
    const res = await fetch(`http://${ip}:3001/products`)

    const products = await res.json()

    if (!res.ok)
        return alert('Не удалось получить список товаров')

    next()
    return products
}


export const addFavoriteItem = async (userId, productId, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/favorites/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ id: userId })
        })

        if (!res.ok) {
            alert(`Ошибка ${res.status}: Не удалось добавить товар в избранное.`)
            return
        }
        next()
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const removeFavoriteItem = async (userId, productId, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/favorites/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ id: userId })
        })

        if (!res.ok)
            return alert('Не удалось удалить товар из избранного')

        next()
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const addCartItem = async (userId, productId, quantity, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/cart-items/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ userId: userId, quantity: quantity || 1 })
        })
        if (!res.ok)
            return alert('Не удалось добавить товар в корзину')

        next()
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const removeCartItem = async (userId, productId, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/cart-items/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ userId })
        })
        if (!res.ok)
            return alert('Не удалось удалить товар из корзины')

        next()
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }


}

export const updateCartItem = async (userId, productId, quantity, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/cart-items/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ id: userId, quantity: quantity })
        })
        if (!res.ok)
            return alert('Не удалось удалить обновить товар в корзине')

        next()
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const makeOrder = async (fio, phone, email, userId, deliveryMethod, paymentMethod, adress, products, sum) => {
    try {
        const res = await fetch(`http://${ip}:3001/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                userId,
                fio,
                phone,
                email,
                deliveryMethod,
                paymentMethod,
                adress,
                products,
                sum,
            })
        })

        const data = await res.json()

        return data
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }

}

export const createPayment = async (amount, orderId, next) => {
    try {
        const res = await fetch(`http://${ip}:3001/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ amount, orderId })
        })

        if (!res.ok)
            return alert('Не удалось совершить оплату')

        const json = await res.json()
        return json
    } catch (error) {
        alert(`Произошла ошибка: ${error}`)
    }
}


export const updateUserInfo = async (data) => {

    try {
        const res = await fetch(`http://${ip}:3001/profile/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ ...data })
        })
        return await res.json()
    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
    }

}