import { Card, Row, Col, Typography, Input, Select, Button, message, Space } from 'antd';
import React, {useState} from 'react';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

let selectedValue;

const rowStyle = {
    minHeight: "100px",
    
}

const h4Style = {
    display:"block", 
    width:"100%",
    textAlign: "left",
    height: "20%"
}

function formatDate(datetime) {
    let date = datetime.substring(0, datetime.indexOf("T"));
    let time = datetime.substring(datetime.indexOf("T")+1, datetime.indexOf("Z"));
    let y_m_d = date.split("-");
    let result = y_m_d[2]+"/"+y_m_d[1]+"/"+y_m_d[0]+" "+time;
    return result; 
}

function Login() {
    const [businessOptions, setBusinessOptions] = useState([]);

    function findId(value) {
        for(let business of businessOptions) {
            if (business.title === value) {
                return business.id;
            }
        }
    }

    async function getLicense(value) {
        const id = findId(value);
        const response = await axios.get(`http://localhost:5232/api/License/GetLicense?businessID=${id}`);
        console.log(response.data);
        if (response.data.licenseExpired) {
            error(response.data.licenseEndingTime);
        } else {
            success();
        }
    }

    const handleChange = (value) => {
        selectedValue = value;
    };

    async function getBusinesses() {
        const response = await axios.get("http://localhost:5232/api/Login/GetBusinessList");
        setBusinessOptions(response.data);
    }

    const handleFocus = () => {
        if (businessOptions.length === 0) {
            getBusinesses();
        }
    }

    const buttonClick = () => {
        getLicense(selectedValue);
    }

    const error = (datetime) => {
        message.error('License expired at : ' + formatDate(datetime));
    };

    const success = () => {
        message.success('Logged in successfully');
    };

    return (
        <>
            <div
                style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height: "100%",
                    minHeight: "300px",
                }}
            >
                <Card
                title="Giriş Yap"
                style={{
                    width: "50%",
                    height: "100%",
                    textAlign:"center",
                    minHeight:"300px",
                }}
                bodyStyle={{
                    height: "100%",
                    minHeight:"300px"
                }}
                >
                <Row style={rowStyle}>
                    <h4 style={h4Style}>İşletme Adı</h4>
                    <Select
                        style={{
                            width: "100%",
                            height: "25%"
                        }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                    >
                        {
                            businessOptions.map(business => {
                                return (
                                    <Option key={`option${business.id}`} value={`${business.title}`}>{business.title}</Option>
                                )
                            })
                        }
                    </Select>
                </Row>
                <Row style={rowStyle}> 
                    <h4 style={h4Style}>Kullanıcı Adı</h4>
                    <Input size="middle" style={{height:"50%"}}/>
                </Row>
                <Row style={rowStyle}>
                    <h4 style={h4Style}>Şifre</h4>
                    <Input.Password size="middle" style={{height:"50%"}}/>
                </Row>
                <Row style={{...rowStyle, display:"flex", justifyContent:"center"}}>
                    <Button type="primary" onClick={buttonClick}>Giriş Yap</Button>
                </Row>
                </Card>
            </div>
        </>
    );
}

export default Login;