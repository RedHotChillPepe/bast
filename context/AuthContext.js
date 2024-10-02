import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false)             // заменить на
    const [isOnboarded, setIsOnboarded] = useState(false)   // secure store. ТЕСТОВЫЕ ПЕРЕМЕННЫЕ!

  return (
    <AuthContext.Provider value={{isAuth,isOnboarded,setIsAuth,setIsOnboarded}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);