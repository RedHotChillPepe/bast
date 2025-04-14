// utils/authUtils.js
import * as SecureStore from 'expo-secure-store';

const host = process.env.EXPO_PUBLIC_API_HOST;

export const getAuth = async () => {
    const authDataRaw = await SecureStore.getItemAsync('auth');
    if (!authDataRaw) return null;
    const authData = await JSON.parse(authDataRaw)[0];
    const { access_token, refresh_token } = authData;
    const isValid = await checkAccessToken(access_token);

    if (isValid) return access_token;

    // Попробуем обновить токен
    const newTokens = await refreshAccessToken(refresh_token);

    if (newTokens?.access_token && newTokens?.refresh_token) {
        await SecureStore.setItemAsync(
            'auth',
            JSON.stringify([{ access_token: newTokens.access_token, refresh_token: newTokens.refresh_token }])
        );

        return newTokens.access_token;
    }

    // Обновление не удалось
    return null;
};

export const checkAccessToken = async (access_token) => {
    try {
        const res = await fetch(`${host}api/auth/check-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({ "authorization": access_token })
        });

        console.log("checkAccessToken:", await res.json());
        return res.ok;
    } catch (err) {
        return false;
    }
};

export const refreshAccessToken = async (refresh_token) => {
    try {
        const res = await fetch(`${host}api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token }),
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        console.error("Не удалось обновить refresh_token: ", error);
        return null;
    }
};
