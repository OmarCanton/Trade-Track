import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRecents = createAsyncThunk('recents/fetchRecents', async (token, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/recentSelectedProducts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response?.data?.recentProducts
    } catch(err) {
        console.error(err)
        rejectWithValue(err?.response?.data?.message)
    }
})

const initState = {
    items: [],
    status: 'idle',
}

const recentsSlice = createSlice({
    name: 'recents',
    initialState: initState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchRecents.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchRecents.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload
        })
        .addCase(fetchRecents.rejected, (state) => {
            state.status = 'failed'
        })
    }
})
export const recentItems = (state) => state.recents.items
export const recentStatus = (state) => state.recents.status
export default recentsSlice.reducer