import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (token, {rejectWithValue}) => {
    try {
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllProducts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response?.data?.products
    } catch(err) {
        console.error
        rejectWithValue(err?.response?.data?.message)
    }
})
export const fetchSearchProduct = createAsyncThunk('products/fetchSearchProduct', async ({name, token}, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchProd/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response?.data?.searchResults
    } catch(err) {
        console.error(err)
        rejectWithValue(err?.response?.data?.message)
    }
})
export const fetchFilteredProduct = createAsyncThunk('products/fetchFilteredProduct', async ({filterKey, token}, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchFilteredProducts/${filterKey}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response?.data?.filteredResults
    } catch(err) {
        console.error(err)
        rejectWithValue(err?.response?.data?.message)
    }
})

const initState = {
    items: [],
    status: 'idle',
    isSearch : false,
    isFiltered: false,
    error: null
}

const productsSlice = createSlice({
    name: 'products',
    initialState: initState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading'
            state.isSearch = false
            state.isFiltered = false
        })
        .addCase(fetchSearchProduct.pending, (state) => {
            state.status = 'loading'
            state.isSearch = true
            state.isFiltered = false
        })
        .addCase(fetchFilteredProduct.pending, (state) => {
            state.status = 'loading'
            state.isSearch = false
            state.isFiltered = true
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload
            state.isSearch = false
            state.isFiltered = false
        })
        .addCase(fetchSearchProduct.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload
            state.isSearch = true
            state.isFiltered = false
        })
        .addCase(fetchFilteredProduct.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.items = action.payload
            state.isSearch = false
            state.isFiltered = true
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(fetchSearchProduct.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(fetchFilteredProduct.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload || 'Something went wrong'
        })
    }
})
export const items = (state) => state.products.items
export const prodStatus = (state) => state.products.status
export const search = (state) => state.products.isSearch
export const filtered = (state) => state.products.isFiltered

export default productsSlice.reducer