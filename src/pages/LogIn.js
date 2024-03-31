
import '../assets/css/auth.css';
import {Col, Row, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import authServices from "../services/auth-service";
import {loginFail, loginSuccess} from "../actions/authActions";

const LogIn = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const adm = useSelector(state => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const usernameRef = useRef(null);
    const [message, setMessage] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                username, password
            };
            const data = await authServices.login(formData);
            if (data && data.token && data.permissions && data.permissions.length > 0) {
                const firstPermission = data.permissions[0].prefix;
                dispatch(loginSuccess(data));
                navigate(`/${firstPermission}`);
            }
            else {
                dispatch(loginFail('Login failed.'))
                setMessage('Login failed.')
            }
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }

    const checkLogin = () => {
        if(adm && adm.admData){
            setIsLogin(true);
        }
    }
    if(isLogin){
        navigate('/')
    }

    useEffect(() => {
        usernameRef.current.focus();
        checkLogin()
    }, [])

    return(
        <div className={'auth-page'}>
            <div className="container">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row auth-img" span={14}>
                        <img src="/img/auth.png" alt="" className={'img-fluid'}/>
                    </Col>
                    <Col className="gutter-row auth-form" span={10}>
                        <div className={'auth-form-content'}>
                            <form onSubmit={handleLogin}>
                                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                                    <h4 className={'hero-title'}>Welcome back!</h4>
                                    <div className="form-floating mb-1">
                                        <input type="text"
                                               className="form-control form-input"
                                               id="floatingInput"
                                               placeholder=""
                                               name={'username'}
                                               value={username}
                                               ref={usernameRef}
                                               onChange={handleChangeUsername}
                                               required
                                        />
                                        <label htmlFor="floatingInput">Username</label>
                                    </div>
                                    <div className="form-floating mb-1">
                                        <input type="password"
                                               className="form-control form-input"
                                               id="floatingPassword"
                                               placeholder=""
                                               name={'password'}
                                               value={password}
                                               onChange={handleChangePassword}
                                               required
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    {message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                Log in error: {message}
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <button className={'btn btn-primary'} type={'submit'}>Log In</button>
                                    </div>
                                </Space>
                            </form>

                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default LogIn;