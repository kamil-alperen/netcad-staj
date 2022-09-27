import { PivotViewComponent,FieldList,Inject } from "@syncfusion/ej2-react-pivotview";
import React from "react";
 
import '../css/PivotTable2.css';
 
let pivot_data = [
    { 'Sold': 313, 'Amount': 32232, 'Country': 'Canada', 'Products': 'Xiaomi Redmi 9 Power', 'Year': 'FY 2015', 'Quarter': 'Q1' },
    { 'Sold': 451, 'Amount': 232423, 'Country': 'Japan', 'Products': 'Xiaomi Redmi Note 10 Pro', 'Year': 'FY 2015', 'Quarter': 'Q2' },
    { 'Sold': 100, 'Amount': 24143534, 'Country': 'Germany', 'Products': 'Realme Narzo 30A', 'Year': 'FY 2015', 'Quarter': 'Q3' },
    { 'Sold': 671, 'Amount': 24435, 'Country': 'Switzerland', 'Products': 'Samsung Galaxy A52', 'Year': 'FY 2015', 'Quarter': 'Q4' },
    { 'Sold': 227, 'Amount': 434352, 'Country': 'Australia', 'Products': 'Samsung Galaxy F62', 'Year': 'FY 2016', 'Quarter': 'Q1' }
];
export default function App() {
    return (
        <div>
            <PivotViewComponent
                dataSourceSettings={{
                    dataSource:pivot_data ,
                    values:[
                        {name:"Sold",caption:"Sold Unit"},
                        {name:"Amount",caption:"Sold Amount"},
                    ],
                    rows:[
                        {name:"Country"},
                        {name:"Products"}
                    ],
                    columns:[
                        {name:"Year"},
                        {name:"Quarter"}
                    ],
                    filters:[
                        {name:"Quarter"}
                    ]
                }}
                showFieldList={true}
                height={'500'}
                width={'100%'}
            >
                <Inject services={[FieldList]}></Inject>
            </PivotViewComponent>
        </div>
    )
}