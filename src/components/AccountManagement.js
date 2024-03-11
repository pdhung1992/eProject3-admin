import {Button, Col, Dropdown, Input, Menu, Modal, Row, Select, Space, Table} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import button from "bootstrap/js/src/button";
import accountServices from "../services/account-service";
import roleServices from "../services/role-service";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";


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
        const accounts = await accountServices.getAllAcc();
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
        "postOfficeId": 0
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

    const handleCreateSubmit = (e) => {
        e.preventDefault();

        if (isPasswordMatch){
            const username = newAcc.username;
            const fullname = newAcc.fullname;
            const email = newAcc.email;
            const password = newAcc.password;
            const telephone = newAcc.telephone;
            const roleId = selectedRole;
            const formData = {fullname, username, email, telephone, password, roleId};

            console.log(formData);
            const fetchNewAcc = async () => {
                try {
                    const res = await accountServices.createAccount(formData);
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
                        navigate('/acc-management');
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
        // setName('');
        // setThumbnail([]);
    };

    const [accDetails, setAccDetails] = useState({});

    const showDetailModal = async (id) => {
        const detail = await accountServices.accDetails(id, axiosConfig);
        setAccDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        // setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        // const detail = await accountServices.accDetails(id, axiosConfig);
        // setAccDetails(detail);
        // setSelectedProvince(accDetails.provinceId);
        // setSelectedDistrict(accDetails.districtId);
        // setSelectedBranch(accDetails.postOfficeId);
        // setOpenEdit(true);
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
        const username = '';
        const password = '';
        const fullname = accDetails.fullname;
        const email = accDetails.email;
        const roleId = selectedRole !== '' ? selectedRole : accDetails.roleId;

        const formData = {fullname, email, roleId, username, password};
        const fetchUpdateAcc = async () => {
            try {
                const res = await accountServices.updateAcc(id, formData, axiosConfig);
                if(res && res.fullname){
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
        // try {
        //     const result = await Swal.fire({
        //         title: 'Are you sure?',
        //         text: 'Account will be removed from your account list!',
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#5ba515',
        //         cancelButtonColor: '#ee0033',
        //         confirmButtonText: 'Yes, delete it!',
        //     });
        //
        //     if (result.isConfirmed) {
        //         await accountServices.deleteAccount(id, axiosConfig);
        //         setAccounts(accounts.filter((deletedAcc) => deletedAcc.id !== id));
        //         await Swal.fire({
        //             title: 'Delete Successfully!',
        //             text: 'Account removed from your account list!',
        //             icon: 'success',
        //             confirmButtonColor: '#5ba515',
        //         });
        //     }
        // } catch (error) {
        //     console.error(`Error deleting account with ID ${id}:`, error);
        //     Swal.fire({
        //         title: 'Delete error!',
        //         text: 'An error occurred while deleting account!',
        //         icon: 'error',
        //         confirmButtonColor: '#ee0033',
        //     });
        // }
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
                title="Create new City"
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
                <form>
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
                                <input placeholder='Enter Userame...'
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
                                <input placeholder='Enter Userame...'
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
                                    ...roles.map(role => (
                                        {
                                            value: role.id,
                                            label: role.name,
                                            key: `role-${role.id}`
                                        }
                                    ))
                                ]
                            }
                                onChange={(selectedValue) => handleRoleChange(selectedValue)}
                                />
                            </Col>
                        </Row>
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
                    <Row>
                        <Col span={6}>Branch</Col>
                        <Col span={18}>{accDetails.postOffice}</Col>
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
                            <Col span={8}>Role</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Select
                                        defaultValue={accDetails.roleId}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select role',
                                                    key: 'select-role'
                                                },
                                                ...roles.map(role => (
                                                    {
                                                        value: role.id,
                                                        label: role.name,
                                                        key: `role-${role.id}`
                                                    }
                                                ))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleRoleChange(selectedValue)}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountManagement;