
const ip = '192.168.1.105'
export const register = (email, password, next) => {
    fetch(`http://${ip}:3001/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-token-here'
        },
        body: JSON.stringify({ email: email, password: password })
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
    fetch(`http://${ip}:3001/cart/${productId}`, {
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
    fetch(`http://${ip}:3001/cart/${productId}`, {
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
    fetch(`http://${ip}:3001/cart/${productId}`, {
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
