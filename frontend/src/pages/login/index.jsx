// import React, { useEffect, useState } from 'react'
// import UserLayout from 'src/layout/UserLayout'
// import { useSelector, useDispatch } from 'react-redux'
// import { useRouter } from 'next/router'
// import styles from './style.module.css'
// import { loginUser, registerUser, emptyMessage, user } from 'src/config/redux/reducer/authReducer'

import React, { useEffect, useState } from "react";
import UserLayout from "@layout/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser } from "@redux/action/authAction";
import { registerUser } from "@redux/action/authAction";
import { emptyMessage } from "@redux/reducer/authReducer";


function LoginComponent() {

    const authState = useSelector(state => state.auth);

    const router = useRouter();

    const dispatch = useDispatch();

    const [userLoginMethod, setUserLoginMethod] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (authState.loggedIn) {
            router.push("/dashboard")
        }
    }, [authState])

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login")
        }
    }, [])

    useEffect(() => {
        dispatch(emptyMessage());
    }, [userLoginMethod])

    /*************  ✨ Command ⭐  *************/
    /**
     * Handles the login process by dispatching the loginUser action with the user's
     * email and password. If successful, the user will be redirected to the dashboard.
     */

    /*******  3e244ff1-875e-4f79-bcc4-b1ed795223d1  *******/

    const handleLogin = () => {
        console.log("logging in...");
        // setUserLoginMethod(false);
        dispatch(loginUser({ email, password }));
    }


    const handleRegister = () => {
        console.log("registering...");
        // setUserLoginMethod(false);
        dispatch(registerUser({ username, email, password, name }));
    }

    return (
        <UserLayout>
            <div className={styles.container}>
                <div className={styles.cardContainer}>

                    <div className={styles.cardContainer_left}>

                        <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign in" : "Sign Up"}</p><br /><br />
                        {authState.message && <p style={{ color: authState.isError ? "red" : "green" }}>{typeof authState.message === "object" ? authState.message.message : authState.message}</p>}
                        <div className={styles.inputContainer}>

                            {!userLoginMethod && <div className={styles.inputRow}>
                                <input onChange={(e) => { setUsername(e.target.value) }} className={styles.inputfield} type="text" placeholder='Username' />
                                <input onChange={(e) => { setName(e.target.value) }} className={styles.inputfield} type="text" placeholder='Name' />
                            </div>}

                            <input onChange={(e) => { setEmail(e.target.value) }} className={styles.inputfield} type="text" placeholder='Email' />
                            <input onChange={(e) => { setPassword(e.target.value) }} className={styles.inputfield} type="password" placeholder='Password' />

                            <div onClick={() => { userLoginMethod ? handleLogin() : handleRegister() }}
                                className={styles.buttonOutline}>
                                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                            </div>
                        </div>

                    </div>
                    <div className={styles.cardContainer_right}>
                        <p>{userLoginMethod ? "Don't have an account?" : "Already have an account?"}

                            <button onClick={() => { setUserLoginMethod(!userLoginMethod) }}
                                className={styles.buttonOutline}>
                                <p>{!userLoginMethod ? "Sign In" : "Sign Up"}</p>
                            </button>
                        </p>
                    </div>
                </div>
            </div>

        </UserLayout>
    )
}

export default LoginComponent