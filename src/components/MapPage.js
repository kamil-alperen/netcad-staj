import React, { useEffect, useState } from "react";
import Map, {Source, Layer} from "react-map-gl";
import { Button } from 'antd';
import store from "../Store";
let token = "pk.eyJ1Ijoia2FtaWxhbHBlcmVuIiwiYSI6ImNsODJ4eG0wODAwZmEzb29leXV3MW85MzgifQ.tFEAukFpWFqBMubOcokQEg";

let globalSetGeojson;
let clickedButton;

const topButtonStyle = {
    borderRadius:"0px", 
    border:"1px solid black", 
    width:"7em"
};
  
const pointLayerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf'
    }
};

const lineLayerStyle = {
    id: 'route',
    type: 'line',
    paint: {
        'line-color': '#000',
        'line-width': 8
    }
}

const polygonLayerStyle = {
    id: 'maine',
    type: 'fill',
    layout: {},
    paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5
    }
}

const handlePoint = (long, lat) => {
    console.log("Handle Point");
    let features = [...store.getState().features];
    let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
    features.push(newFeature)
    globalSetGeojson({
        type: 'FeatureCollection',
        features: features
    });
}

const handleLine = (long, lat) => {
    let features = [...store.getState().features];
    let longLat = [...store.getState().longLat];
    let singlePoint = longLat.length === 2;
    if (!singlePoint) {
        console.log("first point");
        let longLat = [long, lat];
        store.dispatch({type : "LONGLAT", payload : longLat})

        let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    } else {
        console.log("second point");
        let coordinates = [[longLat[0], longLat[1]]];
        let initial_i = coordinates[0][0];
        let initial_j = coordinates[0][1];
        let multiply_i = (long - initial_i) / 100;
        let multiply_j = (lat - initial_j) / 100;
        for (let k = 1; k < 100; k++) {
            let newPoint = [initial_i + multiply_i * k, initial_j + multiply_j * k];
            coordinates.push(newPoint);
        }
        store.dispatch({type : "LONGLAT", payload : []})
        features.pop();
        let newFeature = {type: 'Feature', geometry: {type: 'LineString', coordinates: coordinates}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    }
    
}

let polygonCount = 0;

const handlePolygon = (long, lat) => {
    let features = [...store.getState().features];
    let longLat = [...store.getState().longLat];
    if (longLat.length === 0) {
        polygonCount = 0;
        console.log("first point");
        let longLat = [[long, lat]];
        store.dispatch({type : "LONGLAT", payload : longLat})

        let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    } else if (longLat.length === 1) {
        polygonCount++;
        console.log("second point");
        let newLongLat = [longLat[0],[long, lat]];
        store.dispatch({type : "LONGLAT", payload : newLongLat})

        let coordinates = [longLat[0]];
        let initial_i = coordinates[0][0];
        let initial_j = coordinates[0][1];
        let multiply_i = (long - initial_i) / 100;
        let multiply_j = (lat - initial_j) / 100;
        for (let k = 1; k < 100; k++) {
            let newPoint = [initial_i + multiply_i * k, initial_j + multiply_j * k];
            coordinates.push(newPoint);
        }

        features.pop();
        let newFeature = {type: 'Feature', geometry: {type: 'LineString', coordinates: coordinates}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    } else {
        polygonCount++;
        console.log("other points");
        let newLongLat = [longLat[0],[long, lat]];
        store.dispatch({type : "LONGLAT", payload : newLongLat})
        let prevCoordinates = polygonCount === 2 
                                ? features[features.length - 1].geometry.coordinates 
                                : features[features.length - 1].geometry.coordinates[0];
        console.log(prevCoordinates);

        let coordinates = [longLat[1]];
        let initial_i = coordinates[0][0];
        let initial_j = coordinates[0][1];
        let multiply_i = (long - initial_i) / 100;
        let multiply_j = (lat - initial_j) / 100;
        for (let k = 1; k < 100; k++) {
            let newPoint = [initial_i + multiply_i * k, initial_j + multiply_j * k];
            coordinates.push(newPoint);
        }

        prevCoordinates.push(...coordinates);
        features.pop();
        let newFeature = {type: 'Feature', geometry: {type: 'Polygon', coordinates: [prevCoordinates]}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features,
            updated : polygonCount
        });

    }
    
}

const handleClick = (e) => {
    const [long, lat] = [e.lngLat.lng, e.lngLat.lat];

    switch(clickedButton) {
        case "Point":
            handlePoint(long, lat);
            break;
        case "Line":
            handleLine(long, lat);
            break;
        case "Polygon":
            handlePolygon(long, lat);
            break;
        default:
            break;
    }
    

    
}

const buttonClick = (e) => {
    clickedButton = e.target.innerText;
    store.dispatch({type : "LONGLAT", payload : []})
    const [point, line, polygon] = [document.getElementById("point"), document.getElementById("line"), document.getElementById("polygon")];
    switch(clickedButton) {
        case "Point":
            point.style.backgroundColor = 'blue';
            line.style.backgroundColor = 'rgb(24,144,255)';
            polygon.style.backgroundColor = 'rgb(24,144,255)';
            break;
        case "Line":
            point.style.backgroundColor = 'rgb(24,144,255)';
            line.style.backgroundColor = 'blue';
            polygon.style.backgroundColor = 'rgb(24,144,255)';
            break;
        case "Polygon":
            point.style.backgroundColor = 'rgb(24,144,255)';
            line.style.backgroundColor = 'rgb(24,144,255)';
            polygon.style.backgroundColor = 'blue';
            break;
        default:
            break;
    }

}

let polygonArray = [
    [
        [28.97, 41.01],
        [28.98, 41.01],
        [28.99, 41.01],
        [29.00, 41.01],
        [29.01, 41.01],
        [29.02, 41.01],
        [29.03, 41.01],
        [29.04, 41.01],
        [29.04, 41.01],
        [29.04, 41.02],
        [29.04, 41.03],
        [29.04, 41.04],
        [29.04, 41.05],
        [29.04, 41.06],
        [29.04, 41.07],
        [29.04, 41.08],
        [29.04, 41.08],
        [29.03, 41.08],
        [29.02, 41.08],
        [29.01, 41.08],
        [29.00, 41.08],
        [28.99, 41.08],
        [28.98, 41.08],
        [28.97, 41.08],
        [28.97, 41.08],
        [28.97, 41.07],
        [28.97, 41.06],
        [28.97, 41.05],
        [28.97, 41.04],
        [28.97, 41.03],
        [28.97, 41.02],
        [28.97, 41.01],
    ]
    
];

const MapPage = () => {
    const [viewport, setViewport] = useState({
        latitude : 41.01,
        longitude : 28.97,
        width : "100vw",
        height : "100vh",
        zoom : 10
    });

    const [geojson, setGeojson] = useState({
        type: 'FeatureCollection',
        features: [
            {type: 'Feature', geometry: {type: 'Polygon', coordinates: []}}
        ]
    });
    globalSetGeojson = setGeojson;
    console.log(geojson.features);
    
    store.dispatch({type : "FEATURE", payload : geojson.features})
    
    /* const [pointData, lineData, polygonData] = [
        {
            type: 'FeatureCollection',
            features: [
                {type: 'Feature', geometry: {type: 'Point', coordinates: []}}
            ]
        },
        {
            type: 'FeatureCollection',
            features: [
                {type: 'Feature', geometry: {type: 'LineString', coordinates: []}}
            ]
        },
        {
            type: 'FeatureCollection',
            features: [
                {type: 'Feature', geometry: {type: 'Polygon', coordinates: []}}
            ]
        }
    ]; */

    /* geojson.features.forEach(feature => {
        let type = feature.geometry.type;
        switch(type) {
            case "Point":
                pointData.features.push({type: 'Feature', geometry: {type: 'Point', coordinates: feature.geometry.coordinates}})
                break;
        }
    }) */

    return (
        <div>
            <div style={{display:"flex", justifyContent:"center"}}>
                <Button id="point" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Point
                </Button>
                <Button id="line" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Line
                </Button>
                <Button id="polygon" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Polygon
                </Button>
            </div>
            <Map 
                initialViewState={viewport}
                style={{width: "100%", height: "75vh"}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={token}
                onClick={handleClick}
            >
                <Source id="my-data" type="geojson" data={geojson}>
                    <Layer {...pointLayerStyle} />
                    <Layer {...lineLayerStyle} />
                    <Layer {...polygonLayerStyle} />
                </Source>
            </Map>
        </div>
    )

}

export default MapPage;