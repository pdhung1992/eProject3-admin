
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from "../actions/typeActions";

const initialState = {
    isLoggedIn : false,
    admData : null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case LOGIN_SUCCESS:
            return{
                ...state,
                isLoggedIn: true,
                admData: action.payload.admData
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                admData: null
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                admData: null
            }
        default:
            return state;
    }
}

export default authReducer;