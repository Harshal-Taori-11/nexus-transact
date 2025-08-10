import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import UserNav from "./UserNav";
import { ADMIN_BANK } from "@/constants/adminPayment";
import { useNavigate } from "react-router-dom";

export default function Buy() {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [rate, setRate] = useState<number>(0);
  const [tokens, setTokens] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch<number>("/api/user/rate", { token })
      .then(setRate)
      .catch((e)=> toast({ title: "Failed to fetch rate", description: e.message, variant: "destructive" }));
  }, [token, toast]);

  const amount = useMemo(() => {
    const t = Number(tokens || 0);
    if (isNaN(t) || t <= 0) return 0;
    return t * rate;
  }, [tokens, rate]);

  const onDone = async () => {
    const t = Number(tokens);
    if (!t || t <= 0) return toast({ title: "Enter valid tokens", variant: "destructive" });
    try {
      await apiFetch(`/api/transactions/buy/${userId}`, { method: 'POST', token, body: { amount, rate } });
      toast({ title: "Buy request sent" });
      navigate('/user/transactions');
    } catch (e: any) {
      toast({ title: "Buy failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <UserNav />
      <Card>
        <CardHeader>
          <CardTitle>Buy Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="font-medium mb-2">Admin Payment Details</div>
            <div className="text-sm">Bank: {ADMIN_BANK.bank.bankName} | A/C: {ADMIN_BANK.bank.accountNumber} | IFSC: {ADMIN_BANK.bank.ifscCode}</div>
            <div className="text-sm">UPI: {ADMIN_BANK.upi.upiId}</div>
          </div>
          <div className="text-muted-foreground">Current Rate: {rate}</div>
          <div className="grid gap-2 max-w-xs">
            <label className="text-sm">Tokens to buy</label>
            <Input value={tokens} onChange={(e)=>setTokens(e.target.value)} placeholder="e.g. 10" />
          </div>
          <div>Amount to pay: <span className="font-semibold">{amount}</span></div>
          <div className="flex gap-3">
            <Button onClick={onDone}>Done</Button>
            <Button variant="outline" onClick={()=>navigate('/user/home')}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
