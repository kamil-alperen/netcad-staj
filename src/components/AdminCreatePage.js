import { Button, Form, Input, InputNumber } from 'antd';
import React from 'react';
import axios from 'axios';
import store from "../Store";
import {getProductsFromServer as gpfs} from "../App"

async function postProductToServer(request) {
    let keys = Object.keys(request);
    for (let key of keys) {
        Object.defineProperty(request, key.toLowerCase(), Object.getOwnPropertyDescriptor(request, key));
        delete request[key];
    }

    const response = await axios.post("http://localhost:5232/api/Product/Add", request);
    store.dispatch(gpfs);
}

const item = (fieldNames, count) => {
    return (
      <Form.Item
        name={`${fieldNames[count]}`}
        label={`${fieldNames[count]}`}
        rules={[
          {
            required: true
          },
        ]}
      >
        {
          fieldNames[count] !== "Price" && fieldNames[count] !== "Id" 
            ? <Input style={{width:"45%"}}/>
            : <InputNumber style={{width:"45%"}}/>
        }
      </Form.Item>
    )
}

const AdminCreate = () => {
  const [form] = Form.useForm();
  const fieldNames = [
    "Id",
    "Model",
    "Memory",
    "CPU",
    "Price",
    "Description",
    "Image"
  ]
  const onFinish = (values) => {
    postProductToServer(values);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {

  };

  const itemList = [];
  for (let i = 0;i < fieldNames.length; i++) {
    itemList.push(item(fieldNames, i));
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >

      {
        itemList
      }

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminCreate;
