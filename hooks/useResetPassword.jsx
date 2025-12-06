import { useMutation } from '@tanstack/react-query'


const useResetPassword = (isBrand) => {
    const userUrl = "https://altclan-api.onrender.com/dj-rest-auth/password/reset/"
    const brandUrl = "https://altclan-brands-api-1-1.onrender.com/dj-rest-auth/password/reset/"

    const mutation = useMutation({
        mutationFn: async (loginData) => {
            const res = await fetch(isBrand ? brandUrl : userUrl, {
                method: "POST",
                body: JSON.stringify(loginData),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()

            if (res.status >= 200 && res.status <= 209) {
                return { message: "password succesfully changed" }
            }

            const err = { ...data }
            throw err
        }
    })

    return mutation
}

export default useResetPassword