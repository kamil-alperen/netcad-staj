import { Card } from 'antd';
import Product from './Product';
import React from "react";


const ProductList = (props) => {
    const {productList} = props;
    let productComponentList = [];

    for(let i = 0;i < productList.length;i++) {
        let keys = [];
        for (let j = 0;j < productComponentList.length; j++) {
            keys.push(productComponentList[j].key);
        }
        if (!keys.includes(i.toString())) {
            productComponentList.push(<Product key={i} {...productList[i]}></Product>)
        }
    }

    return (
        <Card title="Products">
            {
                productComponentList
            }
        </Card>
    )
}

export default ProductList;
