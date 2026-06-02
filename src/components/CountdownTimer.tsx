import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const CountdownTimer = () => {
  const [since, setSince] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    supabase
      .from("settings")
      .select("value")
      .eq("key", "together_since")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setSince(new Date(data.value));
      });
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!since) return null;

  const diff = Math.max(0, now.getTime() - since.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section className="py-20">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span className="text-sm font-medium uppercase tracking-widest text-primary">Together Since</span>
            <Heart className="h-5 w-5 fill-primary text-primary" />
          </div>
          <h2 className="font-script text-4xl md:text-5xl text-gradient-rose mb-10">
            Counting every moment with you
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((it) => (
              <div key={it.label} className="bg-card-grad rounded-2xl p-6 shadow-soft border border-primary/10">
                <div className="font-script text-5xl md:text-6xl text-gradient-rose font-bold">
                  {it.value.toString().padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{it.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
