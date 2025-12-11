
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import fetchProfileData from './fetchProfileData'
import { selectUser, setUser, USER_TYPES } from '../features/user/userSlice';
import { selectToken, setToken } from '../features/token/tokenSlice';
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';

 




export async function fetchUser() {
    const user  = await selectUser();
    const token = await selectToken();
    const docCookies = parseCookie(document.cookie)
   
    console.log("docCookies", docCookies)
    const userType = docCookies.get("user_type")
    const url = "https://playground-backend-1t0f.onrender.com/api/users/"

    const res = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json()
   
    if (res.status >= 200 && res.status <= 209) {
        if(token !== null){
			const arrayToken = token.split('.');
			const tokenPayload = JSON.parse(atob(arrayToken[1]));	
			console.log("Token Payload ID: ", tokenPayload?.user_id);
            const profile = await fetchProfileData(tokenPayload?.user_id, userType === USER_TYPES.brand)
            console.log("Profile: ", profile)
    
            return profile
			
			
			}
     
    
    }

    const err = { ...data }
    throw err
}