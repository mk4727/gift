import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, LayoutDashboard, FolderHeart, MessageSquareHeart, LogOut, Settings as SettingsIcon, Menu, X } from "lucide-react";
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
  const [navOpen, setNavOpen] = useState(false);
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
          className="w-full max-w-md bg-card rounded-3xl shadow-card-romance p-6 sm:p-10 border border-primary/20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-rose-grad shadow-glow mb-4">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-script text-3xl sm:text-4xl text-gradient-rose">Admin Access</h1>
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

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 fill-primary text-primary" />
        <span className="font-script text-2xl text-gradient-rose">Admin</span>
      </div>
      <nav className="space-y-1 flex-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setNavOpen(false); }}
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
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-card-grad border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-primary text-primary" />
          <span className="font-script text-xl text-gradient-rose">Admin</span>
        </div>
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-lg hover:bg-secondary/60"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-card-grad border-r border-primary/10 p-6 flex-col">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] bg-card-grad border-r border-primary/10 p-6 flex flex-col"
            >
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Close menu"
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-secondary/60"
              >
                <X className="h-5 w-5" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="font-script text-3xl md:text-4xl text-gradient-rose capitalize">{tab}</h2>
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
