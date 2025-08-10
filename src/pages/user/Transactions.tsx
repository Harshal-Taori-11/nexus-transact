import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import UserNav from "./UserNav";
import { Button } from "@/components/ui/button";

export type Transaction = {
  transactionId: string;
  amount: number;
  tokens: number;
  rate: number;
  type: "BUY" | "SELL";
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: string;
};

export default function UserTransactions() {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"PENDING"|"COMPLETED"|"REJECTED">("PENDING");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch<Transaction[]>(`/api/transactions/user/${userId}`, { token });
        setTxs(res);
      } catch (e: any) {
        toast({ title: "Failed to load transactions", description: e.message, variant: "destructive" });
      }
    };
    load();
  }, [token, userId, toast]);

  const filtered = useMemo(() => txs.filter(t => t.status === filter), [txs, filter]);

  return (
    <div>
      <UserNav />
      <div className="flex gap-2 mb-4">
        {(["COMPLETED","PENDING","REJECTED"] as const).map(s => (
          <Button key={s} variant={filter===s?"default":"outline"} onClick={()=>setFilter(s)}>{s}</Button>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(tx => (
              <TableRow key={tx.transactionId}>
                <TableCell>{tx.transactionId}</TableCell>
                <TableCell>{tx.type}</TableCell>
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
  );
}
