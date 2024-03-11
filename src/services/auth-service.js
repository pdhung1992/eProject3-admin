
import apiServices from "./api";

const login = async (formData) => {
    try {
        const url = 'auth/admin/login';
        const res = await apiServices.post(url, formData);
        return res.data
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

const logOut = async () => {
    await sessionStorage.removeItem('admin')
}

const authServices = {
    login,
    logOut
}

export default authServices;