import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../Slices/ProductsSlice' 
import recentReducer from '../Slices/RecentSelectedProds'

const store = configureStore({
    reducer: {
        products: productsReducer,
        recents: recentReducer
    }
})

export default store