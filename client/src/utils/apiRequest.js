
class ApiError extends Error {
    constructor(message, code, data) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.data = data
    }
}

export const apiRequest = async (url, method, body, headers = {}) => {
    try {
        const isFormData = body instanceof FormData

        const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
            method,
            body: method !== 'GET' && body ? (isFormData ? body : JSON.stringify(body)) : null,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                'Authorization': localStorage.getItem('token') || sessionStorage.getItem('token') || null,
                ...headers,
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
