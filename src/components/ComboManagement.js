import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Input, Modal, Row, Space, Table, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import comboServices from "../services/combo-service";
import Swal from "sweetalert2";



const ComboManagement = () => {
    const admin = useSelector(state => state.auth);
    const imgUrl = 'http://localhost:8888/api/images/';
    const resId = admin.admData.resId;
    const token = admin.admData.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const tagColors = {
        New: 'green',
        Favorite: 'blue',
        Signature: 'purple',
    }

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
            width: "25%",
        },
        {
            title: 'Discount Rate',
            dataIndex: 'discountRate',
            width: "15%",
            render: (discountRate) => (
                <span>{discountRate}%</span>
            )
        },
        {
            title: 'Serve',
            dataIndex: 'serve',
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
                    <Button>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id, record.name)}>Delete</Button>
                </Space>
            ),
            width: "25%",
        }
    ];

    const [combos, setCombos] = useState([])

    const fetchCombos = async (id) => {
        const combos = await comboServices.getComboByRestaurant(id);
        setCombos(combos);
    }

    useEffect(() => {
        fetchCombos(resId);
    }, [])

    const data = combos;

    const [openDetail, setOpenDetail] = useState(false);


    const showDetailModal = async (id) => {
        // const detail = await cityServices.getCityDetails(id);
        // setCityDetails(detail);
        setOpenDetail(true);
    };

    const handleDelete = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `${name} will be removed from your Combos list!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await comboServices.deleteCombo(id, axiosConfig);
                fetchCombos(resId);
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: `${name} removed from your combo list!`,
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting ${name} city:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting combo!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    return (
        <div className={'admin-content'}>
            <h2>Combo Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter Combo name to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'center'}}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    <Link to={'create'}>
                        <button className={'btn btn-primary'}>
                            <PlusOutlined/> Create new Combo
                        </button>
                    </Link>
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


            {/*<Modal*/}
            {/*    open={openDetail}*/}
            {/*    title="Food Details"*/}
            {/*    onCancel={handleDetailCancel}*/}
            {/*    footer={[*/}
            {/*        <Space>*/}
            {/*            <button key="back" className={'btn btn-cancel'} onClick={handleDetailCancel}>*/}
            {/*                Cancel*/}
            {/*            </button>*/}
            {/*            ,*/}
            {/*            <button className={"btn btn-primary"} onClick={() => {*/}
            {/*                showEditModal(foodDetails.id);*/}
            {/*                handleDetailCancel();*/}
            {/*            }}>Edit</button>*/}
            {/*        </Space>*/}
            {/*    ]}*/}
            {/*>*/}
            {/*    <hr/>*/}
            {/*    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Name</Col>*/}
            {/*            <Col span={18}>{foodDetails.name}</Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Description</Col>*/}
            {/*            <Col span={18}>{foodDetails.description}</Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Price</Col>*/}
            {/*            <Col span={18}>$ {foodDetails.price}</Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Serve for</Col>*/}
            {/*            <Col span={18}>{foodDetails.serve} persons</Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Type</Col>*/}
            {/*            <Col span={18}>{foodDetails.type}</Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Tag</Col>*/}
            {/*            <Col span={18}><Tag color={tagColors[foodDetails.tag]}>{foodDetails.tag}</Tag></Col>*/}
            {/*        </Row>*/}
            {/*        <Row>*/}
            {/*            <Col span={6}>Thumbnail</Col>*/}
            {/*            <Col span={18}><img src={`${imgUrl}${foodDetails.thumbnail}`} alt="" className={'img-fluid'}/></Col>*/}
            {/*        </Row>*/}
            {/*    </Space>*/}
            {/*</Modal>*/}

            {/*<Modal*/}
            {/*    open={openEdit}*/}
            {/*    title="Edit Food"*/}
            {/*    onCancel={handleEditCancel}*/}
            {/*    footer={[*/}
            {/*        <Space>*/}
            {/*            <button key="back" className={'btn btn-primary'} onClick={handleEditCancel}>*/}
            {/*                Cancel*/}
            {/*            </button>,*/}
            {/*            <button className={'btn main-btn'} type={"submit"} onClick={handleEditSubmit}>*/}
            {/*                Submit*/}
            {/*            </button>,*/}
            {/*        </Space>*/}
            {/*    ]}*/}
            {/*>*/}
            {/*    <hr/>*/}
            {/*    <form encType='multipart/form-data'>*/}
            {/*        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Food name</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <input placeholder='Enter Food name...'*/}
            {/*                           className={'form-control'}*/}
            {/*                           name='name'*/}
            {/*                           value={foodDetails.name}*/}
            {/*                           onChange={onEdit}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Description</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <input placeholder='Enter Food description...'*/}
            {/*                           className={'form-control'}*/}
            {/*                           name='description'*/}
            {/*                           value={foodDetails.description}*/}
            {/*                           onChange={onEdit}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Price</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <input placeholder='Enter Price...'*/}
            {/*                           className={'form-control'}*/}
            {/*                           name='price'*/}
            {/*                           value={foodDetails.price}*/}
            {/*                           onChange={onEdit}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Serve for</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <Select name='serve'*/}
            {/*                            value={selectedServeType}*/}
            {/*                            size={'large'}*/}
            {/*                            style={{width: '100%'}}*/}
            {/*                            options={*/}
            {/*                                [*/}
            {/*                                    {*/}
            {/*                                        value: '',*/}
            {/*                                        label: 'Select Type of table',*/}
            {/*                                        key: 'select-type'*/}
            {/*                                    },*/}
            {/*                                    ...(Array.isArray(serveTypes) ? serveTypes.map(type => (*/}
            {/*                                        {*/}
            {/*                                            value: type.id,*/}
            {/*                                            label: type.name,*/}
            {/*                                            key: `type-${type.id}`*/}
            {/*                                        }*/}
            {/*                                    )) : [])*/}
            {/*                                ]*/}
            {/*                            }*/}
            {/*                            onChange={(selectedValue) => onChangeServeType(selectedValue)}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Type</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <Select*/}
            {/*                        name="typeId"*/}
            {/*                        value={selectedType}*/}
            {/*                        size={"large"}*/}
            {/*                        style={{width: '100%'}}*/}
            {/*                        options={*/}
            {/*                            [*/}
            {/*                                {*/}
            {/*                                    value: '',*/}
            {/*                                    label: 'Select Type',*/}
            {/*                                    key: 'select-type'*/}
            {/*                                },*/}
            {/*                                ...(Array.isArray(types) ? types.map(type => (*/}
            {/*                                    {*/}
            {/*                                        value: type.id,*/}
            {/*                                        label: type.name,*/}
            {/*                                        key: `type-${type.id}`*/}
            {/*                                    }*/}
            {/*                                )) : [])*/}
            {/*                            ]*/}
            {/*                        }*/}
            {/*                        onChange={(selectedId) => onChangeType(selectedId)}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Tag</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <Select*/}
            {/*                        name="tagId"*/}
            {/*                        value={selectedTag}*/}
            {/*                        size={"large"}*/}
            {/*                        style={{width: '100%'}}*/}
            {/*                        options={*/}
            {/*                            [*/}
            {/*                                {*/}
            {/*                                    value: '',*/}
            {/*                                    label: 'Select Tag',*/}
            {/*                                    key: 'select-tag'*/}
            {/*                                },*/}
            {/*                                ...(Array.isArray(tags) ? tags.map(tag => (*/}
            {/*                                    {*/}
            {/*                                        value: tag.id,*/}
            {/*                                        label: tag.name,*/}
            {/*                                        key: `tag-${tag.id}`*/}
            {/*                                    }*/}
            {/*                                )) : [])*/}
            {/*                            ]*/}
            {/*                        }*/}
            {/*                        onChange={(selectedId) => onChangeTag(selectedId)}*/}
            {/*                    />*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*            <Row>*/}
            {/*                <Col span={8}>Thumbnail</Col>*/}
            {/*                <Col span={16}>*/}
            {/*                    <input*/}
            {/*                        type="file"*/}
            {/*                        id={'imgInput'}*/}
            {/*                        className="form-control"*/}
            {/*                        placeholder="images"*/}
            {/*                        aria-label="images"*/}
            {/*                        name="thumbnail"*/}
            {/*                        onChange={onChangeThumbnail}*/}
            {/*                    />*/}
            {/*                    <div className="preview-images text-center">*/}
            {/*                        {thumbnail.length !== 0 ? (*/}
            {/*                            thumbnail.map((image, index) => (*/}
            {/*                                <img*/}
            {/*                                    key={index}*/}
            {/*                                    src={URL.createObjectURL(image)}*/}
            {/*                                    alt={`Preview ${index}`}*/}
            {/*                                    className="preview-image"*/}
            {/*                                    width="50%"*/}
            {/*                                    style={{*/}
            {/*                                        margin: '15px',*/}
            {/*                                        border: 'solid 1px #5ba515',*/}
            {/*                                        borderRadius: '5%'*/}
            {/*                                    }}*/}
            {/*                                />*/}
            {/*                            ))*/}
            {/*                        ) : (*/}
            {/*                            <img*/}
            {/*                                src={imgUrl + foodDetails.thumbnail}*/}
            {/*                                alt={`Preview thumbnail`}*/}
            {/*                                className="preview-image"*/}
            {/*                                width="50%"*/}
            {/*                                style={{margin: '15px', border: 'solid 1px #5ba515', borderRadius: '5%'}}*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*        </Space>*/}
            {/*    </form>*/}
            {/*</Modal>*/}
        </div>
    )
}

export default ComboManagement;