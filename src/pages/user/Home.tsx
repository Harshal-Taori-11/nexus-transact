import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/api/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UserNav from "./UserNav";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [b, r] = await Promise.all([
          apiFetch<number>(`/api/user/${userId}/tokens`, { token }),
          apiFetch<number>(`/api/user/rate`, { token }),
        ]);
        setBalance(b);
        setRate(r);
      } catch (e: any) {
        toast({ title: "Failed to load data", description: e.message, variant: "destructive" });
      }
    };
    load();
  }, [token, userId, toast]);

  return (
    <div>
      <UserNav />
      <Card>
        <CardHeader>
          <CardTitle>Your Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-2xl font-semibold">{balance}</div>
          <div className="text-muted-foreground">Current Rate: {rate}</div>
          <div className="flex gap-3">
            <Button onClick={()=>navigate('/user/buy')}>Buy Tokens</Button>
            <Button variant="outline" onClick={()=>navigate('/user/sell')}>Sell Tokens</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
