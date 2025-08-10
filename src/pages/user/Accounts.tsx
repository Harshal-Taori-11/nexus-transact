import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/auth/AuthContext";
import { apiFetch } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import UserNav from "./UserNav";

export type Upi = { id?: number; upiId: string };
export type Bank = { id?: number; accountNumber: string; ifscCode: string; bankName: string };

type Primary = Upi | Bank | null;

export default function Accounts() {
  const { token, userId } = useAuth();
  const { toast } = useToast();
  const [upis, setUpis] = useState<Upi[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [primary, setPrimary] = useState<Primary>(null);
  const [newUpi, setNewUpi] = useState("");
  const [newBank, setNewBank] = useState({ accountNumber: "", ifscCode: "", bankName: "" });

  const totalAccounts = upis.length + banks.length;

  const loadAll = async () => {
    try {
      const [u, b, p] = await Promise.all([
        apiFetch<Upi[]>(`/api/accounts/upi/${userId}`, { token }),
        apiFetch<Bank[]>(`/api/accounts/banks/${userId}`, { token }),
        apiFetch<Primary>(`/api/accounts/primary/${userId}`, { token }),
      ]);
      setUpis(u);
      setBanks(b);
      setPrimary(p);
    } catch (e: any) {
      toast({ title: "Failed to load accounts", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => { loadAll(); }, []);

  const addUpi = async () => {
    if (!newUpi) return;
    try {
      await apiFetch(`/api/accounts/upi/${userId}`, { method: 'POST', token, body: { upiId: newUpi } });
      setNewUpi("");
      toast({ title: "UPI added" });
      loadAll();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const addBank = async () => {
    const { accountNumber, ifscCode, bankName } = newBank;
    if (!accountNumber || !ifscCode || !bankName) return;
    try {
      await apiFetch(`/api/accounts/bank/${userId}`, { method: 'POST', token, body: newBank });
      setNewBank({ accountNumber: "", ifscCode: "", bankName: "" });
      toast({ title: "Bank added" });
      loadAll();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const delUpi = async (id?: number) => {
    if (totalAccounts <= 1) return toast({ title: "Cannot delete last account", variant: "destructive" });
    try {
      await apiFetch(`/api/accounts/upi/${id}/${userId}`, { method: 'DELETE', token });
      toast({ title: "UPI deleted" });
      loadAll();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const delBank = async (id?: number) => {
    if (totalAccounts <= 1) return toast({ title: "Cannot delete last account", variant: "destructive" });
    try {
      await apiFetch(`/api/accounts/bank/${id}/${userId}`, { method: 'DELETE', token });
      toast({ title: "Bank deleted" });
      loadAll();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const setPrimaryAcc = async (accountId: number) => {
    try {
      await apiFetch(`/api/accounts/set-primary/${userId}`, { method: 'PUT', token, headers: { primaryId: String(accountId) } });
      toast({ title: "Primary updated" });
      loadAll();
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const isPrimaryUpi = (u: Upi) => (primary as any)?.upiId && (primary as any).upiId === u.upiId;
  const isPrimaryBank = (b: Bank) => (primary as any)?.accountNumber && (primary as any).accountNumber === b.accountNumber;

  return (
    <div>
      <UserNav />

      <Card className="p-4 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Add UPI ID</Label>
            <div className="flex gap-2">
              <Input placeholder="user@upi" value={newUpi} onChange={(e)=>setNewUpi(e.target.value)} />
              <Button onClick={addUpi}>Add</Button>
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Add Bank Account</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Account Number" value={newBank.accountNumber} onChange={(e)=>setNewBank(v=>({ ...v, accountNumber: e.target.value }))} />
              <Input placeholder="IFSC" value={newBank.ifscCode} onChange={(e)=>setNewBank(v=>({ ...v, ifscCode: e.target.value }))} />
              <Input placeholder="Bank Name" value={newBank.bankName} onChange={(e)=>setNewBank(v=>({ ...v, bankName: e.target.value }))} />
            </div>
            <div className="mt-2"><Button onClick={addBank}>Add</Button></div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-medium mb-3">UPIs</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UPI ID</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upis.map((u, idx) => (
                <TableRow key={(u as any).id ?? idx}>
                  <TableCell>{u.upiId}</TableCell>
                  <TableCell>{isPrimaryUpi(u) ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="flex gap-2">
                    {!isPrimaryUpi(u) && <Button size="sm" variant="outline" onClick={()=> setPrimaryAcc((u as any).id)}>
                      Set Primary
                    </Button>}
                    <Button size="sm" variant="destructive" onClick={()=> delUpi((u as any).id)} disabled={totalAccounts<=1}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-3">Banks</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>IFSC</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map((b, idx) => (
                <TableRow key={(b as any).id ?? idx}>
                  <TableCell>{b.accountNumber}</TableCell>
                  <TableCell>{b.ifscCode}</TableCell>
                  <TableCell>{b.bankName}</TableCell>
                  <TableCell>{isPrimaryBank(b) ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="flex gap-2">
                    {!isPrimaryBank(b) && <Button size="sm" variant="outline" onClick={()=> setPrimaryAcc((b as any).id)}>
                      Set Primary
                    </Button>}
                    <Button size="sm" variant="destructive" onClick={()=> delBank((b as any).id)} disabled={totalAccounts<=1}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
