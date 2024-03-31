import apiServices from "./api";

const getAllDistricts = async () => {
    try {
        const url = '/districts';
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

const getDistrictByCity = async (id) => {
    try {
        const url = `/districts/bycity/${id}`;
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

const getDistrictDetails = async (id) => {
    try {
        const url = `/districts/details/${id}`;
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

const createDistrict = async (formData, axiosConfig) => {
    try {
        const url = `/districts/create`;
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

const updateDistrict = async (id, formData, axiosConfig) => {
    try {
        const url = `/districts/update/${id}`;
        const res = await apiServices.post(url, formData,axiosConfig);
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

const deleteDistrict = async (id, axiosConfig) => {
    try {
        const url = `/districts/delete/${id}`;
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

const districtServices = {
    getAllDistricts,
    getDistrictByCity,
    getDistrictDetails,
    createDistrict,
    updateDistrict,
    deleteDistrict
}

export default districtServices;