import { useDispatch } from "react-redux";
import { clearAdmin } from "../state/slices/adminSlice";
import { axiosPrivate } from "../service/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"
import UserTable from "../components/ui/users.table";
import Sidebar from "../components/ui/sidebar";

const UsersPage = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false)
    const [postCount, setPostCount] = useState(0);
    const toggleSidebar = () => setIsOpen(!isOpen)

    // const handleLogout = async (e) => {
    //     try {
    //         const { data } = await axiosPrivate.get("/admin/logout");
    //         if (data.success)
    //             dispatch(clearAdmin());

    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // };

    return (
        <div className="flex h-screen">

            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
                    <button onClick={toggleSidebar} className="md:hidden">
                        <MenuIcon />
                    </button>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                    <UserTable />
                </main>
            </div>
        </div>
    )
}

export default UsersPage