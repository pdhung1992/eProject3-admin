import apiServices from "./api";

const getFoodByRestaurant = async (id) => {
    try {
        const url = `/foods/restaurant/${id}`;
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

const getFoodByTypeAndServe = async (rId, tId, sId) => {
    try {
        const url = `/foods/restaurant/${rId}/type/${tId}/serve/${sId}`;
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

const getFoodDetails = async (id) => {
    try {
        const url = `/foods/details/${id}`;
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

const createFood = async (formData, axiosConfig) => {
    try {
        const url = `/foods/create`;
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

const updateFood = async (id, formData, axiosConfig) => {
    try {
        const url = `/foods/update/${id}`;
        const res = await apiServices.put(url, formData, axiosConfig);
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

const deleteFood = async (id, axiosConfig) => {
    try {
        const url = `/foods/delete/${id}`;
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

const foodServices = {
    getFoodByRestaurant,
    getFoodByTypeAndServe,
    getFoodDetails,
    createFood,
    updateFood,
    deleteFood
}

export default foodServices;