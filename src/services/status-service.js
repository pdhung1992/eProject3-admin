import apiServices from "./api";

const getStatus = async () => {
    try {
        const url = `/status`;
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

const statusServices = {
    getStatus
}

export default statusServices;