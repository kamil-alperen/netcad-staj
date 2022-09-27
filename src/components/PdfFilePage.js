import { Space, Table, Tag, Button } from 'antd';
import React from 'react';
import { BASE_URL } from '../App';
import axios from 'axios';

async function getCodeAndSessionId() {
    const login = {
        userName:"netadmin",
        password:1
    }

    const response = await axios.post(`${BASE_URL}8080/gisapi/authentication/login`, login);
    const code = response.data.code;
    const sessionId = response.data.sessionId;

    const response2 = await axios.get(`${BASE_URL}8080/Netigma633/gisapi/v4/filearchive/show?code=${code}&sessionId=${sessionId}`)
    console.log(response2);
}

const handleClick = (e) => {
    getCodeAndSessionId();
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (text) => (
        <Button primary="true" onClick={handleClick}>{text}</Button>
    ),
  }
];
export const codesAndFiles = [
  {
    key: '1',
    name: 'computerdesign.pdf',
    action: 'Go to PDF',
  },
];
// https://bdpx.github.io/compilation/books/hp_caqa.pdf
const App = () => {
    return (
        <>
            <Table columns={columns} dataSource={codesAndFiles} />
        </>
    )
}

export default App;