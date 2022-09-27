import 'webdatarocks/webdatarocks.css'
import * as WebDataRocksReact from 'react-webdatarocks';
import tr_json from "../json/PivotTableReport_tr.json";
import en_json from "../json/PivotTableReport_en.json";
import localization_tr from "../json/Localization_tr.json";

function PivotTable() {
    console.log(tr_json);
    return (
      <div className="App">
        <WebDataRocksReact.Pivot 
         toolbar={true}
         width="100%"
         report={tr_json}
         global={{
            localization : localization_tr
         }}
        />
      </div>
    );
}

export default PivotTable;
