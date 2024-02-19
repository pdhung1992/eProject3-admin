import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import storageSession from "redux-persist/lib/storage/session";
import {persistReducer, persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";
import {combineReducers, createStore} from "redux";
import authReducer from "./reducers/authReducer";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

const persistConfig = {
    key: 'root',
    storage: storageSession
}

const rootReducer = combineReducers({
    auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
);

const persistor = persistStore(store);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading = {null} persistor = {persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
