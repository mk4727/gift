import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Upload, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { adminCall, fileToBase64 } from "@/lib/admin";

type FolderRow = { id: string; title: string; cover_image: string | null };
type ImageRow = { id: string; image_url: string; media_type?: string };

export const AdminMemories = () => {
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [active, setActive] = useState<FolderRow | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const loadFolders = async () => {
    const { data } = await supabase.from("folders").select("*").order("created_at", { ascending: false });
    setFolders(data ?? []);
  };
  const loadImages = async (folderId: string) => {
    const { data } = await supabase.from("images").select("*").eq("folder_id", folderId).order("uploaded_at", { ascending: false });
    setImages(data ?? []);
  };

  useEffect(() => { loadFolders(); }, []);
  useEffect(() => { if (active) loadImages(active.id); }, [active]);

  const createFolder = async () => {
    if (!newTitle.trim()) return;
    try {
      await adminCall("create_folder", { title: newTitle });
      setNewTitle("");
      await loadFolders();
      toast({ title: "Folder created ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  const deleteFolder = async (id: string) => {
    if (!confirm("Delete this folder and all its images?")) return;
    try {
      await adminCall("delete_folder", { id });
      await loadFolders();
      if (active?.id === id) setActive(null);
      toast({ title: "Folder deleted" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  const saveTitle = async (id: string) => {
    try {
      const folder = folders.find((f) => f.id === id);
      await adminCall("update_folder", { id, title: editTitle, cover_image: folder?.cover_image });
      setEditingId(null);
      await loadFolders();
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || !active) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const base64 = await fileToBase64(file);
        const res = await adminCall("upload_image", {
          folder_id: active.id,
          file_base64: base64,
          filename: file.name.replace(/[^\w.-]/g, "_"),
          content_type: file.type,
        });
        // Set as cover if no cover yet (only for images)
        if (!active.cover_image && res?.data?.image_url && file.type.startsWith("image/")) {
          await adminCall("update_folder", { id: active.id, title: active.title, cover_image: res.data.image_url });
          setActive({ ...active, cover_image: res.data.image_url });
        }
      }
      await loadImages(active.id);
      await loadFolders();
      toast({ title: "Uploaded ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await adminCall("delete_image", { id });
      if (active) await loadImages(active.id);
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  if (active) {
    return (
      <div>
        <button onClick={() => setActive(null)} className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to folders
        </button>
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h3 className="font-script text-3xl">{active.title}</h3>
          <label className="cursor-pointer">
            <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => uploadImages(e.target.files)} />
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-grad text-primary-foreground rounded-lg shadow-soft text-sm font-medium">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload images / videos"}
            </span>
          </label>
        </div>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No images yet. Upload some!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-soft aspect-square bg-romance">
                {img.media_type === "video" ? (
                  <video src={img.image_url} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                )}
                <button onClick={() => deleteImage(img.id)} className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-card-grad rounded-2xl p-6 border border-primary/10 mb-6">
        <Label>Create new folder</Label>
        <div className="flex gap-2 mt-2">
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Goa Trip, Birthday, Cafe Date..." />
          <Button onClick={createFolder} className="bg-rose-grad text-primary-foreground gap-2">
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      </div>

      {folders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No folders yet. Create your first one above!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((f) => (
            <div key={f.id} className="bg-card rounded-2xl overflow-hidden shadow-soft border border-primary/10">
              <div className="aspect-[4/3] bg-romance cursor-pointer" onClick={() => setActive(f)}>
                {f.cover_image ? <img src={f.cover_image} alt={f.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="p-4">
                {editingId === f.id ? (
                  <div className="flex gap-2">
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-sm" />
                    <Button size="sm" onClick={() => saveTitle(f.id)}>Save</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setActive(f)} className="font-medium text-left flex-1 hover:text-primary">{f.title}</button>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(f.id); setEditTitle(f.title); }} className="p-1.5 hover:bg-secondary rounded">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteFolder(f.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
