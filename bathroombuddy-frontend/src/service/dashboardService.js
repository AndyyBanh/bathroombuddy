import axiosInstance from "../api/axiosInstance";

// Request service
export const getAllRequests = () => 
    axiosInstance.get('/v1/request');

export const getRequestById = (id) =>
    axiosInstance.get(`/v1/request/${id}`);

export const createRequest = (status, suppliesId, washroomId) =>
    axiosInstance.post('/v1/request', {
        status,
        suppliesId,
        washroomId
    });

export const updateRequest = (status, suppliesId, washroomId, id) => 
    axiosInstance.put(`/v1/request/${id}`, {
        status,
        suppliesId,
        washroomId
    });

export const deleteRequest = (id) =>
    axiosInstance.delete(`/v1/request/${id}`);

// Supply service
export const getAllSupplies = () =>
    axiosInstance.get('/v1/supplies');

export const getSupplyById = (id) =>
    axiosInstance.get(`/v1/supplies/${id}`);

export const createSupply = (type, quantity, lastReplenished = null) => 
    axiosInstance.post('/v1/supplies', {
        type, 
        quantity,
        lastReplenished
    });

export const updateSupply = (type, quantity, id) => 
    axiosInstance.put(`/v1/supplies/${id}`, {
        type,
        quantity        
    });

export const deleteSupply = (id) => 
    axiosInstance.delete(`/v1/supplies/${id}`);

// Washroom service
export const getAllWashrooms = () =>
    axiosInstance.get('/v1/washroom');

export const getWashroomById = (id) =>
    axiosInstance.get(`/v1/washroom/${id}`);

export const createWashroom = (name, floor) =>
    axiosInstance.post('/v1/washroom', {name, floor});

export const updateWashroom = (name, floor, id) =>
    axiosInstance.put(`/v1/washroom/${id}`, {name, floor});

export const deleteWashroom = (id) =>
    axiosInstance.delete(`/v1/washroom/${id}`);
