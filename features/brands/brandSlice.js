import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    brands: null
}
const brandSlice = createSlice({
    name: "brands",
    initialState,
    reducers: {
        addBrand: (state, action) => {
            state.brands.push(action.payload)
        },
        setBrand: (state, action) => {
            state.brands = action.payload
        }
    }
})

export default brandSlice.reducer