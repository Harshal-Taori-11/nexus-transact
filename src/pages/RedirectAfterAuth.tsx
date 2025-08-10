import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/auth/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectAfterAuth() {
  const { role } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role === 'ROLE_ADMIN') navigate('/admin/transactions', { replace: true });
    else navigate('/user/home', { replace: true });
  }, [role, navigate]);
  return (
    <AppLayout>
      <div>Redirecting...</div>
    </AppLayout>
  );
}
