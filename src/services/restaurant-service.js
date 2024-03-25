import apiServices from "./api";

const getRestaurantByAdmin = async (axiosConfig) => {
    try {
        const url = `/restaurant/admin`;
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

const updateRestaurant = async (id, formData, axiosConfig) => {
    try {
        const url = `/restaurant/update/${id}`;
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

const restaurantServices = {
    getRestaurantByAdmin,
    updateRestaurant
}

export default restaurantServices;