import { apiRequest } from "../utils/apiRequest"

export const register = async (data) => apiRequest('auth/register', 'POST', data)
export const login = async (body) => apiRequest(`auth/login`, 'POST', body)
export const resetPassword = async (body) => apiRequest(`auth/reset-password`, 'POST', body)
export const updatePassword = async (body) => apiRequest(`auth/reset-password`, 'PATCH', body)
export const checkResetPasswordLink = async (token) => apiRequest(`auth/reset-password?token=${token}`, 'GET')

export const getUser = async () => apiRequest('profile', 'GET')
export const updateUserInfo = async (data) => apiRequest('profile', 'PATCH', data)

export const getProducts = async () => apiRequest('products', 'GET')
export const getProduct = async (productId) => apiRequest(`products/${productId}`, 'GET')

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

export const uploadAvatar = async (body) => apiRequest('profile/upload', 'POST', body)

