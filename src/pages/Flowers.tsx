import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Wind } from "lucide-react";
import { Layout } from "@/components/Layout";

/* ---------- Types ---------- */
type Flower = {
  id: string;
  name: string;
  meaning: string;
  story: string;
  petal: string;       // main petal color
  petalSoft: string;   // highlight
  core: string;        // pistil
  leaf: string;
  petals: number;      // count per layer
  layers: number;
  shape: "round" | "pointed" | "heart" | "ribbon";
  sky: [string, string, string]; // 3 stops
  ground: string;
};

/* ---------- Garden ---------- */
const GARDEN: Flower[] = [
  {
    id: "rose", name: "Rose", meaning: "Love & Passion",
    story: "Velvet petals folded around a beating heart of gold.",
    petal: "345 80% 55%", petalSoft: "350 95% 78%", core: "42 90% 55%", leaf: "140 45% 35%",
    petals: 8, layers: 3, shape: "heart",
    sky: ["340 70% 18%", "345 75% 45%", "20 85% 78%"], ground: "345 50% 12%",
  },
  {
    id: "lotus", name: "Lotus", meaning: "Purity & Rebirth",
    story: "Born of muddy water, opens toward a quiet morning sun.",
    petal: "325 75% 78%", petalSoft: "320 95% 92%", core: "48 95% 60%", leaf: "165 50% 38%",
    petals: 10, layers: 2, shape: "pointed",
    sky: ["210 80% 30%", "220 75% 55%", "325 60% 80%"], ground: "210 65% 18%",
  },
  {
    id: "sunflower", name: "Sunflower", meaning: "Devotion & Light",
    story: "Always turning, always chasing the warmest hour of the day.",
    petal: "42 95% 58%", petalSoft: "50 100% 75%", core: "25 60% 22%", leaf: "85 55% 38%",
    petals: 16, layers: 2, shape: "pointed",
    sky: ["205 85% 70%", "45 100% 82%", "30 90% 70%"], ground: "80 50% 30%",
  },
  {
    id: "cherry", name: "Cherry Blossom", meaning: "Fleeting Beauty",
    story: "A pink snowfall drifting over a sleeping spring village.",
    petal: "345 95% 88%", petalSoft: "0 0% 100%", core: "350 60% 55%", leaf: "150 35% 45%",
    petals: 5, layers: 1, shape: "round",
    sky: ["210 50% 80%", "345 80% 90%", "345 70% 80%"], ground: "150 30% 35%",
  },
  {
    id: "tulip", name: "Tulip", meaning: "Perfect Love",
    story: "A single bowl of color cupping the morning rain.",
    petal: "5 85% 58%", petalSoft: "20 95% 72%", core: "55 90% 55%", leaf: "135 50% 35%",
    petals: 6, layers: 1, shape: "ribbon",
    sky: ["205 80% 60%", "190 70% 75%", "15 85% 78%"], ground: "120 45% 35%",
  },
  {
    id: "lily", name: "Lily", meaning: "Soulful Grace",
    story: "Long-throated trumpets singing white into the night.",
    petal: "0 0% 98%", petalSoft: "325 60% 90%", core: "330 70% 50%", leaf: "150 40% 38%",
    petals: 6, layers: 1, shape: "pointed",
    sky: ["260 60% 25%", "300 50% 45%", "325 70% 75%"], ground: "270 40% 18%",
  },
  {
    id: "iris", name: "Iris", meaning: "Hope & Wisdom",
    story: "A messenger between rainbows and the quiet earth.",
    petal: "260 65% 55%", petalSoft: "280 70% 75%", core: "45 90% 60%", leaf: "150 45% 38%",
    petals: 6, layers: 2, shape: "pointed",
    sky: ["260 70% 25%", "240 60% 45%", "200 70% 70%"], ground: "260 50% 18%",
  },
  {
    id: "daisy", name: "Daisy", meaning: "Innocence & Joy",
    story: "A meadow full of tiny suns, all giggling at once.",
    petal: "0 0% 100%", petalSoft: "50 90% 90%", core: "48 95% 55%", leaf: "120 55% 40%",
    petals: 14, layers: 1, shape: "pointed",
    sky: ["195 85% 75%", "180 60% 85%", "100 70% 85%"], ground: "100 55% 40%",
  },
];

/* ---------- SVG Flower (the centerpiece) ---------- */
const FlowerSVG = ({ f, size = 380 }: { f: Flower; size?: number }) => {
  const petals = Array.from({ length: f.petals });
  const layers = Array.from({ length: f.layers });

  const petalPath = (shape: Flower["shape"]) => {
    switch (shape) {
      case "round":   return "M0,-60 C30,-60 40,-20 0,10 C-40,-20 -30,-60 0,-60 Z";
      case "pointed": return "M0,-80 C18,-50 16,-20 0,10 C-16,-20 -18,-50 0,-80 Z";
      case "heart":   return "M0,-70 C28,-90 60,-60 30,-25 C18,-10 5,0 0,15 C-5,0 -18,-10 -30,-25 C-60,-60 -28,-90 0,-70 Z";
      case "ribbon":  return "M0,-90 C25,-70 25,-20 0,15 C-25,-20 -25,-70 0,-90 Z";
    }
  };

  return (
    <svg viewBox="-150 -180 300 320" width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`grad-${f.id}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor={`hsl(${f.petalSoft})`} />
          <stop offset="70%" stopColor={`hsl(${f.petal})`} />
          <stop offset="100%" stopColor={`hsl(${f.petal} / 0.85)`} />
        </radialGradient>
        <radialGradient id={`core-${f.id}`}>
          <stop offset="0%" stopColor={`hsl(${f.core} / 1)`} />
          <stop offset="100%" stopColor={`hsl(${f.core} / 0.5)`} />
        </radialGradient>
        <filter id={`glow-${f.id}`}>
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Stem */}
      <motion.path
        d="M0,140 C-10,90 10,40 0,0"
        stroke={`hsl(${f.leaf})`} strokeWidth="6" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Leaves */}
      {[-1, 1].map((dir, i) => (
        <motion.path
          key={i}
          d={`M0,${80 - i * 30} C${dir * 40},${70 - i * 30} ${dir * 55},${50 - i * 30} ${dir * 20},${30 - i * 30}`}
          stroke={`hsl(${f.leaf})`} strokeWidth="14" strokeLinecap="round" fill={`hsl(${f.leaf})`} opacity={0.85}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
          transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 120 }}
          style={{ transformOrigin: "0px 60px" }}
        />
      ))}

      {/* Petal layers */}
      {layers.map((_, li) => {
        const layerOffset = li * (360 / f.petals / 2);
        const layerScale = 1 - li * 0.18;
        return (
          <g key={li} style={{ transformOrigin: "0 0" }}>
            {petals.map((__, pi) => {
              const angle = (pi * 360) / f.petals + layerOffset;
              return (
                <motion.path
                  key={pi}
                  d={petalPath(f.shape)}
                  fill={`url(#grad-${f.id})`}
                  initial={{ scale: 0, rotate: angle, opacity: 0 }}
                  animate={{ scale: layerScale, rotate: angle, opacity: 1 - li * 0.15 }}
                  transition={{
                    delay: 1.1 + li * 0.25 + pi * 0.04,
                    type: "spring", stiffness: 140, damping: 14,
                  }}
                  style={{ transformOrigin: "0 0", filter: `drop-shadow(0 4px 6px hsl(${f.petal} / 0.45))` }}
                />
              );
            })}
          </g>
        );
      })}

      {/* Core */}
      <motion.circle
        r="22" fill={`url(#core-${f.id})`} filter={`url(#glow-${f.id})`}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
      />
      {/* pollen */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <motion.circle
            key={i}
            cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="2.5"
            fill={`hsl(${f.core})`}
            initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        );
      })}
    </svg>
  );
};

/* ---------- Small inline flower for the garden grid ---------- */
const MiniFlower = ({ f, active }: { f: Flower; active: boolean }) => (
  <svg viewBox="-100 -100 200 200" className="w-full h-full">
    <defs>
      <radialGradient id={`m-${f.id}`}>
        <stop offset="0%" stopColor={`hsl(${f.petalSoft})`} />
        <stop offset="100%" stopColor={`hsl(${f.petal})`} />
      </radialGradient>
    </defs>
    {Array.from({ length: f.petals }).map((_, i) => {
      const angle = (i * 360) / f.petals;
      return (
        <ellipse
          key={i}
          cx="0" cy="-40" rx="18" ry="38"
          fill={`url(#m-${f.id})`}
          transform={`rotate(${angle})`}
          opacity={active ? 1 : 0.95}
        />
      );
    })}
    <circle r="18" fill={`hsl(${f.core})`} />
  </svg>
);

/* ---------- Ambient particles ---------- */
const Petals = ({ color }: { color: string }) => {
  const items = useMemo(
    () => Array.from({ length: 28 }).map(() => ({
      x: Math.random() * 100,
      d: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      size: 8 + Math.random() * 12,
      rot: Math.random() * 360,
    })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: "-10%",
            width: p.size,
            height: p.size * 0.7,
            background: `hsl(${color} / 0.85)`,
            filter: "blur(0.4px)",
            borderRadius: "60% 40% 60% 40%",
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: [0, 40, -30, 20, 0],
            rotate: [p.rot, p.rot + 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const Sparkle = () => {
  const items = useMemo(
    () => Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 1,
      d: 2 + Math.random() * 3, delay: Math.random() * 4,
    })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 0.6] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
};

/* ---------- Page ---------- */
const Flowers = () => {
  const [activeId, setActiveId] = useState(GARDEN[0].id);
  const flower = GARDEN.find((f) => f.id === activeId)!;

  const bg = `linear-gradient(to bottom,
    hsl(${flower.sky[0]}) 0%,
    hsl(${flower.sky[1]}) 55%,
    hsl(${flower.sky[2]}) 100%)`;

  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Animated sky */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={flower.id + "-sky"}
            className="absolute inset-0"
            style={{ background: bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </AnimatePresence>


        {/* Sun / moon glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "10%", left: "70%", width: 220, height: 220,
            background: `radial-gradient(circle, hsl(${flower.petalSoft} / 0.9), transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Ground silhouette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[28%] pointer-events-none"
          style={{
            background: `linear-gradient(to top, hsl(${flower.ground}), transparent)`,
            maskImage: "linear-gradient(to top, black 60%, transparent)",
          }}
        />

        <Sparkle />
        <Petals color={flower.petal} />

        {/* Header */}
        <div className="relative z-10 container pt-10 pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/15 border border-white/30 text-white text-xs tracking-[0.3em] uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" /> Blossom World
          </motion.div>
          <motion.h1
            key={flower.id + "-title"}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-script text-6xl md:text-7xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
          >
            {flower.name}
          </motion.h1>
          <motion.p
            key={flower.id + "-mean"}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white/90 italic mt-1 tracking-wide"
          >
            “{flower.meaning}”
          </motion.p>
        </div>

        {/* Main bloom */}
        <div className="relative z-10 flex justify-center items-center mt-2 min-h-[420px]">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 460, height: 460,
              background: `radial-gradient(circle, hsl(${flower.petal} / 0.35), transparent 65%)`,
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={flower.id}
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <FlowerSVG f={flower} />
              {/* gentle sway */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Story card */}
        <div className="relative z-10 container max-w-2xl -mt-4 mb-10 text-center">
          <motion.div
            key={flower.id + "-story"}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/15 border border-white/25 rounded-2xl px-6 py-5 text-white shadow-2xl"
          >
            <p className="font-script text-2xl leading-snug">{flower.story}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs uppercase tracking-widest text-white/80">
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {flower.meaning}</span>
              <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {flower.petals * flower.layers} petals</span>
            </div>
          </motion.div>
        </div>

        {/* Garden selector */}
        <div className="relative z-10 container pb-20">
          <div className="mx-auto max-w-5xl rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 md:p-5 shadow-2xl">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
              {GARDEN.map((f) => {
                const active = f.id === activeId;
                return (
                  <motion.button
                    layout
                    key={f.id}
                    onClick={() => setActiveId(f.id)}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    aria-pressed={active}
                    className="group relative aspect-square rounded-2xl p-2 focus:outline-none"
                  >
                    {/* Active glow halo */}
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          layoutId="garden-active-halo"
                          className="absolute -inset-1 rounded-[1.4rem] pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, hsl(${f.petalSoft} / 0.55), hsl(${f.petal} / 0.15) 60%, transparent 75%)`,
                            boxShadow: `0 12px 40px hsl(${f.petal} / 0.45), 0 0 0 1px hsl(0 0% 100% / 0.55) inset`,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Tile surface */}
                    <div
                      className={`absolute inset-0 rounded-2xl border transition-colors duration-500 ${
                        active
                          ? "bg-white/30 border-white/70"
                          : "bg-white/10 border-white/20 group-hover:bg-white/20"
                      }`}
                    />

                    {/* Active dot indicator */}
                    {active && (
                      <motion.span
                        layoutId="garden-active-dot"
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.9)]"
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      />
                    )}

                    <motion.div
                      animate={active ? { rotate: 360, scale: 1.05 } : { rotate: 0, scale: 1 }}
                      transition={{
                        rotate: { duration: 14, repeat: active ? Infinity : 0, ease: "linear" },
                        scale: { type: "spring", stiffness: 220, damping: 18 },
                      }}
                      className="relative w-full h-full"
                    >
                      <MiniFlower f={f} active={active} />
                    </motion.div>

                    <span
                      className={`absolute -bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-white/95 transition-opacity duration-300 ${
                        active ? "opacity-100" : "opacity-0 group-hover:opacity-90"
                      }`}
                    >
                      {f.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};


export default Flowers;
