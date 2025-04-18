export const apiRequest = async (url, method, body) => {
    try {
        const res = await fetch(url, {
            method: method || 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') || '' },
            body: method !== 'GET' ? JSON.stringify(body) : null
        })

        if (!res.ok) {
            alert(`Ошибка ${res.status}: ${res.statusText}`)
            return null
        }

        return await res.json()
    } catch (error) {
        alert('Ошибка соединения с сервером');
        console.error(error);
        return null;
    }
}