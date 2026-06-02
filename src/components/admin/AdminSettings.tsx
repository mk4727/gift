import { useEffect, useState } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { adminCall, fileToBase64 } from "@/lib/admin";

export const AdminSettings = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [since, setSince] = useState("");
  const [letter, setLetter] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("settings").select("key,value");
    data?.forEach((s) => {
      if (s.key === "hero_image") setHeroImage(s.value);
      if (s.key === "hero_quote") setQuote(s.value ?? "");
      if (s.key === "together_since") setSince(s.value ?? "");
      if (s.key === "secret_letter") setLetter(s.value ?? "");
    });
  };
  useEffect(() => { load(); }, []);

  const uploadHero = async (file: File) => {
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await adminCall("upload_hero", {
        file_base64: base64,
        filename: file.name.replace(/[^\w.-]/g, "_"),
        content_type: file.type,
      });
      setHeroImage(res.url);
      toast({ title: "Hero photo updated ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await adminCall("update_setting", { key, value });
      toast({ title: "Saved ❤️" });
    } catch (e: any) { toast({ title: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <section className="bg-card-grad rounded-2xl p-6 border border-primary/10">
        <Label className="text-base">Hero couple photo</Label>
        <p className="text-sm text-muted-foreground mb-4">Big photo on the homepage</p>
        {heroImage && <img src={heroImage} alt="" className="w-48 aspect-[4/5] object-cover rounded-xl mb-3 shadow-soft" />}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-rose-grad text-primary-foreground rounded-lg shadow-soft text-sm font-medium">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadHero(e.target.files[0])} />
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload photo"}
        </label>
      </section>

      <section className="bg-card-grad rounded-2xl p-6 border border-primary/10 space-y-3">
        <Label className="text-base">Hero quote</Label>
        <Input value={quote} onChange={(e) => setQuote(e.target.value)} />
        <Button size="sm" onClick={() => saveSetting("hero_quote", quote)} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
      </section>

      <section className="bg-card-grad rounded-2xl p-6 border border-primary/10 space-y-3">
        <Label className="text-base">Together since (date)</Label>
        <Input type="date" value={since} onChange={(e) => setSince(e.target.value)} />
        <Button size="sm" onClick={() => saveSetting("together_since", since)} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
      </section>

      <section className="bg-card-grad rounded-2xl p-6 border border-primary/10 space-y-3">
        <Label className="text-base">Secret love letter</Label>
        <Textarea value={letter} onChange={(e) => setLetter(e.target.value)} rows={6} />
        <Button size="sm" onClick={() => saveSetting("secret_letter", letter)} className="gap-1"><Save className="h-3.5 w-3.5" /> Save</Button>
      </section>
    </div>
  );
};
