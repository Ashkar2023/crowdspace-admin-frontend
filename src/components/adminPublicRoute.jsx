import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminPublicRoute = ({ children }) => {
    const { isLoggedIn } = useSelector(state => state.admin);

    console.log(isLoggedIn);

    return (
        isLoggedIn ? <Navigate to="/users" /> : children
    )
}

export default AdminPublicRoute