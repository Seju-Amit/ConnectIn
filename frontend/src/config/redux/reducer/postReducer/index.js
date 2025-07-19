import { getAllPosts, createPost } from "@config/redux/action/postAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    LoggedIn: false,
    message: "",
    comments: [],
    postId: "",
};

const postSlice = createSlice({
    name: "post",
    initialState: initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = "";
        },
        refreshPosts: (state) => {
            // This will be handled by the extraReducers
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching the posts...";
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.postFetched = true;
                state.posts = action.payload.posts;
                state.message = "Fetched the posts successfully!";
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
                state.message = "Creating post...";
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = "Post created successfully!";
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetPostId, refreshPosts } = postSlice.actions;
export default postSlice.reducer;
