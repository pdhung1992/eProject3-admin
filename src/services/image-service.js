import apiServices from "./api";

const getImage = async (fileName) => {
    try {
        const url = `/images/${fileName}`;
        const res =  await apiServices.get(url);
        return res.data;
    }catch (e) {
        return e.message;
    }
}

const deleteImage = async (fileName) => {
    try {

    }catch (e) {
        return e.message;
    }
}

const imageServices = {
    getImage, deleteImage
}

export default imageServices;