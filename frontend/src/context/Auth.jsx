import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const AuthContext = createContext();
const AuthProvider = ({children})=>{

    const [auth, setAuth]  = useState({
        user:null,
        token:'',
      
    });

    const isAuthenticated = !!auth.token;
    
    // default  axios
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(()=>{
        const data = localStorage.getItem("auth");

        if(data){
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user:parseData.user,
                token:parseData.token,
            });
        }
        //eslint-disable-next-line
    },[]);

    const logout = () => {
        setAuth({ user: null, token: "" });
        localStorage.removeItem("auth");
      };

    return (
        <AuthContext.Provider value={{auth, setAuth, logout, isAuthenticated} }>
            {children}
        </AuthContext.Provider>
    );

}

const useAuth = ()=> useContext(AuthContext);

export { AuthProvider, useAuth };