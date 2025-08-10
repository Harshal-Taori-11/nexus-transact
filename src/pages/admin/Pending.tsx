import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function AdminPending() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [txs, setTxs] = useState<Transaction[]>([]);

  const load = async () => {
    try {
      const list = await apiFetch<Transaction[]>(`/api/admin/transactions`, { token });
      setTxs(list.filter(t=>t.status==='PENDING'));
    } catch (e: any) {
      toast({ title: "Failed to load", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (tx: Transaction) => {
    try {
      if (tx.type === 'BUY') {
        await apiFetch(`/api/admin/approveBuy/${tx.transactionId}`, { method: 'PUT', token });
      } else {
        const tId = window.prompt('Enter transactionId for payout:');
        if (!tId) return;
        await apiFetch(`/api/admin/approveSell/${tx.transactionId}`, { method: 'PUT', token, headers: { transactionId: tId } });
      }
      toast({ title: "Approved" });
      load();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const reject = async (tx: Transaction) => {
    try {
      await apiFetch(`/api/admin/fail/${tx.transactionId}`, { method: 'PUT', token });
      toast({ title: "Marked failed" });
      load();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Pending Transactions</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {txs.map((tx)=> (
            <TableRow key={tx.transactionId}>
              <TableCell>{tx.transactionId}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.tokens}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={()=>approve(tx)}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={()=>reject(tx)}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
