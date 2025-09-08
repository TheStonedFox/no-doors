import { apiRequest } from "../utils/apiRequest"

//#region auth
export const register = async (data) => apiRequest('auth/register', 'POST', data)
export const removeSendedCodes = async (email) => apiRequest('auth/remove-codes', 'POST', { email })
export const login = async (body) => apiRequest(`auth/login`, 'POST', body)
export const resetPassword = async (body) => apiRequest(`auth/reset-password`, 'POST', body)
export const updatePassword = async (body) => apiRequest(`auth/reset-password`, 'PATCH', body)
export const checkResetPasswordLink = async (token) => apiRequest(`auth/reset-password?token=${token}`, 'GET')
//#endregion

//#region profile
export const getUser = async () => apiRequest('profile', 'GET')
export const getUserInfo = async (userId) => apiRequest(`profile/${userId}`, 'GET')
export const updateUserInfo = async (data) => apiRequest('profile', 'PATCH', data)
export const uploadAvatar = async (body) => apiRequest('profile/upload', 'POST', body)
//#endregion

export const checkReviewEligibility = async (productId, userId) => apiRequest(`products/review-eligibility?userId=${userId}&productId=${productId}`, 'GET')
//#region products
export const getProducts = async () => apiRequest('products', 'GET')
export const getProduct = async (productId) => apiRequest(`products/${productId}`, 'GET')
export const getProductComments = async (productId, type) => apiRequest(`products/${productId}/comments/?type=${type}`, 'GET')
//#endregion

//#region favorites
export const addFavoriteItem = async (userId, productId) => apiRequest(`favorites/${productId}`, 'POST', { id: userId })
export const removeFavoriteItem = async (userId, productId) => apiRequest(`favorites/${productId}`, 'DELETE', { id: userId })
//#endregion

//#region cart
export const addCartItem = async (userId, productId, quantity) => apiRequest(`cart-items/${productId}`, 'POST',
    { userId: userId, quantity: quantity || 1 })

export const removeCartItem = async (userId, productId) => apiRequest(`cart-items/${productId}`, 'DELETE', { userId })

export const updateCartItem = async (userId, productId, quantity) => apiRequest(`cart-items/${productId}`, 'PATCH',
    { id: userId, quantity })

export const clearCart = async (userId) => apiRequest(`cart/${userId}`, 'PUT',)
//#endregion

//#region order
export const makeOrder = async (orderData) => apiRequest('orders', 'POST', orderData)
export const getOrder = async (orderId) => apiRequest(`orders/${orderId}`, 'GET')
export const getPaymentStatus = async (orderId) => apiRequest(`payment-status/${orderId}`, 'POST')
export const updatePaymentStatus = async (orderId, body) => apiRequest(`orders/${orderId}`, 'PATCH', body)
//#endregion

//#region comments
export const addComment = async (body) => apiRequest('comments/', 'POST', body)
export const getComment = async (commentId) => apiRequest(`comments/${commentId}`, 'GET')
export const editComment = async (commentId, body) => apiRequest(`comments/${commentId}`, 'PATCH', body)
export const likeComment = async (commentId, body) => apiRequest(`comments/${commentId}/like`, 'PATCH', body)
export const getAllReplies = async (commentId) => apiRequest(`comments/${commentId}/replies/`, 'GET')
export const removeComment = async (commentId, commentType) => apiRequest(`comments/${commentId}?type=${commentType}`, 'DELETE')

//#endregion
export const getReply = async (replyId) => apiRequest(`replies/${replyId}`, 'GET')
export const addReply = async (body) => apiRequest('replies/', 'POST', body)
export const editReply = async (replyId, body) => apiRequest(`replies/${replyId}`, 'PATCH', body)
export const likeReply = async (replyId, body) => apiRequest(`replies/${replyId}/like`, 'PATCH', body)
//#region reply

//#endregion

//#region other
export const createPayment = async (amount, orderId) => apiRequest('create-payment', 'POST', { amount, orderId })
export const getStepChoices = async () => apiRequest('chooses-steps', 'GET')
export const searchProducts = async (query) => apiRequest(`search?${query}`, 'GET')
export const checkToken = async () => apiRequest('auth/check', 'POST')
//#endregion

