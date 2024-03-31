import {Button, Col, Dropdown, Input, Menu, Modal, Row, Select, Space, Table, TimePicker} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import button from "bootstrap/js/src/button";
import accountServices from "../services/account-service";
import roleServices from "../services/role-service";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import TextArea from "antd/es/input/TextArea";
import categoryServices from "../services/category-service";
import cityServices from "../services/city-service";
import districtServices from "../services/district-services";


const AccountManagement = () => {

    const navigate = useNavigate();

    const adm = useSelector(state => state.auth)
    const token = adm.admData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: "5%",
        },
        {
            title: 'Username',
            dataIndex: 'username',
            width: "15%",
        },
        {
            title: 'Full name',
            dataIndex: 'fullname',
            width: "20%",
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: "20%",
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: "15%",
        },
        {
            title: 'Actions',
            render: (_text, record) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    <Button onClick={() => showEditModal(record.id)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
            width: "25%",
        }
    ];



    const [accounts, setAccounts] = useState([]);

    const fetchAccount = async () => {
        const accounts = await accountServices.getAllAcc(axiosConfig);
        setAccounts(accounts);
    }

    const fetchRole = async () => {
        const roles = await roleServices.getRoles();
        setRoles(roles);
    }

    useEffect(() => {
        fetchAccount();
    }, []);

    const data = accounts;



    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const initAcc = {
        "fullname": '',
        "username": '',
        "email": '',
        "telephone": '',
        "password": '',
        "passwordCfm": '',
        "roleId": 0,
    };
    const [newAcc, setNewAcc] = useState(initAcc);

    const onChangeNewAcc = (e) => {
        const {name, value} = e.target;
        setNewAcc(prevAcc => ({
            ...prevAcc, [name]: value
        }));
    }

    const isPasswordMatch = newAcc.password === newAcc.passwordCfm;

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            const roles = await roleServices.getRoles();
            setRoles(roles);
        };
        fetchRole();
    }, [])


    const handleRoleChange = (selectedId) => {
        setSelectedRole(selectedId);
    }

    const [categories, setCategories] = useState([])
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [thumbnail, setThumbnail] = useState([]);
    const [banner, setBanner] = useState([]);

    const initRes = {
        "name": '',
        "address": '',
        "description": '',
        "minimumDelivery": 50,
        "prepaidRate": 0
    };
    const [newRes, setNewRes] = useState(initRes);

    const onChangeNewRes = (e) => {
        const {name, value} = e.target;
        setNewRes(prevRes => ({
            ...prevRes, [name]: value
        }));
    }

    const handleCatChange = (selectedId) => {
        setSelectedCategory(selectedId);
    }



    useEffect(() => {
        const fetchCategories = async () => {
            const res = await categoryServices.getAllCategories();
            setCategories(res);
        }
        const fetchCities = async () => {
            const res = await cityServices.getCities();
            setCities(res)
        }

        fetchCategories();
        fetchCities();
    }, [])


    const handleCityChange = async (selectedId) => {
        setSelectedCity(selectedId);
        setSelectedDistrict('');
        const data = await districtServices.getDistrictByCity(selectedId);
        setDistricts(data);
    }


    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity) {
                setDistricts([]);
                const data = await districtServices.getDistrictByCity(selectedCity);
                setDistricts(data);
            }
        };
        fetchDistricts();
    }, [selectedCity]);


    const handleDistChange = async (selectedId) => {
        setSelectedDistrict(selectedId);
    };

    const [dlvHours, setDlvHours] = useState('');
    const onChangeDlvTime = (time, timeString) => {
        const hours = timeString[0] + ' - ' + timeString[1];
        setDlvHours(hours);
    };

    const onChangeThumbnail = (e) => {
        const files = Array.from(e.target.files);

        const thumbnailFiles = files.filter(file => file.type.startsWith('image'));

        setThumbnail(thumbnailFiles);
    };

    const onChangeBanner = (e) => {
        const files = Array.from(e.target.files);

        const bannerFiles = files.filter(file => file.type.startsWith('image'));

        setBanner(bannerFiles);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();

        if (isPasswordMatch){

            const formData = new FormData();
            formData.append('userName', newAcc.username);
            formData.append('fullname', newAcc.fullname);
            formData.append('email', newAcc.email);
            formData.append('password', newAcc.password);
            formData.append('telephone', newAcc.telephone);
            formData.append('roleId', selectedRole);
            formData.append('resName', newRes.name);
            formData.append('resAddress', newRes.address);
            formData.append('resDescription', newRes.description);
            formData.append('resDeliveryHours', dlvHours);
            formData.append('resMinimumDelivery', newRes.minimumDelivery);
            formData.append('prepaidRate', newRes.prepaidRate);
            formData.append('resCatId', selectedCategory);
            formData.append('resDistrictId', selectedDistrict);
            if(thumbnail && thumbnail.length > 0){
                formData.append('resThumbnail', thumbnail[0])
            }
            if(banner && banner.length > 0){
                formData.append('resBanner', banner[0])
            }

            const fetchNewAcc = async () => {
                try {
                    const res = await accountServices.createAccount(formData, axiosConfig);
                    console.log(res)
                    if(res && res.username){
                        setMessage("Account created successfully!");
                        Swal.fire({
                            title: 'Account created Successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#5ba515'
                        });
                        setOpenCreate(false);
                        fetchAccount();
                        setNewAcc(initAcc);
                        setSelectedRole('');
                        navigate('/accounts');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchNewAcc();
        }
        else {
            setMessage("Password do not match!")
        }
    }
    const handleCreateCancel = () => {
        setOpenCreate(false);
        setNewAcc(initAcc);
    };

    const [accDetails, setAccDetails] = useState({});


    const showDetailModal = async (id) => {
        const detail = await accountServices.getAccDetails(id, axiosConfig);
        setAccDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await accountServices.getAccDetails(id, axiosConfig);
        setAccDetails(detail);
        setSelectedRole(detail.roleId)
        setOpenEdit(true);
    };


    const onChangeEdit = (e) => {
        const {name, value} = e.target;
        setAccDetails(prevAdd => ({
            ...prevAdd, [name] : value
        }));
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = accDetails.id;
        const fullname = accDetails.fullname;
        const email = accDetails.email;
        const telephone = accDetails.telephone;
        const roleId = selectedRole !== '' ? selectedRole : accDetails.roleId;

        const formData = {fullname, email, roleId, telephone};

        const fetchUpdateAcc = async () => {
            try {
                const res = await accountServices.updateAccount(id, formData, axiosConfig);
                console.log(res)
                if(res && res.fullName){
                    setMessage("Account updated successfully!");
                    Swal.fire({
                        title: 'Account updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchAccount();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateAcc();
    };

    const handleEditCancel = () => {
        setOpenEdit(false);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Account will be removed from your accounts list!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await accountServices.deleteAccount(id, axiosConfig);
                fetchAccount();
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: 'Account removed from your account list!',
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting account with ID ${id}:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting account!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    return(
        <div className={'admin-content'}>
            <h2>Account Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter Username of Full name to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined/> Create new Account
                    </button>
                </Col>
            </Row>
            <hr/>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record, index) => index}
                pagination={{
                    pageSize: 15,
                }}
                scroll={{
                    y: 600,
                }}
            />

            <Modal
                open={openCreate}
                title="Create new Account"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleCreateSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form encType='multipart/form-data'>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Username</Col>
                            <Col span={16}>
                                <input placeholder='Enter Username...'
                                       className={'form-control'}
                                       name='username'
                                       value={newAcc.username}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Full name</Col>
                            <Col span={16}>
                                <input placeholder='Enter Full name...'
                                       className={'form-control'}
                                       name='fullname'
                                       value={newAcc.fullname}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Email</Col>
                            <Col span={16}>
                                <input placeholder='Enter Email...'
                                       type={'email'}
                                       className={'form-control'}
                                       name='email'
                                       value={newAcc.email}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Telephone</Col>
                            <Col span={16}>
                                <input placeholder='Enter Telephone number...'
                                       className={'form-control'}
                                       name='telephone'
                                       value={newAcc.telephone}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Password</Col>
                            <Col span={16}>
                                <input placeholder='Enter Password...'
                                       className={'form-control'}
                                       type={'password'}
                                       name='password'
                                       value={newAcc.password}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Confirm password</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <input placeholder='Re-enter Password...'
                                           className={'form-control'}
                                           type='password'
                                           name='passwordCfm'
                                           onChange={onChangeNewAcc}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Role</Col>
                            <Col span={16}>
                                <Select
                                size={"large"}
                                value={selectedRole}
                                style={{width: "100%"}}
                                options={
                                [
                                    {
                                        value: '',
                                        label: 'Select role',
                                        key: 'select-role'
                                    },
                                    ...(Array.isArray(roles) ? roles.map(role => (
                                        {
                                            value: role.id,
                                            label: role.name,
                                            key: `role-${role.id}`
                                        }
                                    )) : [])
                                ]
                            }
                                onChange={(selectedValue) => handleRoleChange(selectedValue)}
                                />
                            </Col>
                        </Row>
                        {selectedRole === 2 ? (
                            <Space direction={"vertical"}>
                                <Row>
                                    <Col span={8}>Restaurant name</Col>
                                    <Col span={16}>
                                        <Input placeholder='Enter Restaurant name...'
                                               name='name'
                                               value={newRes.name}
                                               onChange={onChangeNewRes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Category</Col>
                                    <Col span={16}>
                                        <Select
                                            defaultValue={selectedCategory}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select Category',
                                                        key: 'select-cat'
                                                    },
                                                    ...(Array.isArray(categories) ? (categories.map(cat => (
                                                        {
                                                            value: cat.id,
                                                            label: cat.name,
                                                            key: `cat-${cat.id}`
                                                        }
                                                    ))) : [])
                                                ]
                                            }
                                            onChange={(selectedValue) => handleCatChange(selectedValue)}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <Row>
                                            <Col span={12}>Address</Col>
                                            <Col span={12}>City</Col>
                                        </Row>
                                    </Col>
                                    <Col span={16}>
                                        <Select
                                            defaultValue={selectedCity}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select city',
                                                        key: 'select-city'
                                                    },
                                                    ...(Array.isArray(cities) ? (cities.map(city => (
                                                        {
                                                            value: city.id,
                                                            label: city.name,
                                                            key: `city-${city.id}`
                                                        }
                                                    ))) : [])
                                                ]
                                            }
                                            onChange={(selectedValue) => handleCityChange(selectedValue)}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Row className={'py-2'}>
                                            <Col span={12}></Col>
                                            <Col span={12} >District</Col>
                                        </Row>
                                    </Col>
                                    <Col className={'py-2'} span={16}>
                                        <Select
                                            defaultValue={selectedDistrict}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select District',
                                                        key: 'select-dist'
                                                    },
                                                    ...(Array.isArray(districts) ? (districts.map(dist => (
                                                        {
                                                            value: dist.id,
                                                            label: dist.name,
                                                            key: `dist-${dist.id}`
                                                        }
                                                    ))) : [])
                                                ]
                                            }
                                            onChange={(selectedValue) => handleDistChange(selectedValue)}
                                        />
                                    </Col>
                                    <Col span={8} className={'py-2'}>
                                        <Row>
                                            <Col span={12}></Col>
                                            <Col span={12}>Address</Col>
                                        </Row>
                                    </Col>
                                    <Col span={16} className={'py-2'}>
                                        <Input placeholder='Enter Address...'
                                               name='address'
                                               rows={3}
                                               value={newRes.address}
                                               onChange={onChangeNewRes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Description</Col>
                                    <Col span={16}>
                                        <TextArea placeholder='Enter Description...'
                                                  rows={3}
                                                  name='description'
                                                  value={newRes.description}
                                                  onChange={onChangeNewRes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Delivery Hours</Col>
                                    <Col span={16}>
                                        <TimePicker.RangePicker use12Hours format="h A" onChange={onChangeDlvTime}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Minimum Delivery</Col>
                                    <Col span={16}>
                                        <Input placeholder='Enter Minimum delivery...'
                                               name='minimumDelivery'
                                               value={newRes.minimumDelivery}
                                               onChange={onChangeNewRes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Prepaid Rate</Col>
                                    <Col span={16}>
                                        <Input placeholder='Enter Prepaid rate...'
                                               name='prepaidRate'
                                               value={newRes.prepaidRate}
                                               onChange={onChangeNewRes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Thumbnail</Col>
                                    <Col span={16}>
                                        <input
                                            type="file"
                                            id={'thumbInput'}
                                            className="form-control"
                                            placeholder="images"
                                            aria-label="images"
                                            name="thumbnail"
                                            onChange={onChangeThumbnail}
                                        />
                                        <div className="preview-images text-center">
                                            {thumbnail.length !== 0 ? (
                                                thumbnail.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index}`}
                                                        className="preview-image"
                                                        width="50%"
                                                        style={{
                                                            margin: '15px',
                                                            border: 'solid 1px #5ba515',
                                                            borderRadius: '5%'
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>Banner</Col>
                                    <Col span={16}>
                                        <input
                                            type="file"
                                            id={'bannerInput'}
                                            className="form-control"
                                            placeholder="images"
                                            aria-label="images"
                                            name="banner"
                                            onChange={onChangeBanner}
                                        />
                                        <div className="preview-images text-center">
                                            {banner.length !== 0 ? (
                                                banner.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index}`}
                                                        className="preview-image"
                                                        width="50%"
                                                        style={{
                                                            margin: '15px',
                                                            border: 'solid 1px #5ba515',
                                                            borderRadius: '5%'
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Space>
                        ) : (
                            <></>
                        )}
                    </Space>
                </form>
            </Modal>
            <Modal
                open={openDetail}
                title="Account Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleDetailCancel}>
                            Cancel
                        </button>,
                        <button className={"btn btn-warning"} onClick={() => {
                            showEditModal(accDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>Username</Col>
                        <Col span={18}>{accDetails.username}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Full name</Col>
                        <Col span={18}>{accDetails.fullname}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Email</Col>
                        <Col span={18}>{accDetails.email}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Role</Col>
                        <Col span={18}>{accDetails.role}</Col>
                    </Row>
                </Space>
            </Modal>
            <Modal
                open={openEdit}
                title="Edit Account"
                onCancel={handleEditCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleEditCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleEditSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Username</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Username...'
                                       name='username'
                                       value={accDetails.username}
                                       disabled
                                       style={{color: "#000000"}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Full name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Full name...'
                                       name='fullname'
                                       value={accDetails.fullname}
                                       onChange={onChangeEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Email</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter Email...'
                                           type="email"
                                           name='email'
                                           value={accDetails.email}
                                           onChange={onChangeEdit}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Email</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter Telephone...'
                                           type="text"
                                           name='telephone'
                                           value={accDetails.telephone}
                                           onChange={onChangeEdit}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col span={8}>Role</Col>*/}
                        {/*    <Col span={16}>*/}
                        {/*        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>*/}
                        {/*            <Select*/}
                        {/*                defaultValue={selectedRole}*/}
                        {/*                style={{width: "100%"}}*/}
                        {/*                disabled*/}
                        {/*                options={*/}
                        {/*                    [*/}
                        {/*                        {*/}
                        {/*                            value: '',*/}
                        {/*                            label: 'Select role',*/}
                        {/*                            key: 'select-role'*/}
                        {/*                        },*/}
                        {/*                        ...(Array.isArray(roles) ? roles.map(role => (*/}
                        {/*                            {*/}
                        {/*                                value: role.id,*/}
                        {/*                                label: role.name,*/}
                        {/*                                key: `role-${role.id}`*/}
                        {/*                            }*/}
                        {/*                        )) : [])*/}
                        {/*                    ]*/}
                        {/*                }*/}
                        {/*                onChange={(selectedValue) => handleRoleChange(selectedValue)}*/}
                        {/*            />*/}
                        {/*        </Space>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountManagement;