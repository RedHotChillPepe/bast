import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext, useState } from 'react'


const ApiContext = createContext()
const host = process.env.EXPO_PUBLIC_API_HOST

export default function ApiProvider ({ children }){

    const getAllPosts = async () =>{
        const url = host + "api/posts/all"
        console.log(url);

        return fetch(url)
        .then(response => response.json()
        )
        .then(json =>
            {return json.rows}
        )
        .catch(error => {
            console.error("Error fetching files: ", error);            
        })
    }

    const getAllVillages = async () =>{
        const url = host + "api/villages/all"
        console.log(url);

        return fetch(url)
        .then(response => response.json()
        )
        .then(json =>
            {return json.rows}
        )
        .catch(error => {
            console.error("Error fetching files: ", error);            
        })
    }

    const postRegister = async (data) => {
        const url = host + "api/users/newuser"
        try {

            return fetch(url,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([data])
            })
            .then(response => {return  response})
            .catch(error => {
                console.error("Error posting user: ", error);            
            })

        } catch(error){
            console.log(error);
            
        }
        
    }

    const getLogin = async (phone, password) =>{
        const url = host + "api/users/login"

        try {
            return fetch(url,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    phone:phone,
                    password:password
                }])
            })
            .then(response => {return  response})
            .catch(error => {
                console.error("Error getting logged in: ", error);            
            })
        } catch (error) {
            console.error(error);
        }
    }

    const getUser = async (phone) => {
        const url = host + "api/users/getuser"

        try {
            return fetch(url,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    phone:phone,
                }])
            })
            .then(response => {return  response})
            .catch(error => {
                console.error("Error getting user: ", error);            
            })
        } catch (error) {
            console.error(error);
        }
    }
    

    return (
        <ApiContext.Provider value={{getAllPosts, getAllVillages, getLogin, getUser, postRegister}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);