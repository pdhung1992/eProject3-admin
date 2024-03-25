import {Card} from "antd";
import Meta from "antd/es/card/Meta";


const AccountSetting = () => {
    return(
        <div className={'admin-content'}>
            <h2>Account Settings</h2>
            <hr/>
            <Card
                hoverable
                style={{ width: 240 }}
                className={'card-meta'}
                cover={<img alt="example" src="/img/changepass.png" className={'img-fluid'}
                />}
            >
                <Meta title="Change Password" className={'text-center'}/>
            </Card>
        </div>
    )
}

export default AccountSetting;