import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const SecretLetter = () => {
  const [open, setOpen] = useState(false);
  const [letter, setLetter] = useState("");

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "secret_letter")
      .maybeSingle()
      .then(({ data }) => setLetter(data?.value ?? ""));
  }, []);

  return (
    <section className="py-20">
      <div className="container max-w-xl text-center">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="group relative bg-card-grad rounded-3xl p-10 shadow-card-romance border-2 border-dashed border-primary/40 w-full"
        >
          <Mail className="h-16 w-16 mx-auto mb-4 text-primary group-hover:animate-pulse-soft" />
          <h3 className="font-script text-4xl text-gradient-rose mb-2">A Secret Letter</h3>
          <p className="text-sm text-muted-foreground">Click to open... it's just for you ❤️</p>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.7, y: 50, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-romance rounded-3xl p-10 max-w-lg shadow-glow border-2 border-white/60"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/40"
              >
                <X className="h-5 w-5" />
              </button>
              <Heart className="h-12 w-12 fill-primary text-primary mx-auto mb-4 animate-pulse-soft" />
              <h3 className="font-script text-4xl text-center text-gradient-rose mb-6">My Love,</h3>
              <p className="text-foreground/90 leading-relaxed text-lg whitespace-pre-line italic text-center">
                {letter}
              </p>
              <p className="font-script text-2xl text-right mt-6 text-primary">— Yours, always</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
