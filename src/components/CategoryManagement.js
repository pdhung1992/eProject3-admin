import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import cityServices from "../services/city-service";
import Swal from "sweetalert2";
import {Button, Col, Input, Modal, Row, Select, Space, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import categoryService from "../services/category-service";


const CategoryManagement = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
    }


    useEffect(() => {
        fetchCategories()
    }, [])

    const data = categories;


    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    //create
    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeDesc = (e) => {
        setDescription(e.target.value)
    }


    const handleCreateCategory= (e) => {
        e.preventDefault();

        const formData = {
            name, description
        }
        const fetchNewCat = async () => {
            try {
                const res = await categoryService.createCategory(formData);
                if (res && res.name){
                    Swal.fire({
                        title: 'Category created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    setOpenCreate(false);
                    setName('');
                    setDescription('');
                    navigate('/categories');
                    fetchCategories();
                }
            }catch (e) {
                console.log(e.message)
            }
        }
        fetchNewCat()
    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setName('');
        setDescription('')
    };

    const [catDetails, setCatDetails] = useState({});

    const showDetailModal = async (id) => {
        const detail = await categoryService.getCategoryDetails(id);
        setCatDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    const showEditModal = async (id) => {
        const detail = await categoryService.getCategoryDetails(id);
        setCatDetails(detail);
        setOpenEdit(true);
    };

    const onEdit = (e) => {
        const { name, value } = e.target;
        setCatDetails(prevCat => ({
            ...prevCat,
            [name]: value
        }));
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = catDetails.id;
        const name = catDetails.name;
        const description = catDetails.description;

        const formData = {name, description}

        const fetchUpdateCat = async () => {
            try {
                const res = await categoryService.updateCategory(id, formData);
                if(res && res.name){
                    setMessage(`Category updated successfully!`);
                    Swal.fire({
                        title: 'Category updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchCategories();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUpdateCat();
    };

    const handleEditCancel = () => {
        setOpenEdit(false);
    };

    const handleDelete = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `${name} will be removed from your categories list!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await categoryService.deleteCategory(id);
                fetchCategories();
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: `${name} removed from your categories list!`,
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting ${name} category:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting category!',
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
            title: 'Category Name',
            dataIndex: 'name',
            width: "25%",
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: "45%",
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
                        placeholder="Enter Category name to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'center'}}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined/> Create new Category
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
                title="Create new Category"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleCreateCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={'btn btn-primary'} type={"submit"} onClick={handleCreateCategory}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <Row>
                            <Col span={8}>Category name</Col>
                            <Col span={16}>
                                <input placeholder='Enter Category name...'
                                       className={'form-control'}
                                       name='name'
                                       value={name}
                                       onChange={onChangeName}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Description</Col>
                            <Col span={16}>
                                <input placeholder='Enter Category description...'
                                       className={'form-control'}
                                       name='description'
                                       value={description}
                                       onChange={onChangeDesc}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>

            <Modal
                open={openDetail}
                title="Category Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-cancel'} onClick={handleDetailCancel}>
                            Cancel
                        </button>
                        ,
                        <button className={"btn btn-primary"} onClick={() => {
                            showEditModal(catDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Row>
                        <Col span={6}>Category</Col>
                        <Col span={18}>{catDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Description</Col>
                        <Col span={18}>{catDetails.description}</Col>
                    </Row>
                </Space>
            </Modal>

            <Modal
                open={openEdit}
                title="Edit Category"
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
                            <Col span={8}>Category name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Category name...'
                                       name='name'
                                       value={catDetails.name}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Description</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Category description...'
                                       name='description'
                                       value={catDetails.description}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default CategoryManagement;