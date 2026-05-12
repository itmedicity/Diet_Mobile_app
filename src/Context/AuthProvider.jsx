// @ts-nocheck
import React, { memo } from 'react';
import { createContext, useState } from 'react'

const AuthContext = createContext({});
export const AuthProvider = memo(({ children }) => {

    const [auth, setAuth] = useState({ accessToken: null, userInfo: null });
 

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
})


export default AuthContext