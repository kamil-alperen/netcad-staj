import React from "react";
import axios from "axios";
import Businesses from "../json/Businesses.json"

async function Post(business) {
    business.id = business.objectid;
    delete business.objectid;
    const response = axios.post("http://localhost:5232/api/Login/AddBusiness", business);
    console.log(response);
}

export default () => {
    console.log(Businesses);
    Businesses.forEach(business => {
        Post(business);
    })
}