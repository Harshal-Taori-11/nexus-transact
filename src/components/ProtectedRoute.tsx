import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export const ProtectedRoute: React.FC<{ roles?: ("ROLE_USER"|"ROLE_ADMIN")[] }> = ({ roles }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && role && !roles.includes(role)) {
    return <Navigate to={role === 'ROLE_ADMIN' ? '/admin/transactions' : '/user/home'} replace />;
  }
  return <Outlet />;
};
