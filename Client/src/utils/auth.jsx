export function isLoggedIn() {
    return !!localStorage.getItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}
export function getUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch {
        return null;
    }
}