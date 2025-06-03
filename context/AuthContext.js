import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, refreshAccessToken } from "../utils/authUtils";
import { removePushToken } from "../utils/notificationUtils";
import { useApi } from "./ApiContext";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false); // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!
  const [checkAuthB, setCheckAuthB] = useState(false);
  const [tokenIsLoaded, setTokenIsLoaded] = useState(false);
  const [referralToken, setReferralToken] = useState();
  const [isDeleted, setIsDeleted] = useState(false);

  const { deletePushToken } = useApi();

  async function setAuth(json) {
    await SecureStore.setItemAsync(
      "auth",
      JSON.stringify([
        {
          access_token: json[0].access_token,
          refresh_token: json[0].refresh_token,
        },
      ])
    );

    setIsDeleted(false);
    setCheckAuthB(true);
  }

  const changePassword = (navigation, phoneNumber) => {
    if (!phoneNumber || !navigation) return;

    navigation.navigate("Auth", {
      screen: "ResetPassword",
      params: { regData: { phoneNumber, password: "", confirmPassword: "" } },
    });
  };

  // TODOL не используется
  async function setOnboard(bool) {
    const tempauth = await getAuth();
    await setAuth(tempauth);
    setCheckAuthB(true);
  }

  async function logout() {
    await removePushToken(deletePushToken);
    await SecureStore.deleteItemAsync("auth");
    setCheckAuthB(true);
  }

  useEffect(() => {
    if (isDeleted) logout();
  }, [isDeleted]);

  useEffect(() => {
    async function checkAuth() {
      const access_token = await getAuth();
      const status = access_token !== null;
      setIsAuth(status);
      setIsOnboarded(status);
      setTokenIsLoaded(true);
    }
    checkAuth();
    if (checkAuthB) {
      setCheckAuthB(false);
    }
    return () => {};
  }, [checkAuthB]);

  useEffect(() => {
    if (!referralToken) return;
    console.log(1);
    // [ ] Логика для авторизованного чела
  }, [referralToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isOnboarded,
        getAuth,
        setOnboard,
        setAuth,
        setCheckAuthB,
        checkAuthB,
        logout,
        tokenIsLoaded,
        changePassword,
        setReferralToken,
        referralToken,
        isDeleted,
        setIsDeleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
