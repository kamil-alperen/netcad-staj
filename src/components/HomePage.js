import React from 'react';
import ProductList from './ProductList';
import store from "../Store";

export default () => {
    let productList = store.getState().productList;

    return (
        <ProductList productList={productList}/>
    )
}
