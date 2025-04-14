
const ip = '192.168.1.105'
export const register = (data, next) => {

    fetch(`http://${ip}:3001/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-token-here'
        },
        body: JSON.stringify({ fio: data.fio, email: data.email, password: data.password })
    })
        .then(res => res.json())
        .then(json => {
            if (json.msg === 'email already used')
                return console.log(json.msg)

            next()
            return console.log(json.msg)

        })
}

export const login = (email, password) => {
    fetch(`http://${ip}:3001/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-token-here'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(res => res.json())
        .then(json => {
            // console.log(json)
            if (json.msg === 'invalid data')
                return console.log(json.msg)

            localStorage.setItem('token', json.token)
            window.location.href = '/profile'
        })
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
}

export const getUser = async () => {
    const res = await fetch(`http://${ip}:3001/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })
    const user = await res.json()

    return user.user
}

export const getProducts = async (next) => {
    const res = await fetch(`http://${ip}:3001/products`)

    const products = await res.json()

    if (!res.ok)
        return console.log('error')

    next()
    return products
}


export const addFavoriteItem = async (userId, productId, next) => {
    fetch(`http://${ip}:3001/favorites/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ id: userId })
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            next()
        })

}

export const removeFavoriteItem = async (userId, productId, next) => {
    fetch(`http://${ip}:3001/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ id: userId })
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            next()
        })
}

export const addCartItem = (userId, productId, quantity, next) => {
    fetch(`http://${ip}:3001/cart-items/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ userId: userId, quantity: quantity || 1 })
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            next()
        })
}

export const removeCartItem = (userId, productId, next) => {
    fetch(`http://${ip}:3001/cart-items/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ userId })
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            next()
        }).catch(error => {
            console.error('Ошибка при удалении товара:', error)
        })

}

export const updateCartItem = (userId, productId, quantity, next) => {
    fetch(`http://${ip}:3001/cart-items/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ id: userId, quantity: quantity })
    })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            next()
        }).catch(error => {
            console.error('Ошибка при обновлени товара:', error)
        })
}


export const makeOrder = async (fio, phone, email, userId, deliveryMethod, paymentMethod, adress, products, sum) => {
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
}


export const createPayment = async (amount, orderId, next) => {
    const res = await fetch(`http://${ip}:3001/create-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ amount, orderId })
    })

    const json = await res.json()
    return json
    // next(json)
}


// export const createPayment = async (amount, orderId) => {
//     const res = await fetch(`http://${ip}:3001/create-payment`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': localStorage.getItem('token')
//         },
//         body: JSON.stringify({
//             amount,
//             orderId
//         })
//     })

//     const data = await res.json()
//     console.log(data)
//     return data
// }
