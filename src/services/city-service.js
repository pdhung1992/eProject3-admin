
import apiServices from "./api";

const getCities = async () => {
    try {
        const url = '/cities';
        const res = await apiServices.get(url);
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

const getCityDetails = async (id) => {
    try {
        const url = `/cities/${id}`;
        const res = await apiServices.get(url);
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

const createCity = async (formData) => {
    try {
        const url = '/cities/create';
        const res = await apiServices.post(url, formData);
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

const updateCity = async (id, formData) => {
    try {
        const url = `/cities/update/${id}`;
        const res = await apiServices.post(url, formData);
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

const deleteCity = async (id) => {
    try {
        const url = `/cities/delete/${id}`;
        const res = await apiServices.delete(url);
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

const cityServices = {
    getCities,
    getCityDetails,
    createCity,
    updateCity,
    deleteCity
}

export default cityServices;