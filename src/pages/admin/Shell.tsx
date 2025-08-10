import { AppLayout } from "@/components/AppLayout";
import AdminTransactions from "@/pages/admin/Transactions";
import AdminPending from "@/pages/admin/Pending";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminShell() {
  return (
    <AppLayout>
      <nav className="flex gap-2 mb-6">
        <NavLink to="/admin/transactions" className={({isActive})=>`px-3 py-2 rounded-md text-sm font-medium ${isActive?'bg-accent':''}`}>Transactions</NavLink>
        <NavLink to="/admin/pending" className={({isActive})=>`px-3 py-2 rounded-md text-sm font-medium ${isActive?'bg-accent':''}`}>Pending</NavLink>
      </nav>
      <Outlet />
    </AppLayout>
  );
}

export { AdminTransactions, AdminPending };
