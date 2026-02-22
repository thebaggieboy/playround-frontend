import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { USER_TYPES, selectUser, setUser, setUserType } from '../features/user/userSlice'
import fetchProfileData from '../lib/fetchProfileData'
import { selectUserEmail } from '../features/user/userActiveEmail'

import { selectToken, setToken } from '@/features/token/tokenSlice'




const useSignUp = (url, successCallback, userType) => {
    const isBrand = userType === USER_TYPES.brand
    const user = useSelector(selectUser)
    const token = useSelector(selectToken)
    const user_email = useSelector(selectUserEmail)
    const dispatch = useDispatch()


    const mutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"

            })
            const data = await res.json()
            console.log("Data: ", data)

            const url2 = "https://playground-backend-1t0f.onrender.com/api/users/"
            const res2 = await fetch(url2, {
                method: "GET",
                headers: {

                    "Content-Type": "application/json"
                },
            })

            const data2 = await res2.json()
            const results = data2.results
            console.log("Data 2: ", results)


            let filteredUsers = results.filter((user) => {
                return user.email === data.email;
            });

            console.log("Filtered User: ", filteredUsers)


            const res3 = await fetch('https://playground-backend-1t0f.onrender.com/auth/jwt/create/', {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"

            })
            const data3 = await res3.json()
            console.log("Token data: ", data3)



            dispatch(setToken(data3?.access))
            dispatch(setUser(filteredUsers))



            const error = { ...data }
            throw error


        },
        onSuccess: (user) => {

            successCallback(user)
        }
    })

    return mutation
}

export default useSignUp