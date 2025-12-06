import { createSlice } from "@reduxjs/toolkit";

const userActiveEmailSlice = createSlice({
    name: "user_email",
    initialState: {
        user_email: null,
    },
    reducers: {
        setUserEmail: (state, action) => {
            state.user_email = action.payload
        }
    }
})

//action creators
export const { setUserEmail } = userActiveEmailSlice.actions


//selectors
export const selectUserEmail = mainState => mainState.user_email.user_email

export default userActiveEmailSlice.reducer