import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userId, isLoaded, sessionClaims } = useAuth();

   if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <Navigate to="/" />;
  }

  const userRole = sessionClaims?.publicMetadata?.role;
  console.log('User Role:', userRole);

    if (!userRole) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
