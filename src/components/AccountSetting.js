import {Card, Col, Input, Modal, Row, Space} from "antd";
import Meta from "antd/es/card/Meta";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import {useState} from "react";
import authService from "../services/auth-service";


const AccountSetting = () => {

    const acc = useSelector(state => state.auth)
    const token = acc.admData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");

    const [openChange, setOpenChange] = useState(false);

    const showChangeModal = () => {
        setOpenChange(true)
    }
    const handleChangeCancel = () => {
        setOpenChange(false);
        setChangeData(initData);
    }

    const initData = {
        "currentPassword": "",
        "newPassword": "",
        "newPasswordCfm": ""
    };

    const [changeData, setChangeData] = useState(initData);

    const passwordMatch = changeData.newPassword === changeData.newPasswordCfm;

    const onChangeData = (e) => {
        const {name, value} = e.target;
        setChangeData(prevData => ({
            ...prevData, [name]: value
        }));
    }
    const handleChangePassword = (e) => {
        e.preventDefault();

        if(passwordMatch){
            const currentPassword = changeData.currentPassword;
            const newPassword = changeData.newPassword;
            const formData = {currentPassword , newPassword };
            const changePassword = async () => {
                try {
                    const res = await authService.changePassword(formData, axiosConfig);
                    console.log(res);
                    if(res && res.username){
                        setMessage("Password changed successfully!");
                        Swal.fire({
                            title: 'Password changed Successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#5ba515'
                        });
                        setChangeData(initData);
                        setOpenChange(false);
                    }
                }catch (e) {
                    setMessage(e.message);
                }
            }
            changePassword();
        }else {
            setMessage('New password is not match.');
            Swal.fire({
                title: 'New Password do not match!',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f27474'
            });
        }
    }

    return(
        <div className={'admin-content'}>
            <h2>Account Settings</h2>
            <hr/>
            <Card
                hoverable
                onClick={showChangeModal}
                style={{ width: 240 }}
                className={'card-meta'}
                cover={<img alt="example" src="/img/changepass.png" className={'img-fluid'}
                />}
            >
                <Meta title="Change Password" className={'text-center'}/>
            </Card>
            <Modal
                open={openChange}
                title="Change Password"
                onCancel={handleChangeCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-warning'} onClick={handleChangeCancel}>
                            Cancel
                        </button>,
                        <button className={'btn btn-primary'} type={"submit"} onClick={handleChangePassword}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Current Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Current Password...'
                                       value={changeData.currentPassword}
                                       type='password'
                                       name='currentPassword'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>New Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter New Password...'
                                       type='password'
                                       value={changeData.newPassword}
                                       name='newPassword'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Confirm new Password</Col>
                            <Col span={16}>
                                <Input placeholder='Confirm new Password...'
                                       type='password'
                                       value={changeData.newPasswordCfm}
                                       name='newPasswordCfm'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountSetting;