import apiServices from "./api";


const getTableTypes = async () => {
    try {
        const url = `/servetypes`;
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

const tableTypeServices = {
    getTableTypes
}

export default tableTypeServices;