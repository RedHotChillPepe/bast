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

    const getPost = async (id) =>{
        const url = host + `api/posts/${id}`

        try {
            return fetch(url,{
                method:'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {return  response})
            .catch(error => {
                console.error("Error getting user: ", error);            
            })
        } catch (error) {
            console.error(error);
        }
    }

    const sendPost = async (data) => {
        const url = host + 'api/posts/newpost'

        try {
            return fetch(url,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify([{
                    name: data.title,
                    house_type: data.houseType,
                    wall_lb: data.wallMaterial,
                    wall_part: data.partitionMaterial,
                    price: data.price,
                    house_area: data.area,
                    num_floors: data.floors,
                    bedrooms: data.rooms,
                    full_address: data.location,
                    city: data.settlement,
                    plot_size: data.plotSize,
                    text: data.description,
                    roof: data.roof,
                    basement: data.basement,
                    /* landArea: '', */
                    kad_number: data.kadastr,
                    house_status: data.houseCondition,
                    year_built: data.constructionYear,
                    gas: data.gas,
                    water: data.water,
                    sewage: data.sewerage,
                    electricity_bill: data.electricity,
                    heating: data.heating,
                    photos:data.photos
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

    const sendSms = async (phone) => {
        const url = host + "api/sms/sendsms"

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
            console.error("Error sending Sms: ", error);
            
        }
    }

    const verifySms = async (phone, code) => {
        const url = host + "api/sms/verifysms"

        try {
            return fetch(url,{
                method:'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    phone:phone,
                    code:code
                }])
            })
            .then(response => {return  response})
            .catch(error => {
                console.error("Error getting user: ", error);            
            })
        } catch (error) {
            console.error("Error sending Sms: ", error);
            
        }
    }
    

    return (
        <ApiContext.Provider value={{getAllPosts, getAllVillages, 
        getLogin, getUser, postRegister, sendSms, verifySms,
        getPost, sendPost}}>
            {children}
        </ApiContext.Provider>
    )
}

export const useApi = () => useContext(ApiContext);