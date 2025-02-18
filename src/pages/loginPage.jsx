import React, { useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import axios, { axiosPrivate } from "../service/api.js";
import { setAdmin } from '../state/slices/adminSlice.js';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import axiosPublic from '../service/api.js';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formRef = useRef();
    const [formData, setFormData] = useState({
        credential: "",
        password: "",
        type: "email"// make dynamic
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPublic.post("/user/admin/login", formData);
            if (response.data.success) {
                dispatch(setAdmin({
                    email: response.data.body.email
                }));
                navigate("/dashboard");
                formRef.current.reset();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-purple-900">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <h3 className="text-3xl font-bold text-center">Admin Login</h3>
                    <p className="text-lg text-center">Enter your credentials to access the admin panel</p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} ref={formRef}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email">Email / Username</label>
                                <Input
                                    id="credential"
                                    name="credential"
                                    type="text"
                                    placeholder="admin@example.com"
                                    required
                                    value={formData.credential}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </form>
                </CardBody>
                <CardFooter>
                    <Button className="w-full" type="submit" onClick={handleSubmit}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
