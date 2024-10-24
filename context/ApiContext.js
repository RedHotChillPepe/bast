import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext, useState } from 'react'

const ApiContext = createContext()
const host = process.env.EXPO_PUBLIC_API_HOST

export default function ApiProvider ({ children }){

    const getAllPosts = async () =>{
        const url = host + "api/allposts"
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
        const url = host + "api/allvillages"
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

    return (
        <ApiContext.Provider value={{getAllPosts, getAllVillages}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);