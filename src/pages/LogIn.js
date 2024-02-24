
import '../assets/css/auth.css';
import {Col, Row, Space} from "antd";

const LogIn = () => {
    return(
        <div className={'auth-page'}>
            <div className="container">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row auth-img" span={14}>
                        <img src="/img/auth.png" alt="" className={'img-fluid'}/>
                    </Col>
                    <Col className="gutter-row auth-form" span={10}>
                        <div className={'auth-form-content'}>
                            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                                <h4 className={'hero-title'}>Welcome back!</h4>
                                <div className="form-floating mb-1">
                                    <input type="email" className="form-control" id="floatingInput"
                                           placeholder=""/>
                                    <label htmlFor="floatingInput">Username</label>
                                </div>
                                <div className="form-floating mb-1">
                                    <input type="password" className="form-control" id="floatingPassword"
                                           placeholder=""/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="text-center">
                                    <button className={'btn btn-primary'}>Log In</button>
                                </div>
                            </Space>

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default LogIn;