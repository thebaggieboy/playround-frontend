import { createSlice } from "@reduxjs/toolkit";

const brandUserSlice = createSlice({
    name: "brand_user",
    initialState: {
        brand_user: null
    },
    reducers: {
        setBrandUser: (state, action) => {
            state.brand_user = action.payload
        }
    }
})

//action creators
export const { setBrandUser } = brandUserSlice.actions


//selectors
export const selectBrandUser = mainState => mainState.brand_user.brand_user

export default brandUserSlice.reducer