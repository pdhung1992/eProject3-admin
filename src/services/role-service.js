

import apiServices from "./api";

const getRoles = async () => {
    try {
        const url = 'roles';
        const res = await apiServices.get(url);
        return res.data;
    }catch (e) {
        console.log(e.message)
    }
}

const roleServices = {
    getRoles,

}

export default roleServices;