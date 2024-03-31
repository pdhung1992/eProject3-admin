import apiServices from "./api";

const getReportByMonth = async (month, year, axiosConfig) => {
    try {
        const url = `/reports/month?month=${month}&year=${year}`;
        const res = await apiServices.get(url, axiosConfig);
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

const reportServices = {
    getReportByMonth
}

export default reportServices;