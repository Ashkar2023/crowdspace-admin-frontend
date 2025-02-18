import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom';
import LoginPage from "./pages/loginPage"
import ReportsPage from "./pages/reports.page"

import AdminPublicRoute from './components/adminPublicRoute';
import Dashboard from './pages/dashboardPage';
import { NextUIProvider } from '@nextui-org/react';
import { AdminProtectedRoute } from './components/adminProtectedRoute';
import UsersPage from './pages/usersPage';

function App() {

    const router = createBrowserRouter([
        {
            path: "/login",
            element: (
                <AdminPublicRoute>
                    <LoginPage />
                </AdminPublicRoute>
            )
        },
        {
            path: "/users",
            element: (<AdminProtectedRoute>
                <UsersPage />
            </AdminProtectedRoute>)
        },
        {
            path: "/reports",
            element: (<AdminProtectedRoute>
                <ReportsPage />
            </AdminProtectedRoute>)
        },
        {
            path:"/dashboard",
            element: (<AdminProtectedRoute>
                <Dashboard />
            </AdminProtectedRoute>)
        },
        {
            path: "*",
            element: (<Navigate to={"/login"} replace></Navigate>)
        }
    ])

    return (
        <NextUIProvider>
            <RouterProvider router={router} />
        </NextUIProvider>
    )
}

export default App
