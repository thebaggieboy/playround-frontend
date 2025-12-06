import { createSlice } from "@reduxjs/toolkit";

 

const userIdSlice = createSlice({
    name: "id",
    initialState: {
        profile: null
    },
    reducers: {
        getId: (state, action) => {
            state.id = action.payload
        },
        setId: (state, action) => {
            state.id = action.payload
        }
    }
})

//action creators
export const { setId } = userIdSlice.actions


//selectors
export const selectUserId = mainState => mainState.userId.userId

export default userIdSlice.reducer