import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from '../Slices/AuthSlice'
import productsReducer from '../Slices/ProductsSlice' 
import recentReducer from '../Slices/RecentSelectedProds'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth']
} 
const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer,
    recents: recentReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer) 

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store)