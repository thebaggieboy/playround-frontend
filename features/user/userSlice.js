import { createSlice } from "@reduxjs/toolkit";

export const USER_TYPES = {
    brand: "brand",
    user: "user"
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

//action creators
export const { setUser, setUserType } = userSlice.actions


//selectors
export const selectUser = mainState => mainState.user?.user
export const selectUserType = mainState => mainState.user.user?.user_type

export default userSlice.reducer