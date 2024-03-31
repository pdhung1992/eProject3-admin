import apiServices from "./api";

const getOrderOfRestaurant = async (axiosConfig) => {
    try {
        const url = `/orders/restaurant`;
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const getOrderDetails = async (id, axiosConfig) =>{
    try {
        const url = `/orders/details/${id}`;
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const updateOrderStatus = async (id, formData) => {
    try {
        const url = `/orders/update/${id}`;
        const res = await apiServices.put(url, formData);
        return res;
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const orderServices = {
    getOrderOfRestaurant, getOrderDetails, updateOrderStatus
}

export default orderServices;