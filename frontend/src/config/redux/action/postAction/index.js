import clientServer from "@config/index";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const res = await clientServer.get("/all_posts");
            return thunkAPI.fulfillWithValue(res.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createPost = createAsyncThunk(
    "post/createPost",
    async (postData, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append('token', postData.token);
            formData.append('body', postData.body);
            if (postData.media) {
                formData.append('media', postData.media);
            }
            
            const response = await clientServer.post('/create_post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // After creating a post, fetch all posts again
            thunkAPI.dispatch(getAllPosts());
            
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);