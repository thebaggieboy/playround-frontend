import { USER_TYPES, } from '../features/user/userSlice'
import { useMutation} from '@tanstack/react-query'
import fetchProfileData from '../lib/fetchProfileData'
import {selectToken, setToken} from '../features/token/tokenSlice'
import {selectUser, setUser} from "../features/user/userSlice"
import { useDispatch, useSelector } from "react-redux";
import useData from './useData'
import { selectUserEmail, setUserEmail } from '../features/user/userActiveEmail'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

 

const useLogin = (url, successCallback, userType) => {
    const user = useSelector(selectUser)
    const user_email = useSelector(selectUserEmail)
    const token = useSelector(selectToken)
    const router = useRouter()
    const dispatch = useDispatch()
    const isBrand = userType === USER_TYPES.user
    //const { data, loading } = useData("https://altclan-api-v1.onrender.com/api/users/")
	const [profileQuery, setProfileQuery] = useState([]);
	 
	const [userResult, setUserResult] = useState([])

    const mutation = useMutation({
        mutationFn: async ({ username, email, password }) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password}),
                credentials: "include"

            })
            const data = await res.json()
            console.log("Access Token: ", data.access)
           
           
       

          
            if (res.status >= 200 & res.status <= 209) {
                dispatch(setToken(data?.access))
                const  url2 = "https://avantrades-api.onrender.com/api/users/"
                const res2 =  await fetch(url2, {
                    method: "GET",
                    headers: {
                    
                        "Content-Type": "application/json"
                    },
                })
            
                const data2 = await res2.json()
            
                if (user_email !== null){
                    let filteredUsers = data2.filter((user) => {
                        return user.email === user_email;
                    });
                  
                    
                    dispatch(setUser(filteredUsers))
                    console.log("Current User: ", user)
                }
               
                
                           
                return
                    
            }

            const error = { ...data }
            throw error
    
        },
        onSuccess: (user) => {
            successCallback(user)
        }
    })





    return mutation
}

export default useLogin