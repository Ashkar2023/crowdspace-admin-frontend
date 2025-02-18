import React from 'react';
import { Link } from 'react-router-dom';
import { axiosPrivate } from '../../service/api';
import { useDispatch } from 'react-redux';
import { clearAdmin, setAdmin } from '../../state/slices/adminSlice';

const Sidebar = ({ isOpen }) => {
    const dispatch = useDispatch();

    const handleLogout = async(e)=>{
        try{
            // const response = await axiosPrivate.get("/admin/auth/logout");
            dispatch(clearAdmin());
        }catch(error){
            console.log(error.message)
        }
    }

    return (
        <div className={`bg-gray-800 text-white w-64 min-h-screen ${isOpen ? 'block' : 'hidden'} md:block`}>
            <div className="p-4">
                <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            </div>
            <nav className="mt-4 ">
                <Link to="/dashboard" className="block py-2 px-4 text-sm hover:bg-gray-700">
                    Dashboard
                </Link>
                <Link to="/users" className="block py-2 px-4 text-sm hover:bg-gray-700">
                    Users
                </Link>
                <Link to="/reports" className="block py-2 px-4 text-sm hover:bg-gray-700">
                    Reports
                </Link>
            </nav>
            <div className="w-full text-red-500">
                <button className="block w-full py-2 px-4 text-sm hover:bg-gray-700 text-left" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;