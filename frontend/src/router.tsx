import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import StatisticsPage from './pages/StatisticsPage/StatisticsPage'
import AuthPage from './pages/AuthPage/AuthPage'
import { isAuthenticated } from './auth/storage'

const ProtectedLayout = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />
    }

    return <Layout />
}

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <ProtectedLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'statistics', element: <StatisticsPage /> },
        ],
    },
    {
        path: '/auth/login',
        element: <AuthPage mode="login" />,
    },
    {
        path: '/auth/register',
        element: <AuthPage mode="register" />,
    },
    {
        path: '*',
        element: <Navigate to="/auth/login" replace />,
    }
];