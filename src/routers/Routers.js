import React from 'react';
import { Route } from 'react-router-dom';

const Home = React.lazy(() => import('../components/HomePage'));
const Admin = React.lazy(() => import('../components/AdminPage'));
const AdminCreate = React.lazy(() => import('../components/AdminCreatePage'));
const Map = React.lazy(() => import('../components/MapPage'));

export const MainRoutes = [
    <Route key="home" path='/home' element={<Home/>} />,
    <Route key="admin" path='/admin' element={<Admin/>} />,
    <Route key="admin_create" path='/admin/create' element={<AdminCreate/>} />,
    <Route key="map" path='/map' element={<Map/>} />
    
];