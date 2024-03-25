import apiServices from "./api";

const getFoodTypes = async () => {
    try {
        const url = `/types`;
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

const foodTypeServices = {
    getFoodTypes
}

export default foodTypeServices;