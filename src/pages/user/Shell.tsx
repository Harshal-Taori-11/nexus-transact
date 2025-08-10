import { AppLayout } from "@/components/AppLayout";
import { Outlet } from "react-router-dom";

export default function UserShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export { };
