import { useDispatch } from "react-redux";
import { clearAdmin } from "../state/slices/adminSlice";
import { axiosPrivate } from "../service/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"
import UserTable from "../components/ui/users.table";
import Sidebar from "../components/ui/sidebar";

const Dashboard = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false)
    const [postCount, setPostCount] = useState(0);
    const toggleSidebar = () => setIsOpen(!isOpen)

    useEffect(() => {
        try {
            (async function () {
                const { data } = await axiosPrivate.get("/admin/dashboard");

                setPostCount(data.body.postCount);
            })()
        } catch (error) {
            console.log(error.message)
        }
    }, [])

    const handleLogout = async (e) => {
        try {
            const { data } = await axiosPrivate.get("/admin/logout");
            if (data.success)
                dispatch(clearAdmin());

        } catch (error) {
            console.log(error.message)
        }
    };

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Total Posts */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold mb-2">Total Posts</h2>
                            <p className="text-4xl font-bold">{postCount}</p>
                        </div>
                        {/* Total Users */}
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                            <p className="text-4xl font-bold">150</p>
                        </div>
                        {/* Live Count */}
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold mb-2">Live Count</h2>
                            <p className="text-4xl font-bold">8</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard