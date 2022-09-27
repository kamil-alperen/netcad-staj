import React from 'react';
import { Route } from 'react-router-dom';

const Home = React.lazy(() => import('../components/HomePage'));
const Admin = React.lazy(() => import('../components/AdminPage'));
const AdminCreate = React.lazy(() => import('../components/AdminCreatePage'));
const Map = React.lazy(() => import('../components/MapPage'));
const PivotTable1 = React.lazy(() => import('../components/PivotTablePage1'));
const PivotTable2 = React.lazy(() => import('../components/PivotTablePage2'));
const PivotTable3 = React.lazy(() => import('../components/PivotTablePage3'));
const Form = React.lazy(() => import('../components/FormPage'));
const Login = React.lazy(() => import('../components/LoginPage'));
const PdfFile = React.lazy(() => import('../components/PdfFilePage'));
const PdfViewer = React.lazy(() => import('../components/PdfViewerPage'));

export const MainRoutes = [
    <Route key="home" path='/home' element={<Home/>} />,
    <Route key="admin" path='/admin' element={<Admin/>} />,
    <Route key="admin_create" path='/admin/create' element={<AdminCreate/>} />,
    <Route key="map" path='/map' element={<Map/>} />,
    <Route key="pivot-table1" path='/pivot-table1' element={<PivotTable1/>} />,
    <Route key="pivot-table2" path='/pivot-table2' element={<PivotTable2/>} />,
    <Route key="pivot-table3" path='/pivot-table3' element={<PivotTable3/>} />,
    <Route key="form" path='/form' element={<Form/>} />,
    <Route key="login" path='/login' element={<Login/>} />,
    <Route key="pdffile" path='/pdffile' element={<PdfFile/>} />,
    <Route key="pdfviewer" path='/pdfviewer' element={<PdfViewer/>} />,
    
];