import React, { createContext, useContext, useReducer } from 'react'
import AppReducer from './appReducer'


export const AppContext = createContext({})

const initialState = {
    todos: [],
    page: 0,
    isAdmin: false,
    sort: {}
}
export default function AppProvider({ children }) {
    const [state, dispatch] = useReducer(AppReducer, initialState)
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)