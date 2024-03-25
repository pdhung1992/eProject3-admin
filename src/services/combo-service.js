import apiServices from "./api";

const getComboByRestaurant = async (id) => {
    try {
        const url = `/combos/restaurant/${id}`;
        const res = await apiServices.get(url);
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

const createCombo = async (formData, axiosConfig) => {
    try {
        const url = `/combos/create`;
        const res = await apiServices.post(url, formData, axiosConfig);
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

const deleteCombo = async (id, axiosConfig) => {
    try {
        const url = `/combos/delete/${id}`;
        const res = await apiServices.delete(url, axiosConfig);
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

const comboServices = {
    getComboByRestaurant,
    createCombo,
    deleteCombo
}

export default comboServices;