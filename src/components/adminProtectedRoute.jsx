import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({children}) => {
    const isLoggedIn = useSelector(state => state.admin.isLoggedIn);

    return (
        isLoggedIn ? children : <Navigate to="/login" />
    )
}

