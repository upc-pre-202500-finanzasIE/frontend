import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    const isAuthenticated = localStorage.getItem("authToken") !== null; // Check if token exists in localStorage
    console.log("Is authenticated:", isAuthenticated); // Log authentication status

    return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;