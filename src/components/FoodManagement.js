import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Input, Modal, Row, Select, Space, Table, Tag} from "antd";
import foodTagServices from "../services/foodtag-service";
import {PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import foodTypeServices from "../services/foodtype-service";
import Swal from "sweetalert2";
import foodServices from "../services/food-service";
import tableTypeServices from "../services/tabletype-service";


const FoodManagement = () => {

    const admin = useSelector(state => state.auth);
    const navigate = useNavigate();
    const imgUrl = 'http://localhost:8888/api/images/';

    const tagColors = {
        New: 'green',
        Favorite: 'blue',
        Signature: 'purple',
    }


    const token = admin.admData.token;
    const resId = admin.admData.resId;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");


    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            width: "10%",
            render: (thumbnail) => (
                <img src={`${imgUrl}${thumbnail}`} className={'img-fluid'} alt=""/>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: "20%",
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: "10%",
            render: (price) => (
                <span>$ {price}</span>
            )
        },
        {
            title: 'Serve',
            dataIndex: 'serve',
            width: "10%",
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: "10%",
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            width: "10%",
            render: (tag) => (
                <Tag color={tagColors[tag]}>{tag}</Tag>
            )
        },
        {
            title: 'Actions',
            render: (_text, record) => (
                <Space style={{justifyContent: 'center'}}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    <Button onClick={() => showEditModal(record.id)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id, record.name)}>Delete</Button>
                </Space>
            ),
            width: "25%",
        }
    ];

    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState(foods);

    const fetchFoods = async (id) => {
        const foods = await foodServices.getFoodByRestaurant(id);
        setFoods(foods);
    }

    const [tags, setTags] = useState([]);
    const [types, setTypes] = useState([]);
    const [serveTypes, setServeTypes] = useState([]);
    const fetchTags = async () => {
        const tags = await foodTagServices.getFoodTags();
        setTags(tags)
    }
    const fetchTypes = async () => {
        const types = await foodTypeServices.getFoodTypes();
        setTypes(types)
    }
    const fetchServeTypes = async () => {
        const types = await tableTypeServices.getTableTypes();
        setServeTypes(types)
    }

    useEffect(() => {
        fetchFoods(resId);
        fetchTags();
        fetchTypes();
        fetchServeTypes();
    }, [])

    useEffect(() => {
        setFilteredFoods(foods)
    }, [foods]);

    const onSearchFood = (e) => {
        const keyword = e.target.value.trim().toLowerCase().replace(/\s/g, '');
        const filtered = foods.filter(food => food.name && food.name.trim().toLowerCase().includes(keyword));
        setFilteredFoods(filtered);
    }


    const onFilterByServe = (id) => {
        const filtered = foods.filter(food => food.serveID === id);
        setFilteredFoods(filtered);
        setSelectedServeType(id)
        setSelectedType('');
        setSelectedTag('')
    };

    const onFilterByType = (id) => {
        const filtered = foods.filter(food => food.typeId === id);
        setFilteredFoods(filtered);
        setSelectedType(id);
        setSelectedServeType('');
        setSelectedTag('')
    };

    const onFilterByTag = (id) => {
        const filtered = foods.filter(food => food.foodTagId === id);
        setFilteredFoods(filtered);
        setSelectedTag(id);
        setSelectedServeType('');
        setSelectedType('')
    };


    const data = filteredFoods;

    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const initFood = {
        'name': '',
        'description': '',
        'price': '',
        'serve' : ''
    }

    const [newFood, setNewFood] = useState(initFood);
    const [selectedServeType, setSelectedServeType] = useState('');
    const [thumbnail, setThumbnail] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const onChangeFood = (e) => {
        const {name, value} = e.target;
        setNewFood(prevFood => ({
            ...prevFood,
                [name]: value
        }));
    }

    const onChangeServeType = (value) => {
        setSelectedServeType(value);
    }


    const onChangeType = (selectedId) => {
        setSelectedType(selectedId);
    }

    const onChangeTag = (selectedId) => {
        setSelectedTag(selectedId);
    }

    const onChangeThumbnail = (e) => {
        const files = Array.from(e.target.files);

        const thumbnailFiles = files.filter(file => file.type.startsWith('image'));

        setThumbnail(thumbnailFiles);
    };


    const handleCreateFood = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newFood.name);
        formData.append('description', newFood.description);
        formData.append('price', newFood.price);
        formData.append('serveId', selectedServeType);
        formData.append('typeId', selectedType);
        formData.append('foodTagId', selectedTag);
        if(thumbnail && thumbnail.length > 0){
            formData.append('thumbnail', thumbnail[0])
        }

        const fetchNewFood = async () => {
            try {
                const res = await foodServices.createFood(formData, axiosConfig);
                if (res && res.name){
                    Swal.fire({
                        title: 'Food created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    setOpenCreate(false);
                    fetchFoods(resId);
                    navigate('/foods');
                }
            }catch (e) {
                console.log(e.message)
            }
        }
        fetchNewFood();
    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setNewFood(initFood);
        setThumbnail([]);
        setSelectedServeType('');
        setSelectedTag('');
        setSelectedType('')
        const inputImg = document.getElementById('imgInput');
        if (inputImg) {
            inputImg.value = '';
        }
    };

    const [foodDetails, setFoodDetails] = useState({});

    const showDetailModal = async (id) => {
        const detail = await foodServices.getFoodDetails(id);
        setFoodDetails(detail);
        setOpenDetail(true);
    };

    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await foodServices.getFoodDetails(id);
        setFoodDetails(detail);
        setSelectedServeType(detail.serve)
        setSelectedTag(detail.foodTagId)
        setSelectedType(detail.typeId)
        setOpenEdit(true);
    };

    const onEdit = (e) => {
        const { name, value } = e.target;
        setFoodDetails(prevFood => ({
            ...prevFood,
            [name]: value
        }));
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = foodDetails.id

        const formData = new FormData();
        formData.append('name', foodDetails.name);
        formData.append('description', foodDetails.description);
        formData.append('price', foodDetails.price);
        formData.append('serveId', selectedServeType);
        formData.append('typeId', selectedType);
        formData.append('foodTagId', selectedTag);
        if(thumbnail && thumbnail.length > 0){
            formData.append('thumbnail', thumbnail[0])
        }

        const fetchUpdateFood = async () => {
            try {
                const res = await foodServices.updateFood(id, formData, axiosConfig);
                if(res && res.name){
                    setMessage(`Food updated successfully!`);
                    Swal.fire({
                        title: 'Food updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchFoods(resId);
                    setOpenEdit(false);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateFood()
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
                text: `${name} will be removed from your foods list!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await foodServices.deleteFood(id, axiosConfig);
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: `${name} removed from your foods list!`,
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
                fetchFoods(resId);
            }
        } catch (error) {
            console.error(`Error deleting ${name} food:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting food!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    return (
        <div className={'admin-content'}>
            <h2>Food Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col span={6}>
                    <Input
                        size={"large"}
                        placeholder="Enter Food name to find..."
                        allowClear
                        onChange={onSearchFood}
                    />
                </Col>
                <Col span={12} className={'d-flex justify-content-around align-items-center'}>
                    <h6 style={{width: '100%'}} className={'text-center'}>Filter by: </h6>
                    <Select size={"large"}
                            value={selectedServeType}
                            style={{width: '100%'}}
                            className={'px-1'}
                            options={
                                [
                                    {
                                        value: '',
                                        label: 'Select Type of table',
                                        key: 'select-type'
                                    },
                                    ...(Array.isArray(serveTypes) ? serveTypes.map(type => (
                                        {
                                            value: type.id,
                                            label: type.name,
                                            key: `type-${type.id}`
                                        }
                                    )) : [])
                                ]
                            }
                            onChange={(selectedValue) => onFilterByServe(selectedValue)}
                    />
                    <Select size={"large"}
                            value={selectedType}
                            style={{width: '100%'}}
                            className={'px-1'}
                            options={
                                [
                                    {
                                        value: '',
                                        label: 'Select Type',
                                        key: 'select-type'
                                    },
                                    ...(Array.isArray(types) ? types.map(type => (
                                        {
                                            value: type.id,
                                            label: type.name,
                                            key: `type-${type.id}`
                                        }
                                    )) : [])
                                ]
                            }
                            onChange={(selectedId) => onFilterByType(selectedId)}
                    />
                    <Select size={"large"}
                            value={selectedTag}
                            style={{width: '100%'}}
                            className={'px-1'}
                            options={
                                [
                                    {
                                        value: '',
                                        label: 'Select Tag',
                                        key: 'select-tag'
                                    },
                                    ...(Array.isArray(tags) ? tags.map(tag => (
                                        {
                                            value: tag.id,
                                            label: tag.name,
                                            key: `tag-${tag.id}`
                                        }
                                    )) : [])
                                ]
                            }
                            onChange={(selectedId) => onFilterByTag(selectedId)}
                    />
                </Col>
                <Col span={6} style={{textAlign: 'end'}}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined/> Create new Food
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
                title="Create new Food"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn btn-primary'} type={"submit"} onClick={handleCreateFood}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form encType='multipart/form-data'>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Food name</Col>
                            <Col span={16}>
                                <input placeholder='Enter Food name...'
                                       className={'form-control'}
                                       name='name'
                                       value={newFood.name}
                                       onChange={onChangeFood}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Description</Col>
                            <Col span={16}>
                                <input placeholder='Enter Food description...'
                                       className={'form-control'}
                                       name='description'
                                       value={newFood.description}
                                       onChange={onChangeFood}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Price</Col>
                            <Col span={16}>
                                <input placeholder='Enter Price...'
                                       className={'form-control'}
                                       name='price'
                                       value={newFood.price}
                                       onChange={onChangeFood}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Serve for</Col>
                            <Col span={16}>
                                <Select name='serve'
                                        value={selectedServeType}
                                        size={'large'}
                                        style={{width: '100%'}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select Type of table',
                                                    key: 'select-type'
                                                },
                                                ...(Array.isArray(serveTypes) ? serveTypes.map(type => (
                                                    {
                                                        value: type.id,
                                                        label: type.name,
                                                        key: `type-${type.id}`
                                                    }
                                                )) : [])
                                            ]
                                        }
                                        onChange={(selectedValue) => onChangeServeType(selectedValue)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Type</Col>
                            <Col span={16}>
                                <Select
                                    name="typeId"
                                    value={selectedType}
                                    size={"large"}
                                    style={{width: '100%'}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select Type',
                                                key: 'select-type'
                                            },
                                            ...(Array.isArray(types) ? types.map(type => (
                                                {
                                                    value: type.id,
                                                    label: type.name,
                                                    key: `type-${type.id}`
                                                }
                                            )) : [])
                                        ]
                                    }
                                    onChange={(selectedId) => onChangeType(selectedId)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Tag</Col>
                            <Col span={16}>
                                <Select
                                    name="tagId"
                                    value={selectedTag}
                                    size={"large"}
                                    style={{width: '100%'}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select Tag',
                                                key: 'select-tag'
                                            },
                                            ...(Array.isArray(tags) ? tags.map(tag => (
                                                {
                                                    value: tag.id,
                                                    label: tag.name,
                                                    key: `tag-${tag.id}`
                                                }
                                            )) : [])
                                        ]
                                    }
                                    onChange={(selectedId) => onChangeTag(selectedId)}
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
                title="Food Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleDetailCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={"btn btn-primary"} onClick={() => {
                            showEditModal(foodDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>Name</Col>
                        <Col span={18}>{foodDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Description</Col>
                        <Col span={18}>{foodDetails.description}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Price</Col>
                        <Col span={18}>$ {foodDetails.price}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Serve for</Col>
                        <Col span={18}>{foodDetails.serve} persons</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Type</Col>
                        <Col span={18}>{foodDetails.type}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Tag</Col>
                        <Col span={18}><Tag color={tagColors[foodDetails.tag]}>{foodDetails.tag}</Tag></Col>
                    </Row>
                    <Row>
                        <Col span={6}>Thumbnail</Col>
                        <Col span={18}><img src={`${imgUrl}${foodDetails.thumbnail}`} alt="" className={'img-fluid'}/></Col>
                    </Row>
                </Space>
            </Modal>

            <Modal
                open={openEdit}
                title="Edit Food"
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
                <form encType='multipart/form-data'>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Food name</Col>
                            <Col span={16}>
                                <input placeholder='Enter Food name...'
                                       className={'form-control'}
                                       name='name'
                                       value={foodDetails.name}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Description</Col>
                            <Col span={16}>
                                <input placeholder='Enter Food description...'
                                       className={'form-control'}
                                       name='description'
                                       value={foodDetails.description}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Price</Col>
                            <Col span={16}>
                                <input placeholder='Enter Price...'
                                       className={'form-control'}
                                       name='price'
                                       value={foodDetails.price}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Serve for</Col>
                            <Col span={16}>
                                <Select name='serve'
                                        value={selectedServeType}
                                        size={'large'}
                                        style={{width: '100%'}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select Type of table',
                                                    key: 'select-type'
                                                },
                                                ...(Array.isArray(serveTypes) ? serveTypes.map(type => (
                                                    {
                                                        value: type.id,
                                                        label: type.name,
                                                        key: `type-${type.id}`
                                                    }
                                                )) : [])
                                            ]
                                        }
                                        onChange={(selectedValue) => onChangeServeType(selectedValue)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Type</Col>
                            <Col span={16}>
                                <Select
                                    name="typeId"
                                    value={selectedType}
                                    size={"large"}
                                    style={{width: '100%'}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select Type',
                                                key: 'select-type'
                                            },
                                            ...(Array.isArray(types) ? types.map(type => (
                                                {
                                                    value: type.id,
                                                    label: type.name,
                                                    key: `type-${type.id}`
                                                }
                                            )) : [])
                                        ]
                                    }
                                    onChange={(selectedId) => onChangeType(selectedId)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Tag</Col>
                            <Col span={16}>
                                <Select
                                    name="tagId"
                                    value={selectedTag}
                                    size={"large"}
                                    style={{width: '100%'}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select Tag',
                                                key: 'select-tag'
                                            },
                                            ...(Array.isArray(tags) ? tags.map(tag => (
                                                {
                                                    value: tag.id,
                                                    label: tag.name,
                                                    key: `tag-${tag.id}`
                                                }
                                            )) : [])
                                        ]
                                    }
                                    onChange={(selectedId) => onChangeTag(selectedId)}
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
                                            src={imgUrl + foodDetails.thumbnail}
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

export default FoodManagement;