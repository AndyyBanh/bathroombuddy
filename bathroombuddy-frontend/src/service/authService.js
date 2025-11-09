import axiosInstance from "../api/axiosInstance";

export const signup = (email, password, username) => 
    axiosInstance.post('/v1/auth/signup', {email, password, username});

export const login = (email, password) =>
    axiosInstance.post('/v1/auth/login', {email, password});

