import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser } from "@redux/action/authAction";


const intialState = {
    user : undefined,
    isError : false,
    isLoading : false,
    isSuccess : false,
    loggedIn : false,
    isTokenThere: false,
    message : "",
    profileFetched : false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
}


const authSlice = createSlice({
    name : "auth",
    initialState : intialState,
    reducers : {
        reset : (state) => { intialState},
        handleLoginUser : (state) => {
            state.message = "hello"
        },
        emptyMessage : (state) => {
            state.message = ""
        },
        setIsTokenThere : (state) => {
            state.isTokenThere = true
        },
        setIsTokenNotThere : (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => {

        builder 
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.message = "knocking the door..."
        })
        .addCase(loginUser.fulfilled, (state) => {
            
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.loggedIn = true,
            state.message = " Login Succcessfully !"
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false,
            state.isError = true,
            state.message = action.payload
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.message = "knocking the door..."
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.loggedIn = false,
            state.message = {
                message : "Registration Successfull !",
                data : action.payload
            }
        })
        .addCase(registerUser.rejected, (state, action) => {

            state.isLoading = false,
            state.isError = true,
            state.message = action.payload
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {  
            state.isLoading = false,
            state.isError = false,
            state.profileFetched = true,
            state.user = action.payload.userProfile, // Changed from action.payload.profile
            state.connections = action.payload.connections,
            state.connectionRequest = action.payload.connectionRequest
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {  
            state.isLoading = false,
            state.isError = false,
            state.all_profiles_fetched = true,
            state.all_users = action.payload.profiles
        })
    }
})

// export const {reset, handleLoginUser, handleRegisterUser, emptyMessage} = authSlice.actions;

// export const {user} = authSlice;

export const { reset, emptyMessage, setIsTokenNotThere, setIsTokenThere } = authSlice.actions;
export const { handleLoginUser } = authSlice.actions;

export default authSlice.reducer;