import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Lock, LayoutDashboard, FolderHeart, MessageSquareHeart, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isAdminAuthed, setAdminPassword, clearAdminPassword, verifyPassword } from "@/lib/admin";
import { AdminMemories } from "@/components/admin/AdminMemories";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { cn } from "@/lib/utils";

type Tab = "memories" | "messages" | "settings";

const Admin = () => {
  const [authed, setAuthed] = useState(isAdminAuthed());
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("memories");
  const { toast } = useToast();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await verifyPassword(pw);
    setLoading(false);
    if (ok) {
      setAdminPassword(pw);
      setAuthed(true);
      toast({ title: "Welcome back ❤️" });
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const logout = () => {
    clearAdminPassword();
    setAuthed(false);
    setPw("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romance p-4">
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={login}
          className="w-full max-w-md bg-card rounded-3xl shadow-card-romance p-10 border border-primary/20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-rose-grad shadow-glow mb-4">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-script text-4xl text-gradient-rose">Admin Access</h1>
            <p className="text-muted-foreground text-sm mt-2">Enter the secret password</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
                className="mt-1.5"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-rose-grad text-primary-foreground">
              {loading ? "Verifying..." : "Unlock ❤️"}
            </Button>
          </div>
        </motion.form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "memories", label: "Memories", icon: FolderHeart },
    { id: "messages", label: "Messages", icon: MessageSquareHeart },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card-grad border-r border-primary/10 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="h-6 w-6 fill-primary text-primary" />
          <span className="font-script text-2xl text-gradient-rose">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                tab === t.id ? "bg-rose-grad text-primary-foreground shadow-soft" : "hover:bg-secondary/60 text-foreground/80"
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <Button variant="ghost" onClick={logout} className="justify-start gap-3">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h2 className="font-script text-4xl text-gradient-rose capitalize">{tab}</h2>
          </div>
          {tab === "memories" && <AdminMemories />}
          {tab === "messages" && <AdminMessages />}
          {tab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
