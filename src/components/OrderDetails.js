import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import orderServices from "../services/order-service";
import {useSelector} from "react-redux";
import {Button, Card, Col, Row, Table, Tag} from "antd";
import {faCircleChevronLeft} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import button from "bootstrap/js/src/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";


const OrderDetails = () => {

    const {id} = useParams();

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

    const tagColors = {
        Pending: 'lime',
        Confirmed: 'cyan',
        Processing: 'geekblue',
        Completed: 'green',
        Canceled: 'red',
    }

    const [message, setMessage] = useState('');

    const [details, setDetails] = useState({});
    const [currentStatus, setCurrentStatus] = useState();
    const [currentStatusId, setCurrentStatusId] = useState();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const res = await orderServices.getOrderDetails(id, axiosConfig);
            setDetails(res);
            setCurrentStatus(res.status);
            setCurrentStatusId(res.statusId);
        };
        fetchOrderDetails();
    }, []);

    const handleStatusChange = async () => {
        let nextStt = 0;
        if (currentStatus === 'Pending'){
            nextStt = 2
        }
        if (currentStatus === 'Confirmed'){
            nextStt = 3
        }
        if (currentStatus === 'Processing'){
            nextStt = 4
        }
        const formData = {
            'statusId' : nextStt
        }
        const res = await orderServices.updateOrderStatus(details.id, formData);
        if (res && res.status === 200){
            Swal.fire({
                title: 'Status update Successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#5ba515'
            });
            navigate('/orders');
        }
    }

    const handleCancelOrder = async () => {
        const formData = {
            'statusId' : 5
        }

        const res = await orderServices.updateOrderStatus(details.id, formData);
        if (res && res.status === 200){
            Swal.fire({
                title: 'Order canceled!',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#5ba515'
            });
            navigate('/orders');
        }
    }

    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'name',
            width: '15%',
            render: (thumbnail) => <img src={`${imgUrl}${thumbnail}`} className={'img-fluid'}/>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '50%',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'age',
            width: '15%',
            render: (price) => <span>$ {price}</span>,
        },
        {
            title: 'Serve',
            dataIndex: 'serve',
            key: 'address',
            width: '20%'
        }
    ];
    const data = details.foods;



    return(
        <div className={'admin-content'}>
            <Row>
                <Col span={12}>
                    <h2>Order Details</h2>
                </Col>
                <Col span={12} className={'text-end'}>
                    <Link to={'/orders'}>
                        <button className={'btn btn-primary'}>
                            <FontAwesomeIcon icon={faCircleChevronLeft}/> Back to Order list
                        </button>
                    </Link>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col span={10} className={'px-2'}>
                <Card hoverable>
                    <Row>
                            <Col span={10}>
                                <h4>Invoice</h4>
                            </Col>
                            <Col span={14}>
                                <h4 className={'text-danger'}>{details.invoiceNumber}</h4>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col span={10}>
                                <p>Event name</p>
                            </Col>
                            <Col span={14}>
                                <p>{details.eventName}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Delivery Date</p>
                            </Col>
                            <Col span={14}>
                                <p>{dayjs(details.deliveryDate).format('YYYY-MMM-DD')}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Delivery Address</p>
                            </Col>
                            <Col span={14}>
                                <p>{details.deliveryAddress}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Contact Person</p>
                            </Col>
                            <Col span={14}>
                                <p>{details.deliveryPerson}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Contact number</p>
                            </Col>
                            <Col span={14}>
                                <p>{details.deliveryPhone}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Additional Requirement</p>
                            </Col>
                            <Col span={14}>
                                <p>{details.additionalRequirement}</p>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col span={10}>
                                <p>Total Amount</p>
                            </Col>
                            <Col span={14}>
                                <p>$ {details.totalAmount}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Pre-paid</p>
                            </Col>
                            <Col span={14}>
                                <p>$ {details.prePaid}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <p>Status</p>
                            </Col>
                            <Col span={14}>
                                <p><Tag color={tagColors[details.status]}>{details.status}</Tag></p>
                            </Col>
                        </Row>
                        <div className={'text-center'}>
                            {currentStatus === 'Pending' && (
                                <div className={'d-flex justify-content-around'}>
                                    <button className={'btn btn-primary'} onClick={handleStatusChange}>
                                        Confirm Order
                                    </button>
                                    <button className={'btn btn-danger'} onClick={handleCancelOrder}>
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                            {currentStatus === 'Confirmed' && (
                                <button className={'btn btn-primary'} onClick={handleStatusChange}>
                                    Process order
                                </button>
                            )}
                            {currentStatus === 'Processing' && (
                                <button className={'btn btn-primary'} onClick={handleStatusChange}>
                                    Complete order
                                </button>
                            )}
                        </div>
                    </Card>
                </Col>
                <Col span={14} className={'px-2'}>
                    <Card hoverable>
                        <h4>Menu Details</h4>
                        <hr/>
                        <Table columns={columns}
                               dataSource={data}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderDetails