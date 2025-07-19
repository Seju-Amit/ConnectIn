import React from "react";
// import axios from "axios";

const { default : axios } = require("axios");

export const BASE_URL = "http://localhost:8000";

const clientServer = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json"
    }
});

const api = axios.create({
    baseURL: "http://localhost:8000",
});

const apiPrivate = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

export default clientServer;
