

import apiServices from "./api";

const getAllAcc = async () => {
    try {
        const url = 'accounts';
        const res = await apiServices.get(url);
        return res.data;
    }catch (e){
        console.log(e.message);
    }
}

const createAccount = async (formData) => {
    try {
        const url = 'accounts/create';
        const res = await apiServices.post(url, formData);
        return res.data;
    }catch (e){
        console.log(e.message);
    }
}

const accountServices = {
    getAllAcc, createAccount
}

export default accountServices;