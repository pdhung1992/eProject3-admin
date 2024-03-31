import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import foodTagServices from "../services/foodtag-service";
import tableTypeServices from "../services/tabletype-service";
import foodServices from "../services/food-service";
import comboServices from "../services/combo-service";
import Swal from "sweetalert2";
import {Card, Checkbox, Col, Flex, Modal, Row, Select, Space, Tag} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Meta from "antd/es/card/Meta";


const EditCombo = () => {
    const admin = useSelector(state => state.auth);
    const navigate = useNavigate();
    const imgUrl = 'http://localhost:8888/api/images/';

    const token = admin.admData.token;
    const resId = admin.admData.resId;


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

    const [tags, setTags] = useState([]);
    const [serveTypes, setServeTypes] = useState([]);
    const fetchTags = async () => {
        const tags = await foodTagServices.getFoodTags();
        setTags(tags)
    }
    const fetchServeTypes = async () => {
        const types = await tableTypeServices.getTableTypes();
        setServeTypes(types)
    }

    useEffect(() => {
        fetchTags();
        fetchServeTypes();
    }, [])

    const initCombo = {
        'name': '',
        'description': '',
        'discountRate': '',
    }

    const [openStarter, setOpenStarter] = useState(false);
    const [openMain, setOpenMain] = useState(false);
    const [openDessert, setOpenDessert] = useState(false);
    const [openBeverage, setOpenBeverage] = useState(false);

    const [starters, setStarters] = useState([]);
    const [mains, setMains] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [beverages, setBeverages] = useState([]);

    const [selectedFoodIds, setSelectedFoodIds] = useState([]);
    const [selectedStarters, setSelectedStarters] = useState([]);
    const [selectedMains, setSelectedMains] = useState([]);
    const [selectedDesserts, setSelectedDesserts] = useState([]);
    const [selectedBeverages, setSelectedBeverages] = useState([]);

    const showStarterModal = async (e) => {
        e.preventDefault();
        const starters = await foodServices.getFoodByTypeAndServe(resId, 1, selectedServeType);
        setStarters(starters);
        setOpenStarter(true);
    };


    const handleSelectStarter = () => {
        const selectedStarters = [];
        const selectedIds = [];
        starters.forEach(starter => {
            const checkbox = document.getElementById(`starterCheckbox_${starter.id}`);
            if (checkbox && checkbox.checked) {
                selectedStarters.push(starter);
                selectedIds.push(starter.id);
            }
        });
        setSelectedStarters(selectedStarters);
        setSelectedFoodIds(prevFoodIds => [
            ...prevFoodIds, ...selectedIds
        ]);

        setOpenStarter(false);
    };

    const handleStarterCancel = () => {
        setOpenStarter(false);
    };

    const showMainModal = async (e) => {
        e.preventDefault();
        const mains = await foodServices.getFoodByTypeAndServe(resId, 2, selectedServeType);
        setMains(mains)
        setOpenMain(true);
    };

    const handleSelectMain = () => {
        const selectedMains = [];
        const selectedIds = [];
        mains.forEach(main => {
            const checkbox = document.getElementById(`mainCheckbox_${main.id}`);
            if (checkbox && checkbox.checked) {
                selectedMains.push(main);
                selectedIds.push(main.id)
            }
        });
        setSelectedMains(selectedMains);
        setSelectedFoodIds(prevFoodIds => [
            ...prevFoodIds, ...selectedIds
        ]);

        setOpenMain(false);
    };

    const handleMainCancel = () => {
        setOpenMain(false);
    };

    const showDessertModal = async (e) => {
        e.preventDefault();
        const desserts = await foodServices.getFoodByTypeAndServe(resId, 3, selectedServeType);
        setDesserts(desserts);
        setOpenDessert(true);
    };

    const handleSelectDessert = () => {
        const selectedDesserts = [];
        const selectedIds = [];
        desserts.forEach(dessert => {
            const checkbox = document.getElementById(`dessertCheckbox_${dessert.id}`);
            if (checkbox && checkbox.checked) {
                selectedDesserts.push(dessert);
                selectedIds.push(dessert.id)
            }
        });
        setSelectedDesserts(selectedDesserts);
        setSelectedFoodIds(prevFoodIds => [
            ...prevFoodIds, ...selectedIds
        ]);

        setOpenDessert(false);
    };

    const handleDessertCancel = () => {
        setOpenDessert(false);
    };

    const showBeverageModal = async (e) => {
        e.preventDefault();
        const beverages = await foodServices.getFoodByTypeAndServe(resId, 4, selectedServeType);
        setBeverages(beverages);
        setOpenBeverage(true);
    };

    const handleSelectBeverage = () => {
        const selectedBeverages = [];
        const selectedIds = [];
        beverages.forEach(beverage => {
            const checkbox = document.getElementById(`beverageCheckbox_${beverage.id}`);
            if (checkbox && checkbox.checked) {
                selectedBeverages.push(beverage);
                selectedIds.push(beverage.id);
            }
        });
        setSelectedBeverages(selectedBeverages);
        setSelectedFoodIds(prevFoodIds => [
            ...prevFoodIds, ...selectedIds
        ]);

        setOpenBeverage(false);
    };

    const handleFoodRemove = (rId) => {
        const updateFoodIds = selectedFoodIds.filter(id => id !== rId);
        setSelectedFoodIds(updateFoodIds);
    }

    useEffect(() => {
        const foodIds = selectedFoodIds;

        const updatedStarters = selectedStarters.filter(starter => foodIds.includes(starter.id));
        setSelectedStarters(updatedStarters);
        const updatedMains = selectedMains.filter(main => foodIds.includes(main.id));
        setSelectedMains(updatedMains);
        const updatedDesserts = selectedDesserts.filter(dessert => foodIds.includes(dessert.id));
        setSelectedDesserts(updatedDesserts);
        const updatedBeverages = selectedBeverages.filter(beverage => foodIds.includes(beverage.id));
        setSelectedBeverages(updatedBeverages);
    }, [selectedFoodIds]);

    const handleBeverageCancel = () => {
        setOpenBeverage(false);
    };

    const [newCombo, setNewCombo] = useState(initCombo);
    const [thumbnail, setThumbnail] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedServeType, setSelectedServeType] = useState('');

    const onChangeCombo = (e) => {
        const {name, value} = e.target;
        setNewCombo(prevCombo => ({
            ...prevCombo,
            [name]: value
        }));
    }

    const onChangeServeType = (value) => {
        setSelectedServeType(value);
    }

    const onChangeTag = (selectedId) => {
        setSelectedTag(selectedId);
    }

    const onChangeThumbnail = (e) => {
        const files = Array.from(e.target.files);

        const thumbnailFiles = files.filter(file => file.type.startsWith('image'));

        setThumbnail(thumbnailFiles);
    };


    const handleCreateCombo = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newCombo.name);
        formData.append('description', newCombo.description);
        formData.append('discountRate', newCombo.discountRate);
        formData.append('serveId', selectedServeType);
        formData.append('comboTagId', selectedTag);
        if(thumbnail && thumbnail.length > 0){
            formData.append('thumbnail', thumbnail[0])
        }
        selectedFoodIds.forEach(foodId => {
            formData.append('foods[]', foodId);
        });

        const fetchNewCombo = async () => {
            try {
                const res = await comboServices.createCombo(formData, axiosConfig);
                if (res && res.name){
                    Swal.fire({
                        title: 'Combo created Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    navigate('/combos');
                }
            }catch (e) {
                console.log(e.message)
            }
        }
        fetchNewCombo();
    }

    return(
        <div className={'admin-content'}>
            <h2>Edit Combo</h2>
            <hr/>
            <form encType='multipart/form-data'>
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Row>
                        <Col span={8}>Combo name</Col>
                        <Col span={16}>
                            <input placeholder='Enter Combo name...'
                                   className={'form-control'}
                                   name='name'
                                   value={newCombo.name}
                                   onChange={onChangeCombo}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>Description</Col>
                        <Col span={16}>
                            <input placeholder='Enter Combo description...'
                                   className={'form-control'}
                                   name='description'
                                   value={newCombo.description}
                                   onChange={onChangeCombo}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>Discount Rate</Col>
                        <Col span={16}>
                            <input placeholder='Enter Discount rate...'
                                   className={'form-control'}
                                   name='discountRate'
                                   value={newCombo.discountRate}
                                   onChange={onChangeCombo}
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
                    <Row>
                        <Col span={3}>Select foods</Col>
                        <Col span={3}>
                            <div className={'d-flex justify-content-center'}>
                                <button className={'btn btn-sm btn-outline-dark'} onClick={showStarterModal}>Select Starters</button>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={'d-flex justify-content-center'}>
                                <Space direction={'vertical'} size={'small'}>
                                    <Flex gap={'small'} wrap={'wrap'}>
                                        {Array.isArray(selectedStarters) && selectedStarters.length > 0 ? (
                                            selectedStarters.map(starter => (
                                                <Card hoverable className={'restaurant-card'}
                                                      style={{width: 200}}
                                                      cover={<img src={`${imgUrl}${starter.thumbnail}`}/>}
                                                      actions={[
                                                          <FontAwesomeIcon color={'#dc3545'} icon={faTrashCan} onClick={() => handleFoodRemove(starter.id)}/>
                                                      ]}
                                                >
                                                    <div className={'text-center'}>
                                                        <Meta title={starter.name}/>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <h5 className={'text-danger'} style={{fontStyle: 'italic'}}>No selected
                                                starters.</h5>
                                        )}
                                    </Flex>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={3}>
                            <div className={'d-flex justify-content-center'}>
                                <button className={'btn btn-sm btn-outline-dark'} onClick={showMainModal}>Select Mains</button>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={'d-flex justify-content-center'}>
                                <Space direction={'vertical'}>
                                    <Flex gap={'small'} wrap={'wrap'}>
                                        {Array.isArray(selectedMains) && selectedMains.length > 0 ? (
                                            selectedMains.map(main => (
                                                <Card hoverable className={'restaurant-card'}
                                                      style={{width: 200}}
                                                      cover={<img src={`${imgUrl}${main.thumbnail}`}/>}
                                                      actions={[
                                                          <FontAwesomeIcon color={'#dc3545'} icon={faTrashCan} onClick={() => handleFoodRemove(main.id)}/>
                                                      ]}
                                                >
                                                    <div className={'text-center'}>
                                                        <Meta title={main.name}/>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <h5 className={'text-danger'} style={{fontStyle: 'italic'}}>No selected mains.</h5>
                                        )}
                                    </Flex>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={3}>
                            <div className={'d-flex justify-content-center'}>
                                <button className={'btn btn-sm btn-outline-dark'} onClick={showDessertModal}>Select Desserts</button>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={'d-flex justify-content-center'}>
                                <Space direction={'vertical'}>
                                    <Flex gap={'small'} wrap={'wrap'}>
                                        {Array.isArray(selectedDesserts) && selectedDesserts.length > 0 ? (
                                            selectedDesserts.map(dessert => (
                                                <Card hoverable className={'restaurant-card'}
                                                      style={{width: 200}}
                                                      cover={<img src={`${imgUrl}${dessert.thumbnail}`}/>}
                                                      actions={[
                                                          <FontAwesomeIcon color={'#dc3545'} icon={faTrashCan} onClick={() => handleFoodRemove(dessert.id)}/>
                                                      ]}
                                                >
                                                    <div className={'text-center'}>
                                                        <Meta title={dessert.name}/>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <h5 className={'text-danger'} style={{fontStyle: 'italic'}}>No selected desserts.</h5>
                                        )}
                                    </Flex>

                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}></Col>
                        <Col span={3}>
                            <div className={'d-flex justify-content-center'}>
                                <button className={'btn btn-sm btn-outline-dark'} onClick={showBeverageModal}>Select Beverages</button>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={'d-flex justify-content-center'}>
                                <Space direction={'vertical'}>
                                    <Flex gap={'small'} wrap={'wrap'}>
                                        {Array.isArray(selectedBeverages) && selectedBeverages.length > 0 ? (
                                            selectedBeverages.map(beverage => (
                                                <Card hoverable className={'restaurant-card'}
                                                      style={{width: 200}}
                                                      cover={<img src={`${imgUrl}${beverage.thumbnail}`}/>}
                                                      actions={[
                                                          <FontAwesomeIcon color={'#dc3545'} icon={faTrashCan} onClick={() => handleFoodRemove(beverage.id)}/>
                                                      ]}
                                                >
                                                    <div className={'text-center'}>
                                                        <Meta title={beverage.name}/>
                                                    </div>
                                                </Card>
                                            ))
                                        ) : (
                                            <h5 className={'text-danger'} style={{fontStyle: 'italic'}}>No selected beverages.</h5>
                                        )}
                                    </Flex>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                    <div className={'text-center'}>
                        <button className={'btn btn-primary'} type={'submit'} onClick={handleCreateCombo}>Create Combo</button>
                    </div>
                </Space>
            </form>

            <Modal title="Select Starters"
                   open={openStarter}
                   onCancel={handleStarterCancel}
                   footer={[
                       <Space>
                           <button key="back" className={'btn btn-light'} onClick={handleStarterCancel}>
                               Cancel
                           </button>
                           <button className={'btn btn-primary'} onClick={handleSelectStarter}>
                               Done
                           </button>,
                       </Space>
                   ]}
            >
                <Space direction={'vertical'} style={{overflow: "auto", maxHeight: '60vh'}}>
                    {Array.isArray(starters) && starters.length > 0 ? (
                        starters.map(starter => (
                            <Checkbox key={starter.id} id={`starterCheckbox_${starter.id}`}>
                                <Row>
                                    <Col span={5}>
                                        <img src={`${imgUrl}${starter.thumbnail}`} alt=""
                                             className={'img-fluid'}/>
                                    </Col>
                                    <Col span={19}
                                         className={'d-flex justify-content-start align-items-center px-3'}>
                                        <div>
                                            <h5>{starter.name}</h5>
                                            <h6>
                                                {starter.tag !== 'None' ? (<Tag
                                                    color={tagColors[starter.tag]}>{starter.tag}</Tag>) : (<></>)}
                                                $ {starter.price} ({starter.serve} pax)
                                            </h6>
                                        </div>
                                    </Col>
                                </Row>
                            </Checkbox>
                        ))
                    ) : (<h5>No starter.</h5>)}
                </Space>
            </Modal>
            <Modal title="Select Mains"
                   open={openMain}
                   onCancel={handleMainCancel}
                   footer={[
                       <Space>
                           <button key="back" className={'btn btn-light'} onClick={handleMainCancel}>
                               Cancel
                           </button>
                           <button className={'btn btn-primary'} onClick={handleSelectMain}>
                               Done
                           </button>,
                       </Space>
                   ]}
            >
                <Space direction={'vertical'} style={{overflow: "auto", maxHeight: '60vh'}}>
                    {Array.isArray(mains) && mains.length > 0 ? (
                        mains.map(main => (
                            <Checkbox key={main.id} id={`mainCheckbox_${main.id}`}>
                                <Row>
                                    <Col span={5}>
                                        <img src={`${imgUrl}${main.thumbnail}`} alt="" className={'img-fluid'}/>
                                    </Col>
                                    <Col span={19}
                                         className={'d-flex justify-content-start align-items-center px-3'}>
                                        <div>
                                            <h5>{main.name}</h5>
                                            <h6>
                                                {main.tag !== 'None' ? (<Tag
                                                    color={tagColors[main.tag]}>{main.tag}</Tag>) : (<></>)}
                                                $ {main.price} ({main.serve} pax)
                                            </h6>

                                        </div>
                                    </Col>
                                </Row>
                            </Checkbox>
                        ))
                    ) : (<h5>No main.</h5>)}
                </Space>
            </Modal>
            <Modal title="Select Desserts"
                   open={openDessert}
                   onCancel={handleDessertCancel}
                   footer={[
                       <Space>
                           <button key="back" className={'btn btn-light'} onClick={handleDessertCancel}>
                               Cancel
                           </button>
                           <button className={'btn btn-primary'} onClick={handleSelectDessert}>
                               Done
                           </button>,
                       </Space>
                   ]}
            >
                <Space direction={'vertical'} style={{overflow: "auto", maxHeight: '60vh'}}>
                    {Array.isArray(desserts) && desserts.length > 0 ? (
                        desserts.map(dessert => (
                            <Checkbox key={dessert.id} id={`dessertCheckbox_${dessert.id}`}>
                                <Row>
                                    <Col span={5}>
                                        <img src={`${imgUrl}${dessert.thumbnail}`} alt=""
                                             className={'img-fluid'}/>
                                    </Col>
                                    <Col span={19}
                                         className={'d-flex justify-content-start align-items-center px-3'}>
                                        <div>
                                            <h5>{dessert.name}</h5>
                                            <h6>
                                                {dessert.tag !== 'None' ? (<Tag
                                                    color={tagColors[dessert.tag]}>{dessert.tag}</Tag>) : (<></>)}
                                                $ {dessert.price} ({dessert.serve} pax)
                                            </h6>
                                        </div>
                                    </Col>
                                </Row>
                            </Checkbox>
                        ))
                    ) : (<h5>No dessert.</h5>)}
                </Space>
            </Modal>
            <Modal title="Select Beverages"
                   open={openBeverage}
                   onCancel={handleBeverageCancel}
                   footer={[
                       <Space>
                           <button key="back" className={'btn btn-light'} onClick={handleBeverageCancel}>
                               Cancel
                           </button>
                           <button className={'btn btn-primary'} onClick={handleSelectBeverage}>
                               Done
                           </button>,
                       </Space>
                   ]}
            >
                <Space direction={'vertical'} style={{overflow: "auto", maxHeight: '60vh'}}>
                    {Array.isArray(beverages) && beverages.length > 0 ? (
                        beverages.map(beverage => (
                            <Checkbox key={beverage.id} id={`beverageCheckbox_${beverage.id}`}>
                                <Row>
                                    <Col span={5}>
                                        <img src={`${imgUrl}${beverage.thumbnail}`} alt=""
                                             className={'img-fluid'}/>
                                    </Col>
                                    <Col span={19}
                                         className={'d-flex justify-content-start align-items-center px-3'}>
                                        <div>
                                            <h5>{beverage.name}</h5>
                                            <h6>
                                                {beverage.tag !== 'None' ? (<Tag
                                                    color={tagColors[beverage.tag]}>{beverage.tag}</Tag>) : (<></>)}
                                                $ {beverage.price} ({beverage.serve} pax)
                                            </h6>
                                        </div>
                                    </Col>
                                </Row>
                            </Checkbox>
                        ))
                    ) : (<h5>No beverage.</h5>)}
                </Space>
            </Modal>
        </div>
    )
}

export default EditCombo;