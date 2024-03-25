import '../assets/css/admin.css'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {Button, Layout, Menu, Result} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import { faCity, faUtensils, faList, faWineGlassEmpty, faUserTag, faCircleCheck, faGear, faUser, faPizzaSlice, faLayerGroup, faClipboardCheck, faStreetView, faShop, faTags, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import authServices from "../services/auth-service";
import {logout} from "../actions/authActions";
import CitiesManagement from "../components/CitiesManagement";
import AccountManagement from "../components/AccountManagement";
import RoleManagement from "../components/RoleManagement";
import PermissionManagement from "../components/PermissionManagement";
import DistrictManagement from "../components/DistrictManagement";
import CategoryManagement from "../components/CategoryManagement";
import AccountSetting from "../components/AccountSetting";
import RestaurantSetting from "../components/RestaurantSetting";
import FoodTypeManagement from "../components/FoodTypeManagement";
import FoodTagManagement from "../components/FoodTagManagement";
import FoodManagement from "../components/FoodManagement";
import TableTypeManagement from "../components/TableTypeManagement";
import ComboManagement from "../components/ComboManagement";
import CreateCombo from "../components/CreateCombo";


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
        faLayerGroup,
        faStreetView,
        faShop,
        faTags,
        faPeopleGroup
    };

    const menuItems = permissions.map((permission, index) => (
        {
            key: index,
            label: permission.name,
            link: `/${permission.prefix}`,
            icon: <FontAwesomeIcon className={'menu-icon'} icon={icons[permission.faIcon]}/>
        }
    ));
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
                    <Menu defaultSelectedKeys={['0']} mode={'inline'}>
                        {menuItems.map((item, index) => (
                            <Menu.Item key={index} title={collapsed ? item.label : null}>
                                {collapsed ?
                                    <Link to={item.link}>{item.icon}</Link>
                                    :
                                    <Link to={item.link}>{item.icon}{item.label}</Link>}
                            </Menu.Item>
                        ))}
                    </Menu>
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
                            <Route path={'roles'} element={<RoleManagement/>}/>
                            <Route path={'permissions'} element={<PermissionManagement/>}/>
                            <Route path={'districts'} element={<DistrictManagement/>}/>
                            <Route path={'categories'} element={<CategoryManagement/>}/>
                            <Route path={'settings'} element={<AccountSetting/>}/>
                            <Route path={'restaurant'} element={<RestaurantSetting/>}/>
                            <Route path={'types'} element={<FoodTypeManagement/>}/>
                            <Route path={'ftags'} element={<FoodTagManagement/>}/>
                            <Route path={'foods'} element={<FoodManagement/>}/>
                            <Route path={'servetypes'} element={<TableTypeManagement/>}/>
                            <Route path={'combos'} element={<ComboManagement/>}/>
                            <Route path={'combos/create'} element={<CreateCombo/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default Admin;