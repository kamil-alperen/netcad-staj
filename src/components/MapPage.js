import React, { useEffect, useState, useCallback } from "react";
import Map, {Source, Layer} from "react-map-gl";
import { Button } from 'antd';
import store from "../Store";
import axios from "axios";
let token = "pk.eyJ1Ijoia2FtaWxhbHBlcmVuIiwiYSI6ImNsODJ4eG0wODAwZmEzb29leXV3MW85MzgifQ.tFEAukFpWFqBMubOcokQEg";

let globalSetGeojson;
let globalSetSourceList;
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
        'line-color': '#000000',
        'line-dasharray' : [1,1,1,1,1,1,1,1,1,1,1,1],
        'line-width': 8
    }
}

const polygonLayerStyle = {
    id: 'area',
    type: 'fill',
    layout: {},
    paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
        'fill-outline-color' : '#000000'
    }
}

const handlePoint = (long, lat) => {
    let features = [...store.getState().features];
    let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
    features.push(newFeature)
    console.log("set");
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
        let longLat = [long, lat];
        store.dispatch({type : "LONGLAT", payload : longLat})

        let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    } else {
        setSources(true);
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
        let longLat = [[long, lat]];
        store.dispatch({type : "LONGLAT", payload : longLat})

        let newFeature = {type: 'Feature', geometry: {type: 'Point', coordinates: [long, lat]}};
        features.push(newFeature);
        globalSetGeojson({
            type: 'FeatureCollection',
            features: features
        });
    } else if (longLat.length === 1) {
        setSources(true);
        polygonCount++;
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
        setSources(true);
        polygonCount++;
        let newLongLat = [longLat[0],[long, lat]];
        store.dispatch({type : "LONGLAT", payload : newLongLat})
        let prevCoordinates = polygonCount === 2 
                                ? features[features.length - 1].geometry.coordinates 
                                : features[features.length - 1].geometry.coordinates[0];

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

async function getAllPolygons() {
    let polygonsCoordinates = [];
    let features = [...store.getState().features];
    const response = await axios.get('http://localhost:5232/api/Place/GetAll');
    
    response.data.forEach(d => {
        let longAdd = 27 + Math.random() * 17;
        let latAdd = 36 + Math.random() * 11;
        if (d.location.type === "Polygon") {
            d.location.coordinates[0].forEach(c => {
                c[0] += longAdd;
                c[1] += latAdd;
            })
            polygonsCoordinates.push(d.location.coordinates);
        }
    })

    polygonsCoordinates = polygonsCoordinates;

    polygonsCoordinates.forEach(coordinate => {

        let newFeature = {type: 'Feature', geometry: {type: 'Polygon', coordinates: coordinate}};
        features.push(newFeature);
    })
    
    polygonCount++;
    globalSetGeojson({
        type: 'FeatureCollection',
        features: features,
        updated : polygonCount
    });
}

const buttonClick = (e) => {
    let buttonNames = ['Point', 'Line', 'Polygon'];
    if (buttonNames.includes(e.target.innerText)) {
        clickedButton = e.target.innerText;
    }
    store.dispatch({type : "LONGLAT", payload : []})
    const [point, line, polygon] = [document.getElementById("point"), document.getElementById("line"), document.getElementById("polygon")];
    switch(e.target.innerText) {
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
        case "Delete":
            globalSetGeojson({
                type: 'FeatureCollection',
                features: [
                    {type: 'Feature', geometry: {type: 'Point', coordinates: []}}
                ]
            });
            break;
        case "Get All":
            getAllPolygons();
            break;
        default:
            break;
    }

}

async function getPolygon(polygonName) {
    let features = [...store.getState().features];
    const response = await axios.get(`http://localhost:5232/api/Place/Get?name=${polygonName}`);

    let longAdd = 27 + Math.random() * 17;
    let latAdd = 36 + Math.random() * 11;
    if (response.data.location.type === "Polygon") {
        let coordinates = response.data.location.coordinates;
        console.log(coordinates);
        coordinates[0].forEach(c => {
            c[0] += longAdd;
            c[1] += latAdd;
        })

        let newFeature = {type: 'Feature', geometry: {type: 'Polygon', coordinates: coordinates}};
        features.push(newFeature);
    }
    
    polygonCount++;
    globalSetGeojson({
        type: 'FeatureCollection',
        features: features,
        updated : polygonCount
    });
}

function setSources(removeLast) {
    let sources = [];
    let features = [...store.getState().features];

    let sourceCount = 0;
    let length = features.length;
    features.forEach(feature => {
        if (removeLast && sourceCount === length-1) {
            globalSetSourceList(sources);
            return;
        }
        let layerStyle;
        let colors;
        switch(feature.geometry.type) {
            case "Point":
                layerStyle = pointLayerStyle;
                break;
            case "LineString":
                layerStyle = lineLayerStyle;
                colors = "";
                for (let i = 0;i < 6;i++) {
                    let newColor = parseInt(Math.random()*15);
                    if (newColor > 9) {
                        newColor = String.fromCharCode(97 + (newColor - 10))
                    }
                    colors += newColor;
                }
                layerStyle.paint["line-color"] = '#'+colors;
                break;
            case "Polygon":
                layerStyle = polygonLayerStyle;
                colors = "";
                for (let i = 0;i < 6;i++) {
                    let newColor = parseInt(Math.random()*15);
                    if (newColor > 9) {
                        newColor = String.fromCharCode(97 + (newColor - 10))
                    }
                    colors += newColor;
                }
                layerStyle.paint["fill-color"] = '#'+colors;
                break;
            default:
                break;
        }
        layerStyle.id = `layer${sourceCount}`;

        let data = {
            type: 'FeatureCollection',
            features: [
                {type: 'Feature', geometry: {type: feature.geometry.type, coordinates: feature.geometry.coordinates}}
            ]
        }

        sources.push(
            <Source key={`key${sourceCount}`} id={`source${sourceCount}`} type="geojson" data={data}>
                <Layer {...layerStyle}></Layer>
            </Source>
        )
        
        sourceCount++;

    })
    console.log(sources);
    globalSetSourceList(sources);
}

const MapPage = () => {
    const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey) {
            switch(event.key) {
                case "z":
                    console.log("square");
                    getPolygon("square");
                    break;
                case "x":
                    console.log("triangle");
                    getPolygon("triangle");
                    break;
                default:
                    break;
            }
        }
    }, []); // runs only once
    
    useEffect(() => {
        // willMount - willUpdate
        document.addEventListener('keydown', handleKeyPress);

        // willUnmount
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]); // if updates
    const [viewport, setViewport] = useState({
        latitude : 41.01,
        longitude : 28.97,
        width : "100vw",
        height : "100vh",
        zoom : 5
    });

    const [geojson, setGeojson] = useState({
        type: 'FeatureCollection',
        features: [
            {type: 'Feature', geometry: {type: 'Point', coordinates: []}}
        ]
    });

    const [sourceList, setSourceList] = useState([]);

    useEffect(() => {
        setSources(false);
    }, [geojson])

    globalSetGeojson = setGeojson;
    globalSetSourceList = setSourceList;
    
    store.dispatch({type : "FEATURE", payload : geojson.features})

    return (
        <div>
            <div style={{display:"flex", justifyContent:"center"}}>
                <Button id="get" size="large" style={{...topButtonStyle, marginRight: "10px"}} onClick={buttonClick}>
                    Get All
                </Button>
                <Button id="point" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Point
                </Button>
                <Button id="line" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Line
                </Button>
                <Button id="polygon" type="primary" size="large" style={topButtonStyle} onClick={buttonClick}>
                    Polygon
                </Button>
                <Button id="delete" size="large" style={{...topButtonStyle, marginLeft: "10px"}} onClick={buttonClick}>
                    Delete
                </Button>
            </div>
            <Map 
                initialViewState={viewport}
                style={{width: "100%", height: "75vh"}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={token}
                onClick={handleClick}
            >
                {
                    sourceList
                }
            </Map>
        </div>
    )

}

export default MapPage;