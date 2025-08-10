import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<{ message: string; userId: number; token: string }>(
        "/auth/signup",
        { method: "POST", body: { name, email, phoneNumber, password } }
      );
      login({ token: res.token, userId: res.userId });
      toast({ title: "Account created", description: res.message });
      navigate("/redirect");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
            <Input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <Input placeholder="Phone number" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">Create account</Button>
            <div className="text-sm text-muted-foreground">Have an account? <Link to="/login" className="underline">Login</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
