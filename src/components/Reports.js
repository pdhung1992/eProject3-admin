import React, {useEffect, useState} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {Card, Col, DatePicker, Row, Tooltip} from "antd";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import Meta from "antd/es/card/Meta";
import reportServices from "../services/report-service";


const Reports = () => {

    const admin =  useSelector(state => state.auth.admData)
    const token = admin.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }


    const [month, setMonth] = useState(dayjs().month() + 1);
    const [year, setYear] = useState(dayjs().year());


    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState('');

    const [totalRevenue, setTotalReVenue] = useState('');
    const [totalReceive, setTotalReceive] = useState('');
    const [totalRemain, setTotalRemain] = useState('');

    const totalPending = Array.isArray(orders) ? orders.filter((order) => order.status === 'Pending').length : 0;
    const totalConfirmed = Array.isArray(orders) ? orders.filter((order) => order.status === 'Confirmed').length : 0;
    const totalProcessing = Array.isArray(orders) ? orders.filter((order) => order.status === 'Processing').length : 0;
    const totalCompleted = Array.isArray(orders) ? orders.filter((order) => order.status === 'Completed').length : 0;
    const totalCanceled = Array.isArray(orders) ? orders.filter((order) => order.status === 'Canceled').length : 0;




    const onChangeMonth = (date, dateString) => {
        const selectedMonth = dayjs(dateString, 'YYYY-MM');
        const selectedMonthString = selectedMonth.format('M');
        const selectedYearString = selectedMonth.format('YYYY');

        setMonth(selectedMonthString);
        setYear(selectedYearString);
    };
    const currentMonth = dayjs().startOf('month');

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await reportServices.getReportByMonth(month, year, axiosConfig);
            setOrders(data);
            {data.length > 0 ? setTotalOrders(data.length) : setTotalOrders(0)}
        };
        fetchOrders();
    }, [month])

    useEffect(() => {
        const calc = () => {
            let total = 0;
            let paid = 0;
            orders.forEach(order => {
                total += order.totalAmount;
                if(order.status === 'Confirmed'){
                    paid += order.prePaid;
                }
                if(order.status === 'Completed'){
                    paid += order.totalAmount;
                }
            })
            setTotalReVenue(total);
            setTotalReceive(paid);
            setTotalRemain(total-paid);
        }

        calc();
    }, [orders])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    const getDatesForMonth = (year, month) => {
        const days = getDaysInMonth(year, month);
        const dates = [];
        for (let i = 1; i <= days; i++) {
            dates.push(getDateString(new Date(year, month - 1, i)));
        }
        return dates;
    };
    const allDates = getDatesForMonth(year, month);

    const counts = allDates.map((date) => {
        const Orders = Array.isArray(orders)
            ? orders.reduce((acc, item) => {
                const itemDate = getDateString(item.orderDate);
                return itemDate === date ? acc + 1 : acc;
            }, 0)
            : 0;
        return {
            date,
            Orders,
        };
    });

    return(
        <div className={'admin-content'}>
            <h2>Reports</h2>
            <hr/>
            <h5>View data in
                <span className={'px-2'}>
                    <DatePicker
                        defaultValue={currentMonth}
                        onChange={onChangeMonth} picker="month"
                    />
                </span>
            </h5>
            <br/>
            <Card headStyle={{background: "#dcdcdc"}} title={'Order Statistics '} hoverable>
            <Row>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: '#1da1f2' }}>Total Orders</span>}
                              description={<h2 style={{color: "#1da1f2"}}>{totalOrders}</h2>} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: 'lime' }}>Pending</span>}
                              description={<h2 style={{color: "lime"}}>{totalPending}</h2>} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: 'cyan' }}>Confirmed</span>}
                              description={<h2 style={{color: "cyan"}}>{totalConfirmed}</h2>} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: 'magenta' }}>Processing</span>}
                              description={<h2 style={{color: "magenta"}}>{totalProcessing}</h2>} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: 'green' }}>Completed</span>}
                              description={<h2 style={{color: "green"}}>{totalCompleted}</h2>} />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            border: "solid 1px #00457c"
                        }}

                    >
                        <Meta title={<span style={{ color: 'red' }}>Canceled</span>}
                              description={<h2 style={{color: "red"}}>{totalCanceled}</h2>} />
                    </Card>
                </Col>
            </Row>
            <br/>
            <h6>Orders count by day:</h6>
            <br/>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={counts}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Orders" stroke="#1da1f2" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
            <br/>
            <Card headStyle={{background: "#dcdcdc"}} title={'Revenue Statistics '} hoverable>
                <Row>
                    <Col span={8}>
                        <Card
                            hoverable
                            style={{
                                margin: "5%",
                                textAlign: "center",
                                border: "solid 1px #00457c"
                            }}

                        >
                            <Meta title={<span style={{ color: '#1da1f2' }}>Total Revenue</span>}
                                  description={<h2 style={{color: "#1da1f2"}}>$ {totalRevenue}</h2>} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            style={{
                                margin: "5%",
                                textAlign: "center",
                                border: "solid 1px #00457c"
                            }}

                        >
                            <Meta title={<span style={{ color: 'green' }}>Received</span>}
                                  description={<h2 style={{color: "green"}}>$ {totalReceive}</h2>} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            style={{
                                margin: "5%",
                                textAlign: "center",
                                border: "solid 1px #00457c"
                            }}
                        >
                            <Meta title={<span style={{ color: 'red' }}>Remaining</span>}
                                  description={<h2 style={{color: "red"}}>$ {totalRemain}</h2>} />
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default Reports;