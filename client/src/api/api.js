// import { apiRequest } from "../utils/apiHelper.js"


class ApiError extends Error {
    constructor(message, code, data) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.data = data
    }
}

const apiRequest = async (url, method, body, headers) => {
    try {
        if (method === 'GET') {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || null,
                    ...headers
                },
            })

            if (!res.ok) {
                const json = await res.json()
                throw new ApiError(json.message, json.code, json)
            }

            return await res.json()
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
            method,
            body: method !== 'GET' && body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                ...headers
            },
        })

        if (!res.ok) {
            const json = await res.json()
            throw new ApiError(json.message, json.code, json)
        }

        return await res.json()

    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error))
    }
}

export const register = async (data) => apiRequest('auth/register', 'POST', data)
export const login = async (email, password) => apiRequest(`auth/login`, 'POST', { email, password })

export const getUser = async () => apiRequest('profile', 'GET')
export const updateUserInfo = async (data) => apiRequest('profile', 'PATCH', data)

export const getProducts = async () => apiRequest('products', 'GET')

export const addFavoriteItem = async (userId, productId) => apiRequest(`favorites/${productId}`, 'POST', { id: userId })
export const removeFavoriteItem = async (userId, productId) => apiRequest(`favorites/${productId}`, 'DELETE', { id: userId })

export const addCartItem = async (userId, productId, quantity) => apiRequest(`cart-items/${productId}`, 'POST',
    { userId: userId, quantity: quantity || 1 })

export const removeCartItem = async (userId, productId) => apiRequest(`cart-items/${productId}`, 'DELETE', { userId })

export const updateCartItem = async (userId, productId, quantity) => apiRequest(`cart-items/${productId}`, 'PATCH',
    { id: userId, quantity })


export const makeOrder = async (orderData) => apiRequest('orders', 'POST', orderData)

export const getOrder = async (orderId) => apiRequest(`orders/${orderId}`, 'GET')

export const createPayment = async (amount, orderId) => apiRequest('create-payment', 'POST', { amount, orderId })

export const getPaymentStatus = async (orderId) => apiRequest(`payment-status/${orderId}`, 'POST')

export const updatePaymentStatus = async (orderId, body) => apiRequest(`orders/${orderId}`, 'PATCH', body)


export const getStepChoices = async () => apiRequest('chooses-steps', 'GET')

export const searchProducts = async (query) => apiRequest(`search?${query}`, 'GET')

export const checkToken = async () => apiRequest('auth/check', 'POST')



// export const createPayment = async (amount, orderId, next) => {
//     try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/create-payment`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': localStorage.getItem('token')
//             },
//             body: JSON.stringify({ amount, orderId })
//         })

//         if (!res.ok)
//             return alert('Не удалось совершить оплату')

//         const json = await res.json()
//         return json
//     } catch (error) {
//         throw error instanceof Error ? error : new Error(String(error))
//     }
// }



// export const getChooseStepsOptions = async () => {
//     try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/chooses-steps`)
//         return await res.json()
//     } catch (error) {
//         throw error instanceof Error ? error : new Error(String(error))
//     }

// }