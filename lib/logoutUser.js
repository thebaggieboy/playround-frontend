import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { USER_TYPES } from "../features/user/userSlice"

export default async function logoutUser() {
    const cookies = parseCookie(document.cookie)
    const userType = cookies.get("user_type")


    const url = userType === USER_TYPES.brand ? "https://altclan-api-v1.onrender.com/dj-rest-auth/logout/" : userType === USER_TYPES.user
        && "https://altclan-api-v1.onrender.com/dj-rest-auth/logout/"


    const res = await fetch(url, {
        credentials: "include",
        method: "POST"
    })
    if (!res.ok) {
        const err = await res.json()
        throw err
    }

    const data = await res.json()
    return data
}