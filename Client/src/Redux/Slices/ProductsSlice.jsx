import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 78676000))
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllProducts`)
    return response.data.products
})
export const fetchSearchProduct = createAsyncThunk('products/fetchSearchProduct', async (name) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchProd/${name}`)
    return response.data.searchResults
})
export const fetchFilteredProduct = createAsyncThunk('products/fetchFilteredProduct', async (filterKey) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/fetchFilteredProducts/${filterKey}`)
    return response.data.filteredResults
})

const initState = {
    items: [],
    status: 'idle',
    isSearch : false,
    isFiltered: false
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
        .addCase(fetchProducts.rejected, (state) => {
            state.status = 'failed'
        })
        .addCase(fetchSearchProduct.rejected, (state) => {
            state.status = 'failed'
        })
        .addCase(fetchFilteredProduct.rejected, (state) => {
            state.status = 'failed'
        })
    }
})
export const items = (state) => state.products.items
export const prodStatus = (state) => state.products.status
export const search = (state) => state.products.isSearch
export const filtered = (state) => state.products.isFiltered

export default productsSlice.reducer