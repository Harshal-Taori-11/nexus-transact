import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/api/client";
import { useToast } from "@/hooks/use-toast";

export type Transaction = {
  transactionId: string;
  amount: number;
  tokens: number;
  rate: number;
  type: "BUY" | "SELL";
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: string;
};

export default function AdminTransactions() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [newRate, setNewRate] = useState<string>("");

  const load = async () => {
    try {
      const [list, r] = await Promise.all([
        apiFetch<Transaction[]>(`/api/admin/transactions`, { token }),
        apiFetch<number>(`/api/user/rate`, { token }),
      ]);
      setTxs(list);
      setRate(r);
      setNewRate(String(r));
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  const updateRate = async () => {
    const r = Number(newRate);
    if (!r || r <= 0) return toast({ title: "Enter valid rate", variant: "destructive" });
    try {
      await apiFetch(`/api/admin/rate`, { method: 'PUT', token, headers: { rate: String(r) } });
      toast({ title: "Rate updated" });
      load();
    } catch (e: any) {
      toast({ title: "Failed to update rate", description: e.message, variant: "destructive" });
    }
  };

  const buys = useMemo(() => txs.filter(t=>t.type==='BUY'), [txs]);
  const sells = useMemo(() => txs.filter(t=>t.type==='SELL'), [txs]);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Token Rate</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <div>Current: <span className="font-semibold">{rate}</span></div>
          <Input value={newRate} onChange={(e)=>setNewRate(e.target.value)} className="max-w-[140px]" />
          <Button onClick={updateRate}>Update</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Buy Transactions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buys.map((tx)=> (
                <TableRow key={tx.transactionId}>
                  <TableCell>{tx.transactionId}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{tx.tokens}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.rate}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-3">Sell Transactions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sells.map((tx)=> (
                <TableRow key={tx.transactionId}>
                  <TableCell>{tx.transactionId}</TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{tx.tokens}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.rate}</TableCell>
                  <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
