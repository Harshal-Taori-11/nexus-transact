import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/api/client";
import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; email: string; phone: string; token: number } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/user/profile", { token });
        setData(res);
        setName(res.name);
        setEmail(res.email);
      } catch (e: any) {
        toast({ title: "Failed to load profile", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, toast]);

  const onSave = async () => {
    try {
      const res = await apiFetch("/api/user/profile", { method: "PATCH", token, body: { name, email } });
      setData(res);
      toast({ title: "Profile updated" });
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No profile data</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input value={data.phone} disabled />
          </div>
          <div>
            <label className="text-sm">Tokens</label>
            <Input value={String(data.token ?? 0)} disabled />
          </div>
        </div>
        <Button onClick={onSave}>Save</Button>
      </CardContent>
    </Card>
  );
}
