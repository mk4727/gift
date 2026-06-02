import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RotateCcw, Dice5, HelpCircle, Gamepad2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ---------- Love Quiz ---------- */
const quiz = [
  { q: "Where did we first meet?", a: ["At a cafe", "At a party", "Online", "At school"], correct: 0 },
  { q: "My favorite color?", a: ["Blue", "Pink", "Black", "Red"], correct: 1 },
  { q: "Our favorite song together?", a: ["Perfect", "All of Me", "Thinking Out Loud", "Lover"], correct: 2 },
  { q: "What makes me smile the most?", a: ["Food", "You ❤️", "Movies", "Travel"], correct: 1 },
  { q: "Our perfect date is...", a: ["Beach walk", "Movie night", "Dinner & dance", "All of the above"], correct: 3 },
];

const LoveQuiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === quiz[step].correct) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setStep((s) => s + 1);
    }, 900);
  };

  const reset = () => { setStep(0); setScore(0); setPicked(null); };

  if (step >= quiz.length) {
    return (
      <div className="text-center py-8">
        <Heart className="h-16 w-16 fill-primary text-primary mx-auto mb-4 animate-pulse-soft" />
        <h3 className="font-script text-4xl text-gradient-rose mb-2">You scored {score}/{quiz.length}</h3>
        <p className="text-muted-foreground mb-6">
          {score === quiz.length ? "Perfect! You know me by heart 💕" : score >= 3 ? "So close! You really do know me 💖" : "Aww, time for more dates 😘"}
        </p>
        <Button onClick={reset} className="bg-rose-grad text-primary-foreground rounded-full"><RotateCcw className="mr-2 h-4 w-4" /> Play again</Button>
      </div>
    );
  }

  const cur = quiz[step];
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Question {step + 1} / {quiz.length}</p>
      <h3 className="font-script text-3xl text-foreground mb-6">{cur.q}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {cur.a.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={cn(
              "p-4 rounded-2xl border-2 text-left transition-all",
              picked === null && "border-primary/20 hover:border-primary hover:bg-secondary/40",
              picked !== null && i === cur.correct && "border-green-500 bg-green-50",
              picked === i && i !== cur.correct && "border-destructive bg-destructive/10",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ---------- Tic Tac Toe ---------- */
type Cell = "❤️" | "💙" | null;
const calcWinner = (b: Cell[]) => {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b1,c] of lines) if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  return null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Cell>("❤️");
  const winner = calcWinner(board);
  const draw = !winner && board.every(Boolean);

  const click = (i: number) => {
    if (board[i] || winner) return;
    const n = [...board]; n[i] = turn; setBoard(n);
    setTurn(turn === "❤️" ? "💙" : "❤️");
  };
  const reset = () => { setBoard(Array(9).fill(null)); setTurn("❤️"); };

  return (
    <div>
      <p className="text-center mb-4 text-muted-foreground">
        {winner ? <span className="font-script text-2xl text-gradient-rose">{winner} wins!</span>
          : draw ? "It's a tie 💕" : <>Turn: <span className="text-2xl">{turn}</span></>}
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className="aspect-square rounded-2xl bg-secondary/40 border-2 border-primary/20 hover:border-primary text-4xl flex items-center justify-center transition-all hover:scale-105"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="text-center mt-5">
        <Button onClick={reset} variant="outline" className="rounded-full"><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
      </div>
    </div>
  );
};

/* ---------- Spin the Wheel ---------- */
const wheelOptions = [
  "Cuddle for 5 mins 🥰",
  "Send a sweet text 💌",
  "A long kiss 💋",
  "Cook together 🍳",
  "Movie night 🎬",
  "Dance in the kitchen 💃",
  "Surprise gift 🎁",
  "A heartfelt compliment 💖",
];

const SpinWheel = () => {
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setResult(null);
    const turns = 5 + Math.random() * 3;
    const final = angle + turns * 360;
    setAngle(final);
    setTimeout(() => {
      const idx = Math.floor(((360 - (final % 360)) / (360 / wheelOptions.length))) % wheelOptions.length;
      setResult(wheelOptions[idx]);
      setSpinning(false);
    }, 4200);
  };

  return (
    <div className="text-center">
      <div className="relative w-64 h-64 mx-auto mb-6">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary" />
        <motion.div
          animate={{ rotate: angle }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.21, 0.99] }}
          className="w-full h-full rounded-full border-8 border-primary shadow-glow relative overflow-hidden"
          style={{
            background: `conic-gradient(${wheelOptions.map((_, i) => {
              const c = i % 2 === 0 ? "hsl(345, 90%, 88%)" : "hsl(338, 80%, 75%)";
              return `${c} ${(i / wheelOptions.length) * 360}deg ${((i + 1) / wheelOptions.length) * 360}deg`;
            }).join(", ")})`,
          }}
        >
          {wheelOptions.map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-32 origin-top bg-white/30"
              style={{ transform: `translate(-50%, 0) rotate(${(360 / wheelOptions.length) * i}deg)` }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="h-8 w-8 fill-primary text-primary" />
          </div>
        </motion.div>
      </div>
      <Button onClick={spin} disabled={spinning} className="bg-rose-grad text-primary-foreground rounded-full px-8">
        <Sparkles className="mr-2 h-4 w-4" /> {spinning ? "Spinning..." : "Spin!"}
      </Button>
      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-script text-3xl text-gradient-rose"
          >
            {result}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Truth or Dare ---------- */
const truths = [
  "What's the first thing you noticed about me?",
  "What's your favorite memory of us?",
  "What's one thing you've never told me?",
  "When did you know you loved me?",
  "What's your biggest dream for us?",
];
const dares = [
  "Send me your most embarrassing selfie 😂",
  "Sing our song right now 🎤",
  "Give me a 30-second compliment 💖",
  "Recreate our first date pose 📸",
  "Plan our next surprise date in 2 minutes ⏱️",
];

const TruthOrDare = () => {
  const [mode, setMode] = useState<"truth" | "dare" | null>(null);
  const [text, setText] = useState<string>("");

  const pick = (m: "truth" | "dare") => {
    setMode(m);
    const list = m === "truth" ? truths : dares;
    setText(list[Math.floor(Math.random() * list.length)]);
  };

  return (
    <div className="text-center">
      <div className="flex gap-3 justify-center mb-6">
        <Button onClick={() => pick("truth")} className="bg-rose-grad text-primary-foreground rounded-full px-6">
          <HelpCircle className="mr-2 h-4 w-4" /> Truth
        </Button>
        <Button onClick={() => pick("dare")} variant="outline" className="rounded-full px-6 border-primary text-primary">
          <Dice5 className="mr-2 h-4 w-4" /> Dare
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {mode && (
          <motion.div
            key={text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card-grad rounded-2xl p-8 border border-primary/20 shadow-soft"
          >
            <p className="text-xs uppercase tracking-widest text-primary mb-2">{mode}</p>
            <p className="font-script text-2xl text-foreground">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Page ---------- */
const games = [
  { id: "quiz", title: "Love Quiz", icon: Heart, comp: <LoveQuiz /> },
  { id: "tic", title: "Tic Tac Toe", icon: Gamepad2, comp: <TicTacToe /> },
  { id: "wheel", title: "Spin the Wheel", icon: Sparkles, comp: <SpinWheel /> },
  { id: "td", title: "Truth or Dare", icon: HelpCircle, comp: <TruthOrDare /> },
];

const Games = () => {
  const [active, setActive] = useState(games[0].id);
  const cur = games.find((g) => g.id === active)!;

  return (
    <Layout>
      <section className="container py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-script text-5xl md:text-7xl text-gradient-rose mb-3">Our Little Games</h1>
          <p className="text-muted-foreground text-lg">Play, laugh, fall in love — again 💞</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2",
                active === g.id
                  ? "bg-rose-grad text-primary-foreground border-transparent shadow-soft"
                  : "border-primary/20 text-foreground/70 hover:border-primary"
              )}
            >
              <g.icon className="h-4 w-4" /> {g.title}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-grad rounded-3xl p-6 md:p-10 shadow-card-romance border border-primary/15 min-h-[400px] flex items-center"
        >
          <div className="w-full">{cur.comp}</div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Games;
