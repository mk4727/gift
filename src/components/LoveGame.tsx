import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const noMessages = [
  "Are you sure? 🥺",
  "Think again ❤️",
  "Wrong answer 😭",
  "Don't break my heart 💔",
  "Try the other one 😉",
  "You don't mean it 🥹",
];

export const LoveGame = () => {
  const [yesSize, setYesSize] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noMsg, setNoMsg] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const handleNoHover = () => {
    setYesSize((s) => Math.min(s + 0.4, 4));
    setNoPos({
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 200,
    });
    setNoMsg(noMessages[Math.floor(Math.random() * noMessages.length)]);
  };

  return (
    <section className="py-20 relative">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-script text-5xl md:text-6xl text-gradient-rose mb-3">A Little Game</h2>
          <p className="text-muted-foreground">Just one question, my love...</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-card-grad backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-card-romance border border-primary/20 text-center min-h-[400px] flex flex-col items-center justify-center"
        >
          <Heart className="h-16 w-16 fill-primary text-primary mx-auto mb-6 animate-pulse-soft" />
          <h3 className="font-script text-4xl md:text-5xl mb-2 text-foreground">Do You Love Me?</h3>

          {noMsg && (
            <motion.p
              key={noMsg}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-medium mt-4 mb-2"
            >
              {noMsg}
            </motion.p>
          )}

          <div className="relative mt-8 flex items-center justify-center gap-6 min-h-[80px]">
            <motion.div animate={{ scale: yesSize }} transition={{ type: "spring", stiffness: 300 }}>
              <Button
                size="lg"
                className="bg-rose-grad hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-soft border-2 border-white/40"
                onClick={() => setShowCelebration(true)}
              >
                <Heart className="mr-2 h-5 w-5 fill-current" /> YES
              </Button>
            </motion.div>

            <motion.div
              animate={{ x: noPos.x, y: noPos.y }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                variant="outline"
                size="lg"
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoHover}
                className="border-2 border-muted text-muted-foreground rounded-full px-6"
              >
                NO
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Celebration popup */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative bg-romance rounded-3xl p-12 max-w-md text-center shadow-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCelebration(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="h-24 w-24 fill-primary text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="font-script text-4xl text-gradient-rose mb-3">I knew it!</h3>
              <p className="text-lg text-foreground">I love you too ❤️</p>

              {/* Confetti hearts */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 2, delay: Math.random() * 0.5 }}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                >
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
