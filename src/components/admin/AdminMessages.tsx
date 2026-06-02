import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { adminCall } from "@/lib/admin";

type Msg = { id: string; title: string; content: string; created_at: string };

export const AdminMessages = () => {
  const [list, setList] = useState<Msg[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState<Msg | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      await adminCall("create_message", { title, content });
      setTitle(""); setContent("");
      await load();
      toast({ title: "Message added ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await adminCall("delete_message", { id });
      await load();
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  const save = async () => {
    if (!editing) return;
    try {
      await adminCall("update_message", { id: editing.id, title: editing.title, content: editing.content });
      setEditing(null);
      await load();
      toast({ title: "Updated ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  return (
    <div>
      <div className="bg-card-grad rounded-2xl p-6 border border-primary/10 mb-6 space-y-3">
        <h3 className="font-medium">New message</h3>
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Missing you ❤️" className="mt-1.5" />
        </div>
        <div>
          <Label>Content</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your love note..." rows={3} className="mt-1.5" />
        </div>
        <Button onClick={create} className="bg-rose-grad text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Message
        </Button>
      </div>

      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className="bg-card rounded-2xl p-5 border border-primary/10 shadow-soft">
            {editing?.id === m.id ? (
              <div className="space-y-2">
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                <Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={3} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-script text-2xl text-gradient-rose">{m.title}</h4>
                  <p className="text-sm text-foreground/80 mt-1 whitespace-pre-line">{m.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(m)} className="p-2 hover:bg-secondary rounded-lg"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(m.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-muted-foreground py-12">No messages yet.</p>}
      </div>
    </div>
  );
};
