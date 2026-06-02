import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail } from "lucide-react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

type Msg = { id: string; title: string; content: string; created_at: string };

const Messages = () => {
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data ?? []));
  }, []);

  return (
    <Layout>
      <section className="container py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Mail className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="font-script text-5xl md:text-7xl text-gradient-rose mb-3">Love Notes</h1>
          <p className="text-muted-foreground text-lg">Little messages just for you ❤️</p>
        </motion.div>

        {messages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Add one in the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m, i) => (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card-grad rounded-3xl p-6 md:p-8 shadow-soft border border-primary/10 relative overflow-hidden"
              >
                <Heart className="absolute -right-4 -top-4 h-24 w-24 fill-primary/5 text-primary/5" />
                <div className="flex items-start gap-3 mb-3">
                  <Heart className="h-5 w-5 fill-primary text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-script text-3xl text-gradient-rose">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line pl-8">{m.content}</p>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Messages;
