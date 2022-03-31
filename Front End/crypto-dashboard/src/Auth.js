import {Navigate, useLocation } from "react-router-dom";

export const setToken = (token)=>{
    localStorage.setItem('token', token)// make up your own token
};

export const setClient = (client)=>{
    localStorage.setItem('client', client);
}

export const fetchToken = ()=>{
    return localStorage.getItem('token');
};

export const fetchClient = ()=>{
    return localStorage.getItem('client');
};

export function RequireToken({children}){
    let auth = fetchToken();
    let location = useLocation();

    if(!auth){
        return <Navigate to='/login' state ={{to : location}}/>;
    }

    return children;
};