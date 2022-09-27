import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Typography, Divider, List, Skeleton, AutoComplete, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Countries from "../json/Countries.json";
import axios from "axios";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const getFields = (data, setData, loadMoreDataStatic, dynamicOptions, setDynamicOptions) => {
    
    async function getRelationalCountries(country_name) {
        if (country_name !== "") {
            const response = await axios.get(`http://localhost:5232/api/Country/Get?name=${country_name}`);
            console.log(response.data);
            data[2] = response.data;
    
            loadMoreDataStatic(2);
        } else {
            const response = await axios.get(`http://localhost:5232/api/Country/GetAll?limit=${Countries.length}`);
            data[2] = response.data;
            loadMoreDataStatic(2);
        }
        
    }

    const onSearch = (searchText) => {
        console.log(searchText);
        getRelationalCountries(searchText);
    };

    const onSelect = (data) => {
        console.log('onSelect', data);
    };

    const children = [];
    const titles = [
        "Select-Box(Enum)",
        "Select-Box(API)",
        "Auto-Complete(API)",
        "DateRange"
    ]

    const staticHandleSelect = (val) => {
        
    }
    const dynamicHandleSelect = (val) => {
        
    }

    async function getDynamicSelectValues() {
        const response = await axios.get(`http://localhost:5232/api/Country/GetAll?limit=${Countries.length}`);
        let i = 0;

        let newArr = [];
        response.data.forEach(country => {
            dynamicOptions.push(
                <Option key={`option${i}`} value={`${country.name}`}>{country.name}</Option>
            )
            newArr.push({name : country.name})
            i++;
        })

        data[1] = newArr;
        loadMoreDataStatic(1);
        setDynamicOptions(dynamicOptions);
        console.log(dynamicOptions);
    }
    
    const dynamicSelectClick = () => {
        if (data[1].length === 0) {
            console.log();
            getDynamicSelectValues();
        }
        
    }

    let staticOptions = []
    for (let i = 0; i < Countries.length; i++) {
        staticOptions.push(
            <Option key={`option${i}`} value={`${Countries[i].name}`}>{Countries[i].name}</Option>
        );
    }

    const handleSelectPopup = (e) => {
        console.log(e);
    }

    const items = [
        <Select
            onChange={staticHandleSelect}
        >
            {
                staticOptions
            }
        </Select>,
        <Select
            onChange={dynamicHandleSelect}
            onClick={dynamicSelectClick}
            onPopupScroll={handleSelectPopup}
        >
            <>
                {
                    dynamicOptions
                }
            </>
        </Select>,
        <AutoComplete
            onSelect={onSelect}
            onSearch={onSearch}
            placeholder="type country name"
        >
            {
                data[2].map(country => 
                    <Option key={`option${country.id}`} value={`${country.name}`}>{country.name}</Option> 
                )
            }
        </AutoComplete>,
        <RangePicker 
            style={{
                width:"100%"
            }}
        />
    ]
    children.push(
        <div
            style={{
                width: "50%",
                transform: "translateX(50%)",
                marginBottom: "2em"
            }}
        >
            <Title style={{textAlign:"center"}}>{"List(Enum)"}</Title>
            <div
                id={`scrollableDiv`}
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={data[0].length}
                    next={() => loadMoreDataStatic(0)}
                    hasMore={data[0].length < Countries.length && data[0].length > 5}
                    loader={
                        <Skeleton
                            style={{
                                width:"100%"
                            }}
                            paragraph={{
                                rows: 0
                            }}
                            title={{
                                width:"100%"
                            }}
                            active
                        />
                    }
                    scrollableTarget={`scrollableDiv`}
                >
                    <List
                        dataSource={data[0]}
                        renderItem={(item) => (
                            <List.Item key={item.name}>
                                <div>{item.name}</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>
    )
    for (let i = 0; i < 4; i++) {
        children.push(
            <Col span={12} offset={6} key={`col${i}`}>
                <Title style={{textAlign:"center"}}>{titles[i]}</Title>
                <Form.Item
                    label={i === 3 ? "Date" : "Country"}
                >
                    <Form.Item
                        name={i === 3 ? "date" : `country${i+1}`}
                    >
                        {
                            items[i]
                        }
                    </Form.Item>
                </Form.Item>
            </Col>
        );
    }
    

    return children;
};


function FormPage() {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([Countries.slice(0,10),[],[]]);
    const [dynamicOptions, setDynamicOptions] = useState([]);

    const loadMoreDataStatic = (list_i) => {
        if (loading) {
          return;
        }

        let newData = [data[0],data[1],data[2]];
        if (list_i == 0) {
            newData[list_i] = Countries.slice(0, data[list_i].length+10);
        }

        setData(newData);
        setLoading(false);
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
        >
            <Row gutter={24}>
                {
                    getFields(data, setData, loadMoreDataStatic, dynamicOptions, setDynamicOptions)
                }
            </Row>
        </Form>
    )
}

export default FormPage;