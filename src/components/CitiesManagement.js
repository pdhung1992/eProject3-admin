import {Button, Col, Input, Modal, Row, Space, Table, Upload} from "antd";
import Swal from "sweetalert2";
import Search from "antd/es/input/Search";
import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import cityService from "../services/city-service";
import cityServices from "../services/city-service";
import {useNavigate} from "react-router-dom";


const CitiesManagement = () => {

    const navigate = useNavigate();

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

    const data = [
        {
            id: 1,
            name: 'Ha Noi',
            thumbnail: 'xxx'
        }
    ]

    //upload
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const [fileList, setFileList] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancelPreviewThumb = () => setPreviewOpen(false);
    const handlePreviewThumb = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

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

       console.log(formData)

       const fetchNewCity = async () => {
           try {
               const res = await cityServices.createCity(name, thumbnail);
               if (res && res.name){
                   Swal.fire({
                       title: 'Account created Successfully!',
                       icon: 'success',
                       confirmButtonText: 'OK',
                       confirmButtonColor: '#5ba515'
                   });
                   setOpenCreate(false);
                   navigate('/cities');
               }
           }catch (e) {
               console.log(e.message)
           }
       }
       fetchNewCity();

        // productService.createProduct(formData, axiosConfig)
        //     .then((response) => {
        //         setMessage("Success!");
        //         Swal.fire({
        //             title: 'Success',
        //             text: 'Add new Product successfully!',
        //             icon: 'success',
        //             confirmButtonText: 'Ok!',
        //             confirmButtonColor: '#5ba515'
        //         });
        //         navigate("/admin/viewproducts");
        //     })
        //     .catch((error) => {
        //         const resMessage =
        //             (error.response && error.response.data && error.response.data.message) ||
        //             error.message ||
        //             error.toString();
        //         setMessage(resMessage);
        //     });
    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setName('');
        setThumbnail([]);
    };

    const showDetailModal = async (id) => {
        // const detail = await accountServices.accDetails(id, axiosConfig);
        // setAccDetails(detail);
        // setOpenDetail(true);
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
    console.log(thumbnail)

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
                        <button key="back" className={'btn btn-primary'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleCreateCity}>
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


            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreviewThumb}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    )
}

export default CitiesManagement;