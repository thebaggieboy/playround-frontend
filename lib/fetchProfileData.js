import { useDispatch, useSelector } from "react-redux"
import { selectUser, setUser } from "../features/user/userSlice"
import { selectToken } from "../features/token/tokenSlice"



async function fetchProfileData(id, isBrand = false) {
    const  user  = await selectUser()
    const userUrl = `https://avantrades-api.onrender.com/api/users/${id}/`
   
    const res = await fetch(userUrl)
    const data = await res.json()

    if (data.err) {
        Promise.reject(data.err).catch(() => { })
        const error = data.err
        throw error
    }

    return data

}

export default fetchProfileData