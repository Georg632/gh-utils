export function setCookie(key: string, value: string, days: number) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }

    document.cookie = `${key}=${value || ''}${expires}; path=/`;
}

export function getCookie(key: string) {
    const cookieKey = key + '=';
    const cookieParts = document.cookie.split(';');
    for (let cpart of cookieParts) {
        while (cpart.charAt(0) === ' ') cpart = cpart.substring(1, cpart.length);
        if (cpart.indexOf(cookieKey) === 0) return cpart.substring(cookieKey.length, cpart.length);
    }
    return '';
}