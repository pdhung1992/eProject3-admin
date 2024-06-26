import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Col, Input, Row, Space, Table} from "antd";
import tableTypeServices from "../services/tabletype-service";
import {PlusOutlined} from "@ant-design/icons";
import statusServices from "../services/status-service";


const StatusManagement = () => {
    const navigate = useNavigate();

    const [message, setMessage] = useState('');

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: "20%",
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: "55%",
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

    const [status, setStatus] = useState([]);

    const fetchStatus = async () => {
        const status = await statusServices.getStatus();
        setStatus(status)
    }

    useEffect(() => {
        fetchStatus();
    }, [])

    const data = status;

    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const showDetailModal = async (id) => {
        // const detail = await cityServices.getCityDetails(id);
        // setCityDetails(detail);
        setOpenDetail(true);
    };

    const showEditModal = async (id) => {
        // const detail = await cityServices.getCityDetails(id);
        // setCityDetails(detail);
        setOpenEdit(true);
    };

    const handleDelete = async (id, name) => {
        // try {
        //     const result = await Swal.fire({
        //         title: 'Are you sure?',
        //         text: `${name} will be removed from your cities list!`,
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#5ba515',
        //         cancelButtonColor: '#ee0033',
        //         confirmButtonText: 'Yes, delete it!',
        //     });
        //
        //     if (result.isConfirmed) {
        //         await cityServices.deleteCity(id);
        //         fetchCities();
        //         await Swal.fire({
        //             title: 'Delete Successfully!',
        //             text: `${name} removed from your cities list!`,
        //             icon: 'success',
        //             confirmButtonColor: '#5ba515',
        //         });
        //     }
        // } catch (error) {
        //     console.error(`Error deleting ${name} city:`, error);
        //     Swal.fire({
        //         title: 'Delete error!',
        //         text: 'An error occurred while deleting city!',
        //         icon: 'error',
        //         confirmButtonColor: '#ee0033',
        //     });
        // }
    };

    return (
        <div className={'admin-content'}>
            <h2>Status Management</h2>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Input
                        size={"large"}
                        placeholder="Enter Stauts to find..."
                        allowClear
                        // onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'center'}}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{textAlign: 'end'}}>
                    <button className={'btn btn-primary'} onClick={showCreateModal}>
                        <PlusOutlined/> Create new Status
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
        </div>
    )
}

export default StatusManagement;