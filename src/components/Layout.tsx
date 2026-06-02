import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { FloatingHearts } from "./FloatingHearts";
import { MusicPlayer } from "./MusicPlayer";
import { Heart } from "lucide-react";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col relative">
    <FloatingHearts />
    <Navbar />
    <main className="flex-1 relative z-10">{children}</main>
    <footer className="relative z-10 border-t border-primary/10 glass mt-20">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for you
        </div>
        <p className="font-script text-lg text-gradient-rose">Forever Us</p>
      </div>
    </footer>
    <MusicPlayer />
  </div>
);
