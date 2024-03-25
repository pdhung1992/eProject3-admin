import apiServices from "./api";

const getFoodTags = async () => {
    try {
        const url = `/ftags`;
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

const foodTagServices = {
    getFoodTags
}

export default foodTagServices;