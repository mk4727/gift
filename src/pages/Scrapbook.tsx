import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Sparkles, Flower2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

type ImageRow = { id: string; image_url: string; media_type?: string };

const captions = [
  "us, always 💕", "my favorite day", "you & me", "forever yours",
  "this moment", "pure magic ✨", "couldn't stop smiling", "my heart 💖",
  "golden hour", "best day ever", "stay with me", "endless love",
  "our little world", "just us", "lovely you", "soft & sweet",
  "always together", "my person", "us forever", "every little thing",
  "sweet you", "tender heart", "us, again", "little wonders",
  "soft days", "moonlight", "sunshine", "all mine",
  "us in bloom", "warm hugs", "kiss me", "darling",
  "our song", "you smile", "soft glow", "twinkle",
  "stay close", "us, tonight", "us, tomorrow", "us, forever",
];

const tapeColors = ["bg-yellow-200/70", "bg-pink-200/70", "bg-rose-200/70", "bg-amber-200/70"];

const stickerSet = [
  { Icon: Heart, color: "text-primary fill-primary" },
  { Icon: Star, color: "text-yellow-400 fill-yellow-400" },
  { Icon: Sparkles, color: "text-pink-400 fill-pink-400" },
  { Icon: Flower2, color: "text-rose-300 fill-rose-300" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Photo = {
  id: string;
  url: string;
  caption: string;
  tape: string;
  rotation: number;
  sticker: typeof stickerSet[number];
};

const MAX_PAGES = 20; // inner spreads (each spread has 4 photos)
const FLIP_MS = 1100;

const Scrapbook = () => {
  const isMobile = useIsMobile();
  const [photos, setPhotos] = useState<Photo[]>([]);
  // 0 = cover closed, 1..MAX_PAGES = spreads, MAX_PAGES+1 = back cover
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<null | { dir: 1 | -1; from: number; to: number }>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("images")
        .select("id, image_url, media_type")
        .eq("media_type", "image")
        .limit(500);

      const rows = (data ?? []) as ImageRow[];
      const need = MAX_PAGES * 4;
      const shuffled = shuffle(rows);
      const expanded: ImageRow[] = [];
      while (expanded.length < need && shuffled.length > 0) {
        expanded.push(...shuffled);
      }
      const picked: Photo[] = expanded.slice(0, need).map((p, i) => ({
        id: `${p.id}-${i}`,
        url: p.image_url,
        caption: captions[i % captions.length],
        tape: tapeColors[i % tapeColors.length],
        rotation: (Math.random() - 0.5) * 10,
        sticker: stickerSet[i % stickerSet.length],
      }));
      setPhotos(picked);
    })();
  }, []);

  const totalViews = MAX_PAGES + 2;

  // page slot content (a "half page"): receives a global half-index
  // half 0 = cover front
  // half 1..MAX_PAGES*2 = inner halves (left/right of spreads)
  // half MAX_PAGES*2+1 = back cover
  const photoFor = (halfIdx: number): Photo[] => {
    // halfIdx 1 -> first 2 photos, halfIdx 2 -> next 2, etc.
    const slot = halfIdx - 1;
    const base = slot * 2;
    return photos.slice(base, base + 2);
  };

  const renderPolaroid = (p: Photo, key: string) => (
    <div
      key={key}
      className="bg-white p-2 pb-7 shadow-xl border border-rose-100 relative w-full"
      style={{ transform: `rotate(${p.rotation}deg)` }}
    >
      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 ${p.tape} rotate-[-3deg] shadow-sm rounded-sm`} />
      <div className="aspect-[3/4] w-full bg-secondary/30 overflow-hidden">
        <img src={p.url} alt={p.caption} className="w-full h-full object-contain" draggable={false} />
      </div>
      <p
        className="absolute bottom-0.5 left-0 right-0 text-center text-foreground/80 text-sm md:text-base"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        {p.caption}
      </p>
      <p.sticker.Icon className={`${p.sticker.color} h-5 w-5 absolute -top-1 -right-1 drop-shadow rotate-12`} />
    </div>
  );

  // Inner half page (photos page)
  const InnerHalf = ({ halfIdx, side }: { halfIdx: number; side: "left" | "right" }) => {
    const items = photoFor(halfIdx);
    return (
      <div className="relative w-full h-full bg-[hsl(40_40%_98%)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 28px, hsl(338 40% 80% / 0.25) 28px 29px)",
          }}
        />
        {/* spine inner shadow */}
        <div
          className={`absolute top-0 bottom-0 ${side === "left" ? "right-0" : "left-0"} w-6 pointer-events-none`}
          style={{
            background:
              side === "left"
                ? "linear-gradient(to right, transparent, hsl(30 30% 20% / 0.28))"
                : "linear-gradient(to left, transparent, hsl(30 30% 20% / 0.28))",
          }}
        />
        <div className="grid grid-cols-1 grid-rows-2 gap-3 p-3 md:p-5 h-full">
          {items.map((p, i) => (
            <div key={p.id + i} className="flex items-center justify-center">
              <div className="max-w-[92%] w-full">{renderPolaroid(p, p.id + side + i)}</div>
            </div>
          ))}
        </div>
        <p className={`absolute bottom-2 ${side === "left" ? "left-4" : "right-4"} text-xs text-muted-foreground italic`}>
          page {halfIdx}
        </p>
      </div>
    );
  };

  const CoverFace = ({ kind }: { kind: "front" | "back" }) => {
    if (kind === "front") {
      const coverPhoto = photos[0];
      return (
        <div className="relative w-full h-full overflow-hidden">
          {coverPhoto && (
            <img src={coverPhoto.url} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-rose-400 via-rose-700 to-rose-400 shadow-inner" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
            <p className="text-xs uppercase tracking-[0.4em] opacity-80">Our Story</p>
            <h2 className="font-script text-5xl md:text-6xl drop-shadow">Us & Forever</h2>
            <p className="mt-3 italic opacity-90" style={{ fontFamily: "'Dancing Script', cursive" }}>
              tap to open ✨
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
        <div className="text-center px-6">
          <Heart className="h-14 w-14 mx-auto mb-3 fill-white" />
          <h2 className="font-script text-5xl md:text-6xl">The End… for now</h2>
          <p className="italic mt-2" style={{ fontFamily: "'Dancing Script', cursive" }}>our story keeps going 💕</p>
        </div>
      </div>
    );
  };

  // Render a "page side" given a global slot index
  // slot mapping:
  // index=0 (cover closed): show cover-front on right
  // index=k (1..MAX_PAGES): left half = halfIdx (k*2 - 1), right half = halfIdx (k*2)
  // index=MAX_PAGES+1: back cover
  const leftContent = () => {
    if (index === 0) return null;
    if (index === totalViews - 1) return <CoverFace kind="back" />;
    return <InnerHalf halfIdx={(index - 1) * 2 + 1} side="left" />;
  };
  const rightContent = () => {
    if (index === 0) return <CoverFace kind="front" />;
    if (index === totalViews - 1) return null;
    return <InnerHalf halfIdx={(index - 1) * 2 + 2} side="right" />;
  };

  // Flip overlay faces
  // forward: flipping from right -> left
  //   front face = current right page
  //   back face  = next left page
  // backward: flipping from left -> right
  //   front face = current left page
  //   back face  = previous right page
  const flipFrontContent = () => {
    if (!flip) return null;
    if (flip.dir === 1) {
      // from current right
      if (flip.from === 0) return <CoverFace kind="front" />;
      return <InnerHalf halfIdx={(flip.from - 1) * 2 + 2} side="right" />;
    } else {
      if (flip.from === totalViews - 1) return <CoverFace kind="back" />;
      return <InnerHalf halfIdx={(flip.from - 1) * 2 + 1} side="left" />;
    }
  };
  const flipBackContent = () => {
    if (!flip) return null;
    if (flip.dir === 1) {
      // back face = next left
      if (flip.to === totalViews - 1) return <CoverFace kind="back" />;
      return <InnerHalf halfIdx={(flip.to - 1) * 2 + 1} side="left" />;
    } else {
      if (flip.to === 0) return <CoverFace kind="front" />;
      return <InnerHalf halfIdx={(flip.to - 1) * 2 + 2} side="right" />;
    }
  };

  const triggerFlip = (dir: 1 | -1) => {
    if (flip) return;
    const to = index + dir;
    if (to < 0 || to > totalViews - 1) return;
    setFlip({ dir, from: index, to });
    window.setTimeout(() => {
      setIndex(to);
      setFlip(null);
    }, FLIP_MS);
  };

  const next = () => triggerFlip(1);
  const prev = () => triggerFlip(-1);

  return (
    <Layout>
      <section className="relative py-10 md:py-14 overflow-hidden min-h-[80vh]">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(338 65% 53% / 0.08) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Our Scrapbook</p>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-script text-5xl md:text-7xl text-gradient-rose mb-2">Bits of Us</h1>
            <p className="text-muted-foreground italic" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem" }}>
              open the book and flip through our memories
            </p>
          </motion.div>

          {photos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Add photos from the admin panel to fill the scrapbook.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Book */}
              <div
                className="relative mx-auto"
                style={{ perspective: "2600px", width: isMobile ? "min(94vw, 480px)" : "min(96vw, 1000px)" }}
              >
                <div className={`relative ${isMobile ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                  {/* Bottom shadow / book base */}
                  <div className="absolute -inset-3 rounded-xl bg-gradient-to-b from-stone-900/40 to-stone-900/10 blur-xl -z-10" />

                  {/* Static spread underneath */}
                  <div className={`absolute inset-0 ${isMobile ? "grid grid-cols-1" : "grid grid-cols-2"} rounded-md overflow-hidden border border-rose-200/60 bg-rose-50 shadow-2xl`}>
                    {!isMobile && (
                      <div className="relative w-full h-full overflow-hidden">{leftContent()}</div>
                    )}
                    <div className="relative w-full h-full overflow-hidden">
                      {isMobile
                        ? (index === 0
                            ? <CoverFace kind="front" />
                            : index === totalViews - 1
                              ? <CoverFace kind="back" />
                              : <InnerHalf halfIdx={index} side="right" />)
                        : rightContent()}
                    </div>
                    {!isMobile && (
                      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-5 bg-gradient-to-r from-rose-300/0 via-stone-900/45 to-rose-300/0" />
                    )}
                  </div>

                  {/* Flipping leaf (covers half the book) */}
                  <AnimatePresence>
                    {flip && (
                      <motion.div
                        key={`flip-${flip.from}-${flip.to}`}
                        initial={{ rotateY: flip.dir === 1 ? 0 : -180 }}
                        animate={{ rotateY: flip.dir === 1 ? -180 : 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: FLIP_MS / 1000, ease: [0.45, 0.05, 0.25, 1] }}
                        className="absolute top-0 bottom-0 z-20"
                        style={{
                          left: isMobile ? "0%" : (flip.dir === 1 ? "50%" : "0%"),
                          width: isMobile ? "100%" : "50%",
                          transformStyle: "preserve-3d",
                          transformOrigin: isMobile
                            ? (flip.dir === 1 ? "left center" : "right center")
                            : (flip.dir === 1 ? "left center" : "right center"),
                          willChange: "transform",
                        }}
                      >
                        {/* Front face */}
                        <div
                          className="absolute inset-0 overflow-hidden bg-rose-50 shadow-2xl"
                          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                        >
                          {isMobile
                            ? (flip.from === 0
                                ? <CoverFace kind="front" />
                                : flip.from === totalViews - 1
                                  ? <CoverFace kind="back" />
                                  : <InnerHalf halfIdx={flip.from} side="right" />)
                            : flipFrontContent()}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{ duration: FLIP_MS / 1000, ease: "easeInOut" }}
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                flip.dir === 1
                                  ? "linear-gradient(to left, hsl(30 30% 15% / 0.55), transparent 55%)"
                                  : "linear-gradient(to right, hsl(30 30% 15% / 0.55), transparent 55%)",
                            }}
                          />
                        </div>
                        {/* Back face (mirrored) */}
                        <div
                          className="absolute inset-0 overflow-hidden bg-rose-50 shadow-2xl"
                          style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          {isMobile
                            ? (flip.to === 0
                                ? <CoverFace kind="front" />
                                : flip.to === totalViews - 1
                                  ? <CoverFace kind="back" />
                                  : <InnerHalf halfIdx={flip.to} side="right" />)
                            : flipBackContent()}
                          <motion.div
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: [0.6, 0.2, 0] }}
                            transition={{ duration: FLIP_MS / 1000, ease: "easeOut" }}
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                flip.dir === 1
                                  ? "linear-gradient(to right, hsl(30 30% 15% / 0.45), transparent 55%)"
                                  : "linear-gradient(to left, hsl(30 30% 15% / 0.45), transparent 55%)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Click zones */}
                  <button
                    onClick={prev}
                    disabled={index === 0 || !!flip}
                    aria-label="Previous"
                    className="absolute left-0 top-0 bottom-0 w-1/3 z-30 group disabled:cursor-not-allowed"
                  >
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition bg-white/85 rounded-full p-2 shadow">
                      <ChevronLeft className="h-5 w-5 text-primary" />
                    </span>
                  </button>
                  <button
                    onClick={next}
                    disabled={index === totalViews - 1 || !!flip}
                    aria-label="Next"
                    className="absolute right-0 top-0 bottom-0 w-1/3 z-30 group disabled:cursor-not-allowed"
                  >
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition bg-white/85 rounded-full p-2 shadow">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={prev}
                  disabled={index === 0 || !!flip}
                  className="p-2 rounded-full bg-white shadow border border-rose-200 disabled:opacity-30 hover:bg-rose-50 transition"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-primary" />
                </button>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {index === 0 ? "cover" : index === totalViews - 1 ? "end" : `spread ${index} / ${MAX_PAGES}`}
                </p>
                <button
                  onClick={next}
                  disabled={index === totalViews - 1 || !!flip}
                  className="p-2 rounded-full bg-white shadow border border-rose-200 disabled:opacity-30 hover:bg-rose-50 transition"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5 text-primary" />
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-3 italic">
                ✨ tap the right side to flip a page, left to go back
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Scrapbook;
