import React from "react";
import { navBar } from "@components/Navbar";

const UserLayout = ({ children }) => {
    return (
        <div>
            {navBar()}
            {children}
        </div>
    )
} 

export default UserLayout