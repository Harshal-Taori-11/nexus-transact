import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import UserNav from "./UserNav";
import { useNavigate } from "react-router-dom";

export default function Sell() {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch<number>(`/api/user/${userId}/tokens`, { token })
      .then(setBalance)
      .catch((e)=> toast({ title: "Failed to fetch balance", description: e.message, variant: "destructive" }));
  }, [token, userId, toast]);

  const onDone = async () => {
    const t = Number(tokens);
    if (!t || t <= 0) return toast({ title: "Enter valid tokens", variant: "destructive" });
    if (t > balance) return toast({ title: "Insufficient tokens", description: `You have ${balance}`, variant: "destructive" });
    try {
      await apiFetch(`/api/transactions/sell/${userId}`, { method: 'POST', token, body: { tokens: t } });
      toast({ title: "Sell request sent" });
      navigate('/user/transactions');
    } catch (e: any) {
      toast({ title: "Sell failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <UserNav />
      <Card>
        <CardHeader>
          <CardTitle>Sell Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-muted-foreground">Your balance: {balance}</div>
          <div className="grid gap-2 max-w-xs">
            <label className="text-sm">Tokens to sell</label>
            <Input value={tokens} onChange={(e)=>setTokens(e.target.value)} placeholder="e.g. 10" />
          </div>
          <div className="flex gap-3">
            <Button onClick={onDone}>Done</Button>
            <Button variant="outline" onClick={()=>navigate('/user/home')}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
