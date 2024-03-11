
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from "./typeActions";

export const loginSuccess = (admData) => {
    return{
        type: LOGIN_SUCCESS,
        payload: {admData}
    };
}

export const loginFail = (message) => {
    return{
        type: LOGIN_FAIL,
        payload: message
    };
}

export const logout = () => {
    return{
        type: LOGOUT
    };
}