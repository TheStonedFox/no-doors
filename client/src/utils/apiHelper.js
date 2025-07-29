
// export class ApiError extends Error {
//     constructor(message, code, data) {
//         super(message)
//         this.name = 'ApiError'
//         this.code = code
//         this.data = data
//     }
// }

// export const apiRequest = async (url, method, body, headers) => {
//     try {
//         if (method === 'GET') {
//             const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': localStorage.getItem('token'),
//                     ...headers
//                 },
//             })

//             if (!res.ok) {
//                 const json = await res.json()
//                 throw new ApiError(json.message, json.code, json)
//             }

//             return await res.json()
//         }

//         const res = await fetch(`${import.meta.env.VITE_API_URL}/${url}`, {
//             method,
//             body: body ? JSON.stringify(body) : null,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': localStorage.getItem('token'),
//                 ...headers
//             },
//         })

//         if (!res.ok) {
//             const json = await res.json()
//             throw new ApiError(json.message, json.code, json)
//         }

//         return await res.json()

//     } catch (error) {
//         throw error instanceof Error ? error : new Error(String(error))
//     }
// }

