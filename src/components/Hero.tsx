import { motion } from "framer-motion";
import { Heart, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [quote, setQuote] = useState("Every moment with you is my favorite memory.");

  useEffect(() => {
    supabase
      .from("settings")
      .select("key,value")
      .in("key", ["hero_image", "hero_quote"])
      .then(({ data }) => {
        data?.forEach((s) => {
          if (s.key === "hero_image" && s.value) setHeroImage(s.value);
          if (s.key === "hero_quote" && s.value) setQuote(s.value);
        });
      });
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-primary/20 mb-6"
          >
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">Our Love Story</span>
          </motion.div>

          <h1 className="font-script text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
            <span className="text-gradient-rose">Forever</span>
            <br />
            starts with <span className="text-gradient-rose">you</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground italic max-w-md mx-auto md:mx-0">
            "{quote}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-rose-grad rounded-[2rem] blur-3xl opacity-30 animate-pulse-soft" />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-card-romance bg-card-grad border-4 border-white/80"
          >
            {heroImage ? (
              <img src={heroImage} alt="Us together" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-romance text-primary/60 p-8 text-center">
                <ImageIcon className="h-20 w-20 mb-4" />
                <p className="font-script text-2xl">Our photo goes here</p>
                <p className="text-sm mt-2 text-muted-foreground">Upload via admin panel</p>
              </div>
            )}
          </motion.div>

          {/* Decorative hearts */}
          <Heart className="absolute -top-4 -right-4 h-12 w-12 fill-primary text-primary animate-pulse-soft" />
          <Heart className="absolute -bottom-2 -left-2 h-8 w-8 fill-accent text-accent" style={{ animationDelay: "1s" }} />
        </motion.div>
      </div>
    </section>
  );
};
