import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, SkipForward, SkipBack, ListMusic, Check } from "lucide-react";

type Track = { title: string; url: string };

const TRACKS: Track[] = [
  {
    title: "Sanam Teri Kasam Reprise",
     url: "https://cdn.pixabay.com/download/audio/2026/06/05/audio_8ac7832746.mp3?filename=u_peqs3yb1iv-sanam-teri-kasam-reprisekoshalworldcom-547371.mp3",
  },
  {
    title: "Haal-E-Dil (Male Vocals)",
    url: "https://cdn.pixabay.com/download/audio/2026/06/06/audio_6f80f851d3.mp3?filename=u_peqs3yb1iv-haal-e-dil-male-vocalskoshalworldcom-547559.mp3",
  },
  {
    title: "Sanam Teri Kasam",
    url: "https://cdn.pixabay.com/download/audio/2026/06/06/audio_d20101e188.mp3?filename=u_peqs3yb1iv-sanam-teri-kasam-ankit-tiwari-128-kbps-547560.mp3",
  },
  {
    title: "Tera Chehra",
    url: "https://cdn.pixabay.com/download/audio/2026/06/06/audio_2616644862.mp3?filename=u_peqs3yb1iv-tera-chehra-sanam-teri-kasam-128-kbps-547561.mp3",
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const ensureAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TRACKS[index].url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    return audioRef.current;
  };

  const playCurrent = async () => {
    const a = ensureAudio();
    try {
      await a.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const toggle = () => {
    const a = ensureAudio();
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void playCurrent();
    }
  };

  const switchTo = (i: number) => {
    const a = ensureAudio();
    const wasPlaying = playing || a.paused === false;
    a.pause();
    a.src = TRACKS[i].url;
    a.loop = true;
    a.volume = 0.4;
    setIndex(i);
    if (wasPlaying || !playing) {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const next = () => switchTo((index + 1) % TRACKS.length);
  const prev = () => switchTo((index - 1 + TRACKS.length) % TRACKS.length);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-64 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/60 shadow-2xl p-3"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground px-2 pb-2">
              Playlist
            </div>
            <div className="flex flex-col gap-1 max-h-64 overflow-auto">
              {TRACKS.map((t, i) => {
                const active = i === index;
                return (
                  <button
                    key={t.url}
                    onClick={() => switchTo(i)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                      active
                        ? "bg-primary/15 text-primary font-medium"
                        : "hover:bg-foreground/5"
                    }`}
                  >
                    <span className="truncate">{t.title}</span>
                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <button
                onClick={prev}
                aria-label="Previous track"
                className="h-9 w-9 rounded-full hover:bg-foreground/10 flex items-center justify-center"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="h-10 w-10 rounded-full bg-rose-grad text-primary-foreground shadow-glow flex items-center justify-center"
              >
                {playing ? <Pause className="h-4 w-4 fill-current" /> : <Music className="h-4 w-4" />}
              </button>
              <button
                onClick={next}
                aria-label="Next track"
                className="h-9 w-9 rounded-full hover:bg-foreground/10 flex items-center justify-center"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.05, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open playlist"
          className="h-11 w-11 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/60 text-foreground shadow-lg flex items-center justify-center"
        >
          <ListMusic className="h-5 w-5" />
        </motion.button>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="h-14 w-14 rounded-full bg-rose-grad text-primary-foreground shadow-glow flex items-center justify-center border-2 border-white/60"
        >
          <motion.div
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 4, repeat: playing ? Infinity : 0, ease: "linear" }}
          >
            {playing ? <Pause className="h-6 w-6 fill-current" /> : <Music className="h-6 w-6" />}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};
