
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ContextApi/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? element : <Navigate to="/login" state={{ alert: 'You need to log in to access this page.' }} />;
};

export default ProtectedRoute;
