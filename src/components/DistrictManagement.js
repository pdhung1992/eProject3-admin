import {Button, Col, Input, Modal, Row, Select, Space, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import cityServices from "../services/city-service";
import Swal from "sweetalert2";
import districtServices from "../services/district-services";


const DistrictManagement = () => {

    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    const fetchDistrict = async () => {
        const districts = await districtServices.getAllDistricts();
        setDistricts(districts);
    }

    const fetchCities = async () => {
        const cities = await cityServices.getCities();
        setCities(cities)
    }

    useEffect(() => {
        fetchCities();
        fetchDistrict();
    }, [])

    const data = districts;


    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    //create
    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const [name, setName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeCity = (selectedId) => {
        setSelectedCity(selectedId);
    }



    const handleCreateDistrict= (e) => {
        e.preventDefault();

        const cityId = selectedCity;

        const formData = {
            name, cityId
        }
        console.log(formData)
        const fetchNewDist = async () => {
            try {
                const res = await districtServices.createDistrict(formData);
                if (res && res.name){
                    Swal.fire({
                        title: 'District created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    setOpenCreate(false);
                    setName('');
                    setSelectedCity('');
                    navigate('/districts');
                    fetchDistrict();
                }
            }catch (e) {
                console.log(e.message)
            }
        }
        fetchNewDist();

    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setName('');
        setSelectedCity('')
    };

    const [distDetails, setDistDetails] = useState({});

    const showDetailModal = async (id) => {
        const detail = await districtServices.getDistrictDetails(id);
        setDistDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await districtServices.getDistrictDetails(id);
        setDistDetails(detail);
        setSelectedCity(detail.cityId);
        setOpenEdit(true);
    };

    const onEdit = (e) => {
        const { name, value } = e.target;
        setDistDetails(prevDist => ({
            ...prevDist,
            [name]: value
        }));
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = distDetails.id;
        const name = distDetails.name;
        const cityId = selectedCity;

        const formData = {name, cityId}

        const fetchUpdateDistrict = async () => {
            try {
                const res = await districtServices.updateDistrict(id, formData);
                if(res && res.name){
                    setMessage(`District updated successfully!`);
                    Swal.fire({
                        title: 'District updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchDistrict();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateDistrict();
    };

    const handleEditCancel = () => {
        setOpenEdit(false);
    };

    const handleDelete = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `${name} will be removed from your districts list!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await districtServices.deleteDistrict(id);
                fetchDistrict();
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: `${name} removed from your districts list!`,
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting ${name} city:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting district!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: "15%",
        },
        {
            title: 'District Name',
            dataIndex: 'name',
            width: "35%",
        },
        {
            title: 'City Name',
            dataIndex: 'cityName',
            width: "35%",
        },
        {
            title: 'Actions',
            render: (_text, record) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    <Button onClick={() => showEditModal(record.id)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id, record.name)}>Delete</Button>
                </Space>
            ),
            width: "25%",
        }
    ];

    return (
        <div className={'admin-content'}>
            <h2>District Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter District name to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'center'}}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined/> Create new District
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
                title="Create new District"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleCreateCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={'btn btn-primary'} type={"submit"} onClick={handleCreateDistrict}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <Row>
                            <Col span={8}>District name</Col>
                            <Col span={16}>
                                <input placeholder='Enter District name...'
                                       className={'form-control'}
                                       name='name'
                                       value={name}
                                       onChange={onChangeName}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>City</Col>
                            <Col span={16}>
                                <Select
                                    name="cityId"
                                    value={selectedCity}
                                    size={"large"}
                                    style={{width: '100%'}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select City',
                                                key: 'select-city'
                                            },
                                            ...cities.map(city => (
                                                {
                                                    value: city.id,
                                                    label: city.name,
                                                    key: `role-${city.id}`
                                                }
                                            ))
                                        ]
                                    }
                                    onChange={(selectedId) => onChangeCity(selectedId)}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>

            <Modal
                open={openDetail}
                title="District Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleDetailCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={"btn btn-primary"} onClick={() => {
                            showEditModal(distDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Row>
                        <Col span={6}>District</Col>
                        <Col span={18}>{distDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>City</Col>
                        <Col span={18}>{distDetails.cityName}</Col>
                    </Row>
                </Space>
            </Modal>

            <Modal
                open={openEdit}
                title="Edit City"
                onCancel={handleEditCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleEditCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleEditSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <Row>
                            <Col span={8}>City name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter City name...'
                                       name='name'
                                       value={distDetails.name}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>City</Col>
                            <Col span={16}>
                                <Select
                                    defaultValue={distDetails.cityId}
                                    style={{width: "100%"}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select city',
                                                key: 'select-role'
                                            },
                                            ...cities.map(city => (
                                                {
                                                    value: city.id,
                                                    label: city.name,
                                                    key: `role-${city.id}`
                                                }
                                            ))
                                        ]
                                    }
                                    onChange={(selectedValue) => onChangeCity(selectedValue)}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default DistrictManagement;