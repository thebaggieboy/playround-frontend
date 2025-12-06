import { createSlice } from "@reduxjs/toolkit";

 

const userProfileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: null
    },
    reducers: {
        getProfile: (state, action) => {
            state.profile = action.payload
        },
        setProfile: (state, action) => {
            state.profile = action.payload
        }
    }
})

//action creators
export const { setProfile } = userProfileSlice.actions


//selectors
export const selectUser = mainState => mainState.profile.profile

export default userProfileSlice.reducer