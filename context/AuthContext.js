import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';

const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false)             // заменить на
    const [isOnboarded, setIsOnboarded] = useState(false)   // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!
    const [checkAuthB, setCheckAuthB] = useState(false)


    const discovery = {
      authorizationEndpoint:'https://id.vk.com/oauth2/auth'
    }

    const [request, response, promptAsync] = AuthSession.useAuthRequest({
      clientId:'52608804',
      redirectUri: AuthSession.makeRedirectUri(
        
      )
    },
    discovery)

    async function setAuth(json) {
      const {phone, password, status, onboarded} = json[0]
      await SecureStore.setItemAsync("auth", 
        JSON.stringify([
          {
            status: status,
            onboarded:onboarded,
            phone:phone,
            password:password
          }
        ]))
      setCheckAuthB(true)
    }



    async function authVK() {
      await promptAsync()

      console.log(await request);
      
      console.log(await response);
      
    }

    async function getAuth() {
      let result = await SecureStore.getItemAsync("auth")
      if (result) {
        return result
      } 
    }

    async function setOnboard(bool) {
      const tempauth = JSON.parse(await getAuth())
      const {status, phone, password} = tempauth[0]
      await setAuth([{
          status:status,
          onboarded:bool,
          phone:phone,
          password:password
      }])
      setCheckAuthB(true)
    }

    async function logout() {
      await SecureStore.deleteItemAsync('auth')
      setCheckAuthB(true)
    }

    useEffect(() => {
      async function checkAuth() {
        if (await getAuth() == null) {
          await setAuth([{
            status:false,
            onboarded:false,
            phone:"",
            password:""
          }])
          const tempauth = JSON.parse(await getAuth())
          const {status, isOnboarded} = tempauth[0]
          setIsAuth(status)
          setIsOnboarded(isOnboarded)
        } else {
          const tempauth = JSON.parse(await getAuth())
          const {status, onboarded} = tempauth[0]
          setIsAuth(status)
          setIsOnboarded(onboarded)
        }
        console.log(await getAuth());
      }
      checkAuth()
      
      
      if (checkAuthB) {
        setCheckAuthB(false)
      }
      return () => {
        
      }
    },[checkAuthB])
    

    

  return (
    <AuthContext.Provider value={{isAuth,isOnboarded, setOnboard, setAuth, setCheckAuthB, authVK, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);