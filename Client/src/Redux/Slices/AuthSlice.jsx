import { createSlice } from "@reduxjs/toolkit";

const initState = {
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        login: (state, action) => {
            state.user = action?.payload?.user
            state.token = action?.payload?.token
        },
        logout: (state) => {
            state.user = null
            state.token = null
        },
        updateCanAcess: (state, action) => {
            state.user.canAccess = action?.payload
        }
    }
})

//export states
export const authed_user = (state) => state.auth.user
export const authed_token = (state) => state.auth.token

//export slice and actions
export const { login, logout, updateCanAcess } = authSlice.actions
export default authSlice.reducer