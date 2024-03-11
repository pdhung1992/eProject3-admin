
import apiServices from "./api";

const createCity = async (name, thumbnail) => {

    try {
        const url = '/cities/create';
        const res = await apiServices.post(url, {name, thumbnail});
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
    createCity
}

export default cityServices;