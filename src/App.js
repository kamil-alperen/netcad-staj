import React, { useState } from 'react';
import { Link, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Avatar } from 'antd';
import { MainRoutes } from './routers/Routers';
import { Provider } from 'react-redux';
import store from './Store';
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;

const { SubMenu } = Menu;

export async function getProductsFromServer(dispatch, getState) {
  const response = await axios.get("http://localhost:5232/api/Product/Get");
  dispatch({ type : "UPDATE", payload : response.data}); 
}

store.dispatch(getProductsFromServer);

const navbarItems1 = [
  {
    label: 'Mail',
    key: 'mail',
    icon: <MailOutlined />,
  }
]

const navbarItems2 = [
  {
    icon: <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
  }
]

const App = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const onClick = (e) => {

  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="Home" icon={<PieChartOutlined/>}><Link to="/home">Home</Link></Menu.Item>
            <Menu.Item key="Admin" icon={<DesktopOutlined/>}><Link to="/admin">Admin</Link></Menu.Item>
            <Menu.Item key="Map" icon={<GlobalOutlined />}><Link to="/map">Map</Link></Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Menu onClick={onClick} selectedKeys={[]} mode="horizontal" items={navbarItems1}/>
    
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>{""}</Breadcrumb.Item>
            <Breadcrumb.Item>{""}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

const AppLayout = () => {
  return (
    <Router>  
      <Provider store={store}>
        <App>
          <React.Suspense fallback="loading">
              <Routes>
                {MainRoutes}
              </Routes>
          </React.Suspense>
        </App>
      </Provider>
    </Router>
  );
}

export default AppLayout;