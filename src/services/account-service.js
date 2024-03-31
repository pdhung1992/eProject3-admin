

import apiServices from "./api";

const getAllAcc = async (axiosConfig) => {
    try {
        const url = 'accounts';
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
    }catch (e){
        console.log(e.message);
    }
}

const getAccDetails = async (id, axiosConfig) => {
    try {
        const url = `/accounts/details/${id}`;
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const createAccount = async (formData, axiosConfig) => {
    try {
        const url = 'accounts/create';
        const res = await apiServices.post(url, formData, axiosConfig);
        return res.data;
    }catch (e){
        console.log(e.message);
    }
}

const updateAccount = async (id, formData, axiosConfig) => {
    try {
        const url = `/accounts/update/${id}`;
        const res = await apiServices.post(url, formData, axiosConfig);
        return res.data;
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const deleteAccount = async (id, axiosConfig) => {
    try {
        const url = `/accounts/delete/${id}`;
        const res = await apiServices.delete(url, axiosConfig);
        return res.data;
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const accountServices = {
    getAllAcc, createAccount, deleteAccount, getAccDetails, updateAccount
}

export default accountServices;