import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Profile from "@/pages/Profile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import RedirectAfterAuth from "@/pages/RedirectAfterAuth";
import UserShell, { Accounts, Buy, Sell, UserHome, UserTransactions } from "@/pages/user/Shell";
import AdminShell, { AdminPending, AdminTransactions } from "@/pages/admin/Shell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/redirect" element={<RedirectAfterAuth />} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route element={<ProtectedRoute roles={["ROLE_USER"]} />}>
              <Route path="/user" element={<UserShell />}>
                <Route path="home" element={<UserHome />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="transactions" element={<UserTransactions />} />
                <Route path="buy" element={<Buy />} />
                <Route path="sell" element={<Sell />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
              <Route path="/admin" element={<AdminShell />}>
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="pending" element={<AdminPending />} />
              </Route>
            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
