import React, { useEffect, useState } from 'react'
import { Typography, Button, CircularProgress } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { fetchUsers } from '../../state/slices/adminSlice';
import axios from '../../service/api';
import { shallowCompare } from '../../helpers/objectUtils';

const EditUserModal = ({ open, handleClose, user }) => {
    const dispatch = useDispatch();
    const [error,setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData,setFormdata] = useState({
        email:'',
        username:''
    });

    useEffect(()=>{
        setFormdata({
            email: user?.email,
            username: user?.username,
        });
    },[user]);

    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1/3,
        bgcolor: 'background.paper',
        borderRadius: '5px',
        boxShadow: 24,
        p: 4,
    };
    
    const handleChange = (e)=>{
        setFormdata({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(!shallowCompare(formData, user)){
            try{
                setLoading(true)
                const response = await axios.post(`/admin/edituser/${user.id}`,formData);
                if(response.data.success){
                    dispatch(fetchUsers());
                }
            }catch(error){
                setError(error.message)
                setTimeout(()=>{
                    setError("");
                },3000);
                console.log(error.message)
            }finally{
                setLoading(false)
            }
        }else{   
            setError("The values have not been modified!");
            setTimeout(()=>{
                setError("");
            },3000);
            return ;
        }

        
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h3" textAlign="center" fontFamily={"Teko"}>Edit User</Typography>
                <p className='text-rose-600 font-teko-300 tracking-wide text-center h-4'>{error}</p>
                <form className="grid grid-cols-1 gap-4 p-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input defaultValue={formData.email} onChange={handleChange}  type="email" name="email" id="email" className="w-full px-3 py-2 border-2 border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input defaultValue={formData.username} onChange={handleChange} type="text" name="username" id="username" className="block w-full px-3 py-2 border-2 border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <Button variant='contained' type='submit' className='w-1/2 place-self-center'>{loading ? <CircularProgress color='inherit' size={"1.5rem"} /> : "Submit"}</Button>
                </form>
            </Box>
        </Modal>
    )
}

export default EditUserModal