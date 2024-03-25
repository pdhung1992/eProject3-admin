import apiServices from "./api";

const getAllCategories = async () => {
    try {
        const url = `/categories`;
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

const getCategoryDetails = async (id) => {
    try {
        const url = `/categories/${id}`;
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

const createCategory = async (formData) => {
    try {
        const url = `/categories/create`;
        const res = await apiServices.post(url, formData);
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

const updateCategory = async (id, formData) => {
    try {
        const url = `/categories/update/${id}`;
        const res = await apiServices.post(url, formData);
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

const deleteCategory = async (id) => {
    try {
        const url = `/categories/delete/${id}`;
        const res = await apiServices.delete(url);
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

const categoryServices = {
    getAllCategories,
    getCategoryDetails,
    createCategory,
    updateCategory,
    deleteCategory
}

export default categoryServices;