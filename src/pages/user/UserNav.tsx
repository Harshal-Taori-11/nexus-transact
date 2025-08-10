import { NavLink } from "react-router-dom";

export default function UserNav() {
  const base = "px-3 py-2 rounded-md text-sm font-medium";
  const active = "bg-accent";
  return (
    <nav className="flex gap-2 mb-6">
      <NavLink to="/user/home" className={({isActive})=>`${base} ${isActive?active:''}`}>Home</NavLink>
      <NavLink to="/user/accounts" className={({isActive})=>`${base} ${isActive?active:''}`}>Accounts</NavLink>
      <NavLink to="/user/transactions" className={({isActive})=>`${base} ${isActive?active:''}`}>Transactions</NavLink>
    </nav>
  );
}
