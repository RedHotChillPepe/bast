import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, refreshAccessToken } from '../utils/authUtils';

const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)             // заменить на
  const [isOnboarded, setIsOnboarded] = useState(false)   // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!
  const [checkAuthB, setCheckAuthB] = useState(false)

  async function setAuth(json) {
    await SecureStore.setItemAsync("auth",
      JSON.stringify([
        {
          access_token: json[0].access_token,
          refresh_token: json[0].refresh_token
        }
      ]))
    setCheckAuthB(true)
  }

  // TODOL не используется
  async function setOnboard(bool) {
    const tempauth = await getAuth();
    await setAuth(tempauth)
    setCheckAuthB(true)
  }

  async function logout() {
    await SecureStore.deleteItemAsync('auth')
    setCheckAuthB(true)
  }

  useEffect(() => {
    async function checkAuth() {
      const access_token = await getAuth();
      const status = (access_token !== null)
      setIsAuth(status)
      setIsOnboarded(status)
    }
    checkAuth()
    // TODO: проверить, что токен жив
    if (checkAuthB) {
      setCheckAuthB(false)
    }
    return () => {

    }
  }, [checkAuthB])

  return (
    <AuthContext.Provider value={{ isAuth, isOnboarded, getAuth, setOnboard, setAuth, setCheckAuthB, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);