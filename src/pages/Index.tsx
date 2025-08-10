import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="text-center px-4">
        <h1 className="text-4xl font-bold mb-2">TokenFlow</h1>
        <p className="text-lg text-muted-foreground mb-8">Simple, secure token transactions.</p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild><Link to="/login">Login</Link></Button>
          <Button variant="outline" asChild><Link to="/signup">Sign up</Link></Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
