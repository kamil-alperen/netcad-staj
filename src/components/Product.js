import React from 'react';
import { Card, Checkbox  } from 'antd';

const gridStyle = {
    width: '33%',
    textAlign: 'center',
    display: 'inline-block'
};

const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
};

const Product =  (props) => {
    console.log("Product Component");
    return (
        <Card.Grid style={gridStyle}>
            <Card
                style={{
                    width: "auto"
                }}
                bodyStyle={{
                    justifyContent:"center"
                }}
                cover={
                    <img
                        alt="example"
                        src={props.image}
                    />
                }
                actions={[
                    <Checkbox onChange={onChange}>Add to Basket</Checkbox>
                ]}
            >
                <div>
                    <h1>{props.model}</h1>
                    <p>Memory : {props.memory}</p>
                    <p>CPU : {props.cpu}</p>
                    <p>{props.description}</p>
                    <h4>Price : {props.price}</h4>
                </div>
            </Card>
        </Card.Grid>
    );
}

export default Product;