import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false)             // заменить на
    const [isOnboarded, setIsOnboarded] = useState(false)   // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!
    const [checkAuthB, setCheckAuthB] = useState(false)

    async function setAuth(json) {
      const {phone, password, status, onboarded, id, usertype} = json[0]
      await SecureStore.setItemAsync("auth", 
        JSON.stringify([
          {
            status: status,
            onboarded:onboarded,
            phone:phone,
            password:password,
            id:id,
            usertype:usertype // -1:"unregistered", 0:"admin", 1:"user", 2:"company", 3:"realtor"
          }
        ]))
      setCheckAuthB(true)
    }

    async function getAuth() {
      let result = await SecureStore.getItemAsync("auth")
      if (result) {
        return result
      } 
    }

    async function setOnboard(bool) {
      const tempauth = JSON.parse(await getAuth())
      const {status, phone, password, id, usertype} = tempauth[0]
      await setAuth([{
          status:status,
          onboarded:bool,
          phone:phone,
          password:password,
          id:id,
          usertype:usertype // -1:"unregistered", 0:"admin", 1:"user", 2:"company", 3:"realtor"
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
            password:"",
            id:"",
            usertype:-1 // -1:"unregistered", 0:"admin", 1:"user", 2:"company", 3:"realtor"
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
    <AuthContext.Provider value={{isAuth,isOnboarded, getAuth, setOnboard, setAuth, setCheckAuthB, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);