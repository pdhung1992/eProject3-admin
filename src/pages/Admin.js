import '../assets/css/admin.css'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {Button, Layout, Menu, Result} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes, useNavigate} from "react-router-dom";
import { faCity, faUtensils, faList, faWineGlassEmpty, faUserTag, faCircleCheck, faGear, faUser, faPizzaSlice, faLayerGroup, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import authServices from "../services/auth-service";
import {logout} from "../actions/authActions";
import CitiesManagement from "../components/CitiesManagement";
import AccountManagement from "../components/AccountManagement";


const Admin = () => {

    const adm = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const permissions = adm.admData.permissions

    const icons = {
        faCity,
        faUtensils,
        faList,
        faWineGlassEmpty,
        faUserTag,
        faCircleCheck,
        faGear,
        faUser,
        faPizzaSlice,
        faClipboardCheck,
        faLayerGroup
    };

    const menuItems = permissions.map((permission, index) => (
        {
            key: index,
            label: permission.name,
            link: `/${permission.prefix}`,
            icon: <FontAwesomeIcon className={'menu-icon'} icon={icons[permission.faIcon]}/>
        }
    ));
    console.log(permissions)
    const [collapsed, setCollapsed] = useState(false);

    const handleSignOut = async () => {
        try {
            await authServices.logOut();
            dispatch(logout());
            navigate('/login')
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }

    return(
        <div>
            <Layout>
                <Sider
                    trigger={null} collapsible collapsed={collapsed}
                    width={'18%'}
                >
                    <div className="logo-container">
                        <div className={'logo'}><span>Logo</span></div>
                    </div>
                    <Menu defaultSelectedKeys={['0']} items={menuItems}/>
                </Sider>
                <Layout>
                    <Header>
                        <div className="header-content">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                                className={'btn-header'}
                            />
                            <div>
                                <img src="/img/blank-avatar.png" alt="Avatar" className="header-avatar"/>
                                <span className={'user-info'}>Hello, {adm.admData.fullName}</span>
                                <button className={'btn btn-signout'} onClick={handleSignOut}>Sign Out</button>
                            </div>
                        </div>
                    </Header>
                    <Content>
                        <Routes>
                            <Route path={'cities'} element={<CitiesManagement/>}/>
                            <Route path={'accounts'} element={<AccountManagement/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default Admin;