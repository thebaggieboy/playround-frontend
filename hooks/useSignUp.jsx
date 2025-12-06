import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { USER_TYPES, selectUser, setUser, setUserType } from '../features/user/userSlice'
import fetchProfileData from '../lib/fetchProfileData'
import { selectUserEmail } from '../features/user/userActiveEmail'




const useSignUp = (url, successCallback, userType) => {
    const isBrand = userType === USER_TYPES.brand
    const user = useSelector(selectUser)
    const user_email = useSelector(selectUserEmail)
    const dispatch = useDispatch()  

    const mutation = useMutation({
        mutationFn: async ({ email, password}) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password}),
                credentials: "include"

            })
            const data = await res.json()

            let filteredUsers = data?.filter((user) => {
                return user.email === user_email;
            });
          
            
            dispatch(setUser(filteredUsers))
            console.log("Current User: ", user)

            if (res.status >= 200 & res.status <= 209) {
				console.log("New User Registered.")
				console.log(data)
                const id = data.id
                const profile = await fetchProfileData(id, USER_TYPES.user)
                console.log("Signup profile: ", profile)
                return profile
           
                
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

export default useSignUp