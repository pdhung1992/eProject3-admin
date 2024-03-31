import {Col, Input, Modal, Row, Select, Space, TimePicker} from "antd";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import restaurantServices from "../services/restaurant-service";
import districtServices from "../services/district-services";
import Swal from "sweetalert2";
import cityServices from "../services/city-service";
import TextArea from "antd/es/input/TextArea";
import categoryServices from "../services/category-service";
import dayjs from "dayjs";


const RestaurantSetting = () => {

    const admin = useSelector(state => state.auth);
    const navigate = useNavigate();
    const imgUrl = 'http://localhost:8888/api/images/';

    const token = admin.admData.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");

    const [restaurant, setRestaurant] = useState({});
    const [categories, setCategories] = useState([])
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [thumbnail, setThumbnail] = useState([]);
    const [banner, setBanner] = useState([]);

    const fetchRestaurant = async () => {
        const res = await restaurantServices.getRestaurantByAdmin(axiosConfig);
        setRestaurant(res);
        setSelectedCategory(res.catId)
        setSelectedCity(res.cityId);
        setSelectedDistrict(res.districtId);
    }

    const handleCatChange = (selectedId) => {
        setSelectedDistrict(selectedId);
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
        fetchRestaurant();
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


    const [openEdit, setOpenEdit] = useState(false);

    const showEditModal = async () => {
        setOpenEdit(true);
    };


    const onEdit = (e) => {
        const { name, value } = e.target;
        setRestaurant(prevRes => ({
            ...prevRes,
            [name]: value
        }));
    }

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

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = restaurant.id;

        const formData = new FormData();

        formData.append('name', restaurant.name);
        formData.append('address', restaurant.address);
        formData.append('description', restaurant.description);
        formData.append('prePaidRate', restaurant.prePaidRate);
        formData.append('catId', selectedCategory);
        formData.append('districtId', selectedDistrict);
        formData.append('deliveryHours', dlvHours);
        formData.append('minimumDelivery', restaurant.minimumDelivery);

        if(thumbnail && thumbnail.length > 0){
            formData.append('thumbnail', thumbnail[0])
        }
        if(banner && banner.length > 0){
            formData.append('banner', banner[0])
        }



        const fetchUpdateRestaurant = async () => {
            try {
                const res = await restaurantServices.updateRestaurant(id, formData, axiosConfig);
                if(res && res.name){
                    setMessage(`Restaurant updated successfully!`);
                    Swal.fire({
                        title: 'Restaurant updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchRestaurant();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateRestaurant();
    };

    const handleEditCancel = () => {
        setOpenEdit(false);
    };


    return (
        <div className={'admin-content'}>
            <h2>Restaurant Settings</h2>
            <hr/>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Row>
                    <Col span={6}><h4>Restaurant name</h4></Col>
                    <Col span={18}><h4>{restaurant.name}</h4></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Category</h6></Col>
                    <Col span={18}><h6>{restaurant.category}</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Address</h6></Col>
                    <Col span={18}><h6>{restaurant.address}, {restaurant.district}, {restaurant.city}</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Join date</h6></Col>
                    <Col span={18}><h6>{dayjs(restaurant.joinDate).format('YYYY-MMM-DD')}</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Description</h6></Col>
                    <Col span={18}><h6>{restaurant.description}</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Delivery Hours</h6></Col>
                    <Col span={18}><h6>{restaurant.deliveryHours}</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Minimum Delivery</h6></Col>
                    <Col span={18}><h6>{restaurant.minimumDelivery} persons</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Pre-paid Rate</h6></Col>
                    <Col span={18}><h6>{restaurant.prePaidRate} %</h6></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Thumbnail</h6></Col>
                    <Col span={18}><img src={`${imgUrl}${restaurant.thumbnail}`} alt="" width={300}/></Col>
                </Row>
                <Row>
                    <Col span={6}><h6>Banner</h6></Col>
                    <Col span={18}><img src={`${imgUrl}${restaurant.banner}`} alt="" width={600}/></Col>
                </Row>
                <br/>
                <div className={'text-center'}>
                    <button className={'btn btn-primary'} onClick={showEditModal}>Update restaurant information</button>
                </div>
            </Space>

            <Modal
                open={openEdit}
                title="Edit City"
                onCancel={handleEditCancel}
                width={'50%'}
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
                <form style={{height: '60vh', overflow: 'auto'}} encType='multipart/form-data'>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        <Row>
                            <Col span={8}>Restaurant name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Restaurant name...'
                                       name='name'
                                       value={restaurant.name}
                                       onChange={onEdit}
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
                                          value={restaurant.address}
                                          onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Description</Col>
                            <Col span={16}>
                                <TextArea placeholder='Enter Description...'
                                          rows={3}
                                       name='description'
                                       value={restaurant.description}
                                       onChange={onEdit}
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
                                <Input placeholder='Enter City name...'
                                       name='minimumDelivery'
                                       value={restaurant.minimumDelivery}
                                       onChange={onEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Pre-paid rate</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Pre-paid rate...'
                                       name='prePaidRate'
                                       value={restaurant.prePaidRate}
                                       onChange={onEdit}
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
                                        <img
                                            src={imgUrl + restaurant.thumbnail}
                                            alt={`Preview thumbnail`}
                                            className="preview-image"
                                            width="33%"
                                            style={{margin: '15px', border: 'solid 1px #5ba515', borderRadius: '5%'}}
                                        />
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
                                        <img
                                            src={imgUrl + restaurant.banner}
                                            alt={`Preview thumbnail`}
                                            className="preview-image"
                                            width="80%"
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

export default RestaurantSetting;