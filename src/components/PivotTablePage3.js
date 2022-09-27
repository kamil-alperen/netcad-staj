import 'webdatarocks/webdatarocks.css'
import * as WebDataRocksReact from 'react-webdatarocks';
import tr_json from "../json/PivotTableReport_tr.json";
import localization_tr from "../json/Localization_tr.json";
import { useEffect } from 'react';
import {Columns, Data} from "../Data/PivotTable3";

let new_tr_json = {
    dataSource : {
        data : []
    },
    slice : {
        rows : [], // 1
        columns : [], // 2
        measures : [], // 3
        options : tr_json.options,
        format : tr_json.format
    }
};


const pivotReady = () => {
    document.getElementById("wdr-tab-connect").style.display = "none";
    document.getElementById("wdr-tab-open").style.display = "none";
    document.getElementById("wdr-tab-save").style.display = "none";
    document.getElementById("wdr-tab-export-pdf").style.display = "none";
    
}

function PivotTable() {
    let columnNameList = [];
    let columnPositionList = [];
    Columns.forEach(column => {
        columnNameList.push(column.DisplayName);
        columnPositionList.push(column.StatisticsType);
    })

    for (let i = 0; i < Data.length; i++) {
        let data = {};
        for (let j = 0; j < columnNameList.length; j++) {
            data[columnNameList[j]] = Data[i][j];
        }
        new_tr_json.dataSource.data.push(data);
    }

    for (let i = 0; i < columnNameList.length; i++) {
        switch (columnPositionList[i]) {
            case 1:
                new_tr_json.slice.rows.push(
                    {
                        "uniqueName": columnNameList[i],
                        "sort": "asc"
                    }
                );
                break;
            case 2:
                new_tr_json.slice.columns.push(
                    {
                        "uniqueName": columnNameList[i],
                        "sort": "asc"
                    }
                );
                break;
            case 3:
                new_tr_json.slice.measures.push(
                    {
                        "uniqueName": columnNameList[i],
                        "aggregation": "sum"
                    }
                );
                break;
            default:
                break;
        }
    }
    
    return (
      <div className="App">
        <WebDataRocksReact.Pivot 
         toolbar={true}
         width="100%"
         report={new_tr_json}
         global={{
            localization : localization_tr
         }}
         ready={pivotReady}
        />
      </div>
    );
}

export default PivotTable;
