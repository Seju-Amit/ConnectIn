import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "@config/index";

const loginUser = createAsyncThunk(
    "user/loginUser",
    async (user, thunkAPI) => {
        
        try {
            const request = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            })
            // console.log(response.data);
            if (request.data.token) {
                localStorage.setItem("token", request.data.token)
            } else {
                return thunkAPI.rejectWithValue({
                    message : "token not found"
                })
            }

            return thunkAPI.fulfillWithValue(request.data.token)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
        } 
    }
)


const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.post("/register", {
                name: user.name,
                email: user.email,
                password: user.password,
                username: user.username
            })
            return request.data.message
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)

const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/get_user_and_profile", {
                params: {
                    token:user.token
                }

            })
            console.log(request.data);
            return thunkAPI.fulfillWithValue(request.data)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)

export const getAboutUserConnections = createAsyncThunk(
    "user/getAboutUserConnections",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/get_connections", {
                params: {
                    token: user.token
                }

            })
            return thunkAPI.fulfillWithValue(request.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)


const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/user/get_All_Users")
            return thunkAPI.fulfillWithValue(request.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)

const getAllPosts = createAsyncThunk(
    "user/getAllPosts",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/user/get_All_Posts", {
                params: {
                    token: user.token
                }

            })
            return thunkAPI.fulfillWithValue(request.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)

const getAllConnections = createAsyncThunk(
    "user/getAllConnections",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/user/get_All_Connections", {
                params: {
                    token: user.token
                }

            })
            return thunkAPI.fulfillWithValue(request.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)

const getAllConnectionRequest = createAsyncThunk(
    "user/getAllConnectionRequest",
    async (user, thunkAPI) => {
        try {
            const request = await clientServer.get("/user/get_All_Connection_Request", {
                params: {
                    token: user.token
                }

            })
            return thunkAPI.fulfillWithValue(request.data)
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.request.data.message)
        } 
    }
)


export { loginUser, registerUser, getAboutUser, getAllUsers, getAllPosts, getAllConnections, getAllConnectionRequest };