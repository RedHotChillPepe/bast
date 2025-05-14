import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, refreshAccessToken } from '../utils/authUtils';

const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)             // заменить на
  const [isOnboarded, setIsOnboarded] = useState(false)   // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!
  const [checkAuthB, setCheckAuthB] = useState(false)
  const [tokenIsLoaded, setTokenIsLoaded] = useState(false);
  const [referralToken, setReferralToken] = useState();

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

  const changePassword = (navigation, phoneNumber) => {
    if (!phoneNumber || !navigation) return;

    navigation.navigate("Auth", { screen: "ResetPassword", params: { regData: { phoneNumber, password: "", confirmPassword: "" } } });
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
      setTokenIsLoaded(true)
    }
    checkAuth()
    // TODO: проверить, что токен жив
    if (checkAuthB) {
      setCheckAuthB(false)
    }
    return () => {

    }
  }, [checkAuthB])

  useEffect(() => {
    if (!referralToken) return;
    console.log(1);
    // [ ] Логика для авторизованного чела
  }, [referralToken])

  return (
    <AuthContext.Provider value={{
      isAuth, isOnboarded, getAuth, setOnboard, setAuth, setCheckAuthB, checkAuthB,
      logout, tokenIsLoaded, changePassword, setReferralToken, referralToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);