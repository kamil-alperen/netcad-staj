import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import store from "../Store";
import {getProductsFromServer as gpfs} from "../App"

let allData = []

async function getProductsFromServer(originData, setOriginData) {
    const response = await axios.get("http://localhost:5232/api/Product/Get");
    allData = response.data;

    let all_bools = true;
    let bool1 = originData["length"] == allData["length"];
    if (bool1) {
        for(let i = 0; i < allData.length; i++) {
            let keys = Object.keys(allData[i]);
            for (const key of keys) {
                if (allData[i][key] !== originData[i][key]) {
                    all_bools = false;
                    break;
                }
            }
            if (!all_bools) break;
        }
    } else {
        all_bools = false;
    }

    if (!all_bools) {
        let newOriginData = [];
        for (let i = 0; i < allData.length; i++) {
            newOriginData.push({
                key: i.toString(),
                id: allData[i].id,
                model: allData[i].model,
                memory: allData[i].memory,
                cpu: allData[i].cpu,
                price: allData[i].price,
                description: allData[i].description,
                image: allData[i].image,
            });
        }

        setOriginData(newOriginData);
    }
    
}

async function updateProductToServer(request, originData, setOriginData) {
    axios.post("http://localhost:5232/api/Product/Save", request)
    .then(response => {
        getProductsFromServer(originData, setOriginData);
    })
}

async function deleteProductFromServer(id, originData, setOriginData) {
    axios.delete(`http://localhost:5232/api/Product/Delete?id=${id}`)
    .then(response => {
        getProductsFromServer(originData, setOriginData);
    })
    
}


const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Admin = () => {
    const [originData, setOriginData] = useState([]);
    getProductsFromServer(originData, setOriginData);
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(originData);
        store.dispatch(gpfs);
    }, [originData])
    const [form] = Form.useForm();

    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            model: "",
            memory: "",
            cpu: "",
            price: 0,
            description: "",
            image: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const deleteRecord = (record) => {
        deleteProductFromServer(record.id, originData, setOriginData);
    }

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
                row.id = item.id;
                updateProductToServer(row, originData, setOriginData);
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };



    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            width: '12%',
            editable: true,
        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            width: '12%',
            editable: true,
        },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            width: '12%',
            editable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: '12%',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '22%',
            editable: true,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            width: '18%',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'Operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Update
                        </Typography.Link>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => deleteRecord(record)} style={{ position: "absolute", right: "10%" }}>
                            Delete
                        </Typography.Link>
                    </>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'Price' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Link to="/admin/create"><Button type="primary" style={{ marginBottom: "5px" }}><PlusOutlined /> Add Product</Button></Link>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};

export default Admin;