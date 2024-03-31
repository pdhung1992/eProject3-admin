import {Button, Col, Input, Modal, Row, Space, Table, Upload} from "antd";
import Swal from "sweetalert2";
import Search from "antd/es/input/Search";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import cityService from "../services/city-service";
import cityServices from "../services/city-service";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


const CitiesManagement = () => {

    const admin = useSelector(state => state.auth);

    const token = admin.admData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const navigate = useNavigate();
    const imgUrl = 'http://localhost:8888/api/images/';

    const [message, setMessage] = useState("");

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: "15%",
        },
        {
            title: 'City Name',
            dataIndex: 'name',
            width: "35%",
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            width: "25%",
            render: (thumbnail) => (
                <img src={imgUrl+thumbnail} alt={'Thumbnail'} width={'100px'} className={'img-fluid'}/>
            )
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

    const [cities, setCities] = useState([]);

    const fetchCities = async () => {
        const cities = await cityServices.getCities();
        setCities(cities)
    }

    useEffect(() => {
        fetchCities();
    }, [])

    const data = cities;


    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    //create
    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const [name, setName] = useState('');
    const [thumbnail, setThumbnail] = useState([]);

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeThumbnail = (e) => {
        const files = Array.from(e.target.files);

        const thumbnailFiles = files.filter(file => file.type.startsWith('image'));

        setThumbnail(thumbnailFiles);
    };


    const handleCreateCity = (e) => {
        e.preventDefault();

       const formData = new FormData();
       formData.append('name', name);
       if(thumbnail && thumbnail.length > 0){
           formData.append('thumbnail', thumbnail[0])
       }

       const fetchNewCity = async () => {
           try {
               const res = await cityServices.createCity(formData, axiosConfig);
               if (res && res.name){
                   Swal.fire({
                       title: 'City created Successfully!',
                       icon: 'success',
                       confirmButtonText: 'OK',
                       confirmButtonColor: '#5ba515'
                   });
                   setOpenCreate(false);
                   navigate('/cities');
                   fetchCities();
               }
           }catch (e) {
               console.log(e.message)
           }
       }
       fetchNewCity();

    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setName('');
        setThumbnail([]);
        const inputImg = document.getElementById('imgInput');
        if (inputImg) {
            inputImg.value = '';
        }
    };

    const [cityDetails, setCityDetails] = useState({});

    const showDetailModal = async (id) => {
        const detail = await cityServices.getCityDetails(id);
        setCityDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await cityServices.getCityDetails(id);
        setCityDetails(detail);
        setOpenEdit(true);
    };

    const onEdit = (e) => {
        const { name, value } = e.target;
        setCityDetails(prevCity => ({
            ...prevCity,
            [name]: value
        }));
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = cityDetails.id

        const formData = new FormData();
        formData.append('name', cityDetails.name);
        if(thumbnail && thumbnail.length > 0){
            formData.append('thumbnail', thumbnail[0])
        }
        const fetchUpdateCity = async () => {
            try {
                const res = await cityServices.updateCity(id, formData, axiosConfig);
                if(res && res.name){
                    setMessage(`City updated successfully!`);
                    Swal.fire({
                        title: 'City updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchCities();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateCity();
    };

    const handleEditCancel = () => {
        setOpenEdit(false);
        setThumbnail([]);
        const inputImg = document.getElementById('imgInput');
        if (inputImg) {
            inputImg.value = '';
        }
    };

    const handleDelete = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `${name} will be removed from your cities list!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await cityServices.deleteCity(id, axiosConfig);
                fetchCities();
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: `${name} removed from your cities list!`,
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting ${name} city:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting city!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    return(
        <div className={'admin-content'}>
            <h2>Cities Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter City name to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'end' }}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined /> Create new City
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
                        <button key="back" className={'btn btn-cancel'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn btn-primary'} type={"submit"} onClick={handleCreateCity}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form encType='multipart/form-data'>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>City name</Col>
                            <Col span={16}>
                                <input placeholder='Enter City name...'
                                       className={'form-control'}
                                       name='name'
                                       value={name}
                                       onChange={onChangeName}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Thumbnail</Col>
                            <Col span={16}>
                                <input
                                    type="file"
                                    id={'imgInput'}
                                    className="form-control"
                                    placeholder="images"
                                    aria-label="images"
                                    name="thumbnail"
                                    onChange={onChangeThumbnail}
                                />
                                <div className="preview-images text-center">
                                    {thumbnail && thumbnail.map((image, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className="preview-image"
                                            width="50%"
                                            style={{margin: '15px', border: 'solid 1px #5ba515', borderRadius: '5%'}}
                                        />
                                    ))}
                                </div>
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
                        <button key="back" className={'btn btn-cancel'} onClick={handleDetailCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={"btn btn-primary"} onClick={() => {
                            showEditModal(cityDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>City</Col>
                        <Col span={18}>{cityDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Thumbnail</Col>
                        <Col span={18}><img src={`${imgUrl}${cityDetails.thumbnail}`} alt="" className={'img-fluid'}/></Col>
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
                            <Col span={8}>City name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter City name...'
                                       name='name'
                                       value={cityDetails.name}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Thumbnail</Col>
                            <Col span={16}>
                                <input
                                    type="file"
                                    id={'imgInput'}
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
                                        <img
                                            src={imgUrl + cityDetails.thumbnail}
                                            alt={`Preview thumbnail`}
                                            className="preview-image"
                                            width="50%"
                                            style={{margin: '15px', border: 'solid 1px #5ba515', borderRadius: '5%'}}
                                        />
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default CitiesManagement;