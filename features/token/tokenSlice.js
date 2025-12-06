import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    token: null
}
const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        addToken: (state, action) => {
            state.token.push(action.payload)
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setToken} = tokenSlice.actions



export const selectToken = mainState => mainState.token.token

export default tokenSlice.reducer