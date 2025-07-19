import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@redux/reducer/authReducer";
import postReducer from "@redux/reducer/postReducer";

/**
 * STEPS for State Managenment 
 * Submit Action
 * Handle action in its reducer
 * Register Here -> Reducer >- Result >- State
 * 
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  }
});

export default store;
