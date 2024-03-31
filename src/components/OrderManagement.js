import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Input, Row, Select, Space, Table, Tag} from "antd";
import orderServices from "../services/order-service";
import {useSelector} from "react-redux";
import dayjs from "dayjs";
import statusServices from "../services/status-service";


const OrderManagement = () => {
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

    const [message, setMessage] = useState('');

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([orders]);
    const [status, setStatus] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    const fetchOrders = async () => {
        const orders = await orderServices.getOrderOfRestaurant(axiosConfig);
        setOrders(orders)
    }

    const fetchStatus = async () => {
        const status = await statusServices.getStatus();
        setStatus(status);
    }

    useEffect(() => {
        fetchOrders();
        fetchStatus();
    }, [])

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders])

    const onSearchOrder = (e) => {
        const keyword = e.target.value.trim().toLowerCase().replace(/\s/g, '');
        const filtered = orders.filter(order => order.invoiceNumber && order.invoiceNumber.trim().toLowerCase().includes(keyword) || order.eventName && order.eventName.trim().toLowerCase().includes(keyword));
        setFilteredOrders(filtered);
    }

    const onFilterByStatus = (id) => {
        const filtered = orders.filter(order => order.statusId === id);
        setFilteredOrders(filtered);
    }

    console.log(orders)
    const data = filteredOrders;


    const columns = [
        {
            title: 'Invoice',
            dataIndex: 'invoiceNumber',
            width: "10%",
        },
        {
            title: 'Event Name',
            dataIndex: 'eventName',
            width: "15%",
        },
        {
            title: 'Delivery Address',
            dataIndex: 'deliveryAddress',
            width: "25%",
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            width: "10%",
            render: (orderDate) => (
                <span>{dayjs(orderDate).format('YYYY-MMM-DD')}</span>
            )
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            width: "10%",
            render: (deliveryDate) => (
                <span>{dayjs(deliveryDate).format('YYYY-MMM-DD')}</span>
            )
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            width: "10%",
            render: (totalAmount) => (
                <h6 className={'text-danger'}>$ {totalAmount}</h6>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: "10%",
            render: (status) => (
                <Tag color={tagColors[status]}>{status}</Tag>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (id) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Link to={`details/${id}`}><Button type="primary">Details</Button></Link>
                </Space>
            ),
            width: "10%",
        }
    ];

    const tagColors = {
        Pending: 'lime',
        Confirmed: 'cyan',
        Processing: 'geekblue',
        Completed: 'green',
        Canceled: 'red',
    }


    return(
        <div className={'admin-content'}>
            <h2>Order Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter Invoice number or Event name to find..."
                        allowClear
                        onChange={onSearchOrder}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }} className={'d-flex justify-content-start align-items-center'}>
                    <h6 style={{width: '100%'}}>Filter by: </h6>
                    <Select size={"large"}
                            value={selectedStatus}
                            style={{width: '100%'}}
                            className={'px-1'}
                            options={
                                [
                                    {
                                        value: '',
                                        label: 'Select Status',
                                        key: 'select-status'
                                    },
                                    ...(Array.isArray(status) ? status.map(status=> (
                                        {
                                            value: status.id,
                                            label: status.name,
                                            key: `type-${status.id}`
                                        }
                                    )) : [])
                                ]
                            }
                            onChange={(selectedValue) => onFilterByStatus(selectedValue)}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'end' }}>

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
        </div>
    )
}

export default OrderManagement;