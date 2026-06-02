import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, ArrowLeft, ImageIcon, X, Download, Play } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

type FolderRow = { id: string; title: string; cover_image: string | null; created_at: string };
type ImageRow = { id: string; folder_id: string; image_url: string; uploaded_at: string; media_type?: string };

const Memories = () => {
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [activeFolder, setActiveFolder] = useState<FolderRow | null>(null);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [lightbox, setLightbox] = useState<ImageRow | null>(null);

  const downloadFile = async (url: string, suggestedName?: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = suggestedName || url.split("/").pop() || "memory";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setFolders(data ?? []));
  }, []);

  useEffect(() => {
    if (!activeFolder) return;
    supabase
      .from("images")
      .select("*")
      .eq("folder_id", activeFolder.id)
      .order("uploaded_at", { ascending: false })
      .then(({ data }) => setImages(data ?? []));
  }, [activeFolder]);

  return (
    <Layout>
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-script text-5xl md:text-7xl text-gradient-rose mb-3">Our Memories</h1>
          <p className="text-muted-foreground text-lg">Every moment, kept forever ❤️</p>
        </motion.div>

        {!activeFolder ? (
          folders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No memory folders yet. Create one in the admin panel.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((f, i) => (
                <motion.button
                  key={f.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setActiveFolder(f)}
                  className="group bg-card-grad rounded-3xl overflow-hidden shadow-soft border border-primary/10 text-left hover:shadow-card-romance transition-shadow"
                >
                  <div className="aspect-[4/3] bg-romance relative overflow-hidden">
                    {f.cover_image ? (
                      <img
                        src={f.cover_image}
                        alt={f.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-script text-2xl text-foreground">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(f.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )
        ) : (
          <div>
            <button
              onClick={() => setActiveFolder(null)}
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to folders
            </button>
            <h2 className="font-script text-4xl text-gradient-rose mb-6">{activeFolder.title}</h2>

            {images.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No images in this folder yet.</p>
              </div>
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative group break-inside-avoid mb-4 rounded-2xl overflow-hidden shadow-soft"
                  >
                    {img.media_type === "video" ? (
                      <div className="relative cursor-pointer" onClick={() => setLightbox(img)}>
                        <video src={img.image_url} className="w-full block" preload="metadata" />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-12 w-12 text-white" fill="white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={img.image_url}
                        alt="Memory"
                        onClick={() => setLightbox(img)}
                        className="w-full cursor-pointer hover:scale-[1.02] transition-transform"
                      />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadFile(img.image_url); }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); downloadFile(lightbox.image_url); }}
              className="absolute top-6 right-20 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
              title="Download"
            >
              <Download className="h-6 w-6" />
            </button>
            {lightbox.media_type === "video" ? (
              <video
                src={lightbox.image_url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-2xl shadow-glow"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                src={lightbox.image_url}
                alt="Memory full"
                className="max-w-full max-h-full rounded-2xl shadow-glow"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Memories;
