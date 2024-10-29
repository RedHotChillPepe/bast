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
                console.error("Error posting files: ", error);            
            })

        } catch(error){
            console.log(error);
            
        }
        
    }

    return (
        <ApiContext.Provider value={{getAllPosts, getAllVillages, postRegister}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);