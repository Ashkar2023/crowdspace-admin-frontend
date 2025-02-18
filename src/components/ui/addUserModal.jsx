import { Button, CircularProgress, Typography } from '@mui/material';
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { addUserShchema } from '../../schema';
import axios from '../../service/api';
import { fetchUsers } from '../../state/slices/adminSlice';

const AddUserModal = ({ open, setOpen2 }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { values, handleSubmit, handleBlur, handleChange, touched, errors, resetForm } = useFormik({
        initialValues: {
            email: "",
            password: "",
            username: "default"
        },
        validationSchema: addUserShchema,
        onSubmit,
    })

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1 / 3,
        bgcolor: 'background.paper',
        borderRadius: '5px',
        boxShadow: 24,
        p: 4,
    };

    async function onSubmit() {
        try {
            setLoading(true);
            const response = await axios.post('/admin/adduser', values);
            if (response.data.success) {
                dispatch(fetchUsers());
                resetForm();
                setOpen2(false)
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={()=>{setOpen2(false);resetForm();}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h3" textAlign="center" fontFamily={"Teko"}>Add User</Typography>
                <p className='text-rose-600 font-teko-300 tracking-wide text-center h-4'>{error}</p>
                <form className="grid grid-cols-1 gap-1 p-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input onChange={handleChange} onBlur={handleBlur} type="email" name="email" id="email" className={`w-full px-3 py-2 border-2 border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.email?"animate-slideUp":"mb-4"}`} />
                        {errors.email && touched.email && <p className='text-sm text-red-600 text-end animate-slideIn'>{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input onChange={handleChange} onBlur={handleBlur} type="password" name="password" id="password" className={`w-full px-3 py-2 border-2 border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.password?"animate-slideUp":"mb-4"}`} />
                        {errors.password && touched.password && <p className={`text-sm text-red-600 text-end animate-slideIn`}>{errors.password}</p>}
                    </div>
                    <Button variant='contained' type='submit' className='w-1/2 place-self-center'>{loading ? <CircularProgress color='inherit' size={"1.5rem"} /> : "Submit"}</Button>
                </form>
            </Box>
        </Modal>
    )
}

export default AddUserModal