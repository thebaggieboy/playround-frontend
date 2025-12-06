import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector, } from "react-redux"
import { selectUser, setUser } from "../features/user/userSlice"
import { selectBrandUser } from "../features/brands/brandUserSlice"
import { useRouter } from "next/router"


const useUpdateProfileData = (url, id, successCallback, actionFn) => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const user = useSelector(selectUser)
    const router = useRouter()
    const mutation = useMutation({
        mutationFn: async (newData) => {
            try {
                const res = await fetch(`${url}${user[0]?.id}/`, {
                    method: "PUT",
                    body: JSON.stringify({ ...newData }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                const data = await res.json()

                if (res.status >= 200 && res.status <= 209) {
                   
                    console.log("Update Successful! ")
                }

                const err = { ...data }
                Promise.reject(err).catch(() => { })
                throw { err }

            } catch (error) {
                console.log(error)
            }
        },
        onSuccess: (data) => {
            console.log(data)
            console.log(user[0]?.id, user[0].user_type)
            queryClient.setQueryData(["profile", user[0]?.id, user[0]?.user_type], (old) => {
                return { ...old, ...data }
            })
           // dispatch(actionFn(data))
            successCallback(user)
        }
    })


    return mutation
}

export default useUpdateProfileData