import apiServices from "./api";

const getPermissions = async () => {
    try {
        const url = `/permissions`;
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

const permissionServices = {
    getPermissions
}

export default permissionServices;